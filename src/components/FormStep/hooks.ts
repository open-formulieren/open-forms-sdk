import type {FormioForm} from '@open-formulieren/formio-renderer';
import type {
  RequestVerificationCode,
  VerifyCode,
} from '@open-formulieren/formio-renderer/registry/email/verification/types.js';
import type {JSONObject, JSONValue} from '@open-formulieren/formio-renderer/types.js';
import type {ValidatePluginCallback} from '@open-formulieren/formio-renderer/validationSchema.js';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router';
import type {AsyncState} from 'react-use/esm/useAsync';
import useAsync from 'react-use/esm/useAsync';

import {ConfigContext} from '@/Context';
import {get} from '@/api';
import {getCosignStatus as getCosignStatus_} from '@/components/CoSign';
import {getLoginUrl} from '@/components/LoginOptions/utils';
import {assertSubmission, useSubmissionContext} from '@/components/SubmissionProvider';
import {fetchCommunicationPreferences} from '@/data/customer-profile';
import {createTemporaryFileUpload, destroyTemporaryFileUpload} from '@/data/file-uploads';
import type {Form, MinimalFormStep} from '@/data/forms';
import {autoCompleteAddress} from '@/data/geo';
import {type SubmissionStep, checkStepLogic} from '@/data/submission-steps';
import {
  type NestedSubmissionStep,
  type Submission,
  requestEmailVerificationCode,
  verifyEmailCode,
} from '@/data/submissions';
import {validateValue} from '@/data/validation';
import useFormContext from '@/hooks/useFormContext';

interface ResolvedStep {
  /**
   * The step definition from the form containing metadata.
   */
  formStep: MinimalFormStep;
  /**
   * A minimal representation of the form step in the context of the current submission.
   */
  submissionStep: NestedSubmissionStep;
}

/**
 * Grab the step slug from the URL/router parameters and resolve it to the form and
 * submission step of the current submission.
 */
export const useResolveStepUrl = (form: Form, submission: Submission): ResolvedStep => {
  const {step: slug} = useParams();
  // look up the form step via slug so that we can obtain the submission step
  const formStep = form.steps.find(s => s.slug === slug);
  if (!formStep) throw new Error(`No step with slug ${slug} found in form!`);
  const submissionStep = submission.steps.find(s => s.formStep === formStep.url);
  // the backend ensures there's always a matching submission step for a form step
  return {
    formStep,
    submissionStep: submissionStep!,
  };
};

/**
 * Retrieve the submission step from the backend.
 *
 * Any non-success HTTP status codes throw - these are available in the `error` property
 * of the return state.
 */
export const useLoadStep = (
  resourceUrl: string,
  onLoaded: (step: SubmissionStep) => void
): AsyncState<SubmissionStep> => {
  const state = useAsync(async () => {
    const step = (await get<SubmissionStep>(resourceUrl))!;
    window.scrollTo({left: 0, top: 0, behavior: 'smooth'});
    onLoaded(step);
    return step;
  }, [onLoaded, resourceUrl]);
  return state;
};

interface CheckStepLogic {
  scheduleLogicCheck: () => void;
  inProgress: boolean;
}

/**
 * Hook to manage logic check scheduling and aborting in-flight requests.
 *
 * @todo check previous/current data and if they're different or not. If they're equal,
 * skip the logic check.
 * @todo check if we need extra in-between abort-controller checks
 * @todo strip out invalid keys from the data
 * @todo incorporate the email verification
 */
export const useCheckStepLogic = (
  submissionStepUrl: string,
  valuesRef: React.MutableRefObject<JSONObject | null>,
  onLogicCheckResult: (submission: Submission, step: SubmissionStep) => void,
  debounce_ms: number = 500
): CheckStepLogic => {
  const timerRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [inProgress, setInProgress] = useState<boolean>(false);

  const scheduleLogicCheck = () => {
    // cancel any newly pending/scheduled logic checks
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // schedule a logic check in `debounce_ms`
    timerRef.current = window.setTimeout(async () => {
      setInProgress(true);
      // cancel in-flight requests
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // always use the latest state of values, even if the logic check was scheduled
      // for other input. Doing logic checks on stale/changed data doesn't have a point.
      const values = valuesRef.current;
      // do nothing if there's no submission data
      if (values !== null) {
        // TODO: strip out the field values that don't pass client-side validation (!)
        const {submission, step} = await checkStepLogic(
          submissionStepUrl,
          values,
          controller.signal
        );
        onLogicCheckResult(submission, step);
      }

      setInProgress(false);
    }, debounce_ms);
  };

  // hook up cleanup functions for when the component unmounts
  useEffect(() => {
    return () => {
      setInProgress(false);
      // cancel any in-flight logic checks
      if (abortRef.current) abortRef.current.abort();
      // cancel any newly pending/scheduled logic checks
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return {scheduleLogicCheck, inProgress};
};

/**
 * Extract all the necessary configuration 'context' for the FormioForm, injecting the
 * dependencies for the various component types that may be used.
 */
export const useFormioFormConfigurationParameters = (): Pick<
  React.ComponentProps<typeof FormioForm>,
  'componentParameters' | 'validatePluginCallback'
> => {
  const {baseUrl} = useContext(ConfigContext);
  const form = useFormContext();
  const {submission} = useSubmissionContext();
  assertSubmission(submission);

  const {id: submissionId} = submission;
  const validatePluginCallback = useCallback(
    async (plugin: string, value: JSONValue) => {
      const {isValid, messages} = await validateValue(baseUrl, plugin, submissionId, value);
      const result: Awaited<ReturnType<ValidatePluginCallback>> = isValid
        ? {valid: true}
        : {valid: false, messages};
      return result;
    },
    [baseUrl, submissionId]
  );
  const addressAutoComplete = useCallback(
    async (postcode: string, houseNumber: string) =>
      await autoCompleteAddress(baseUrl, postcode, houseNumber),
    [baseUrl]
  );

  const getCosignStatus = useCallback(
    async () => await getCosignStatus_(baseUrl, submissionId),
    [baseUrl, submissionId]
  );
  const getLoginOption = useCallback(
    (authPlugin: string) => {
      const loginOption = form.loginOptions.find(opt => opt.identifier === authPlugin);

      if (!loginOption) return null;
      loginOption.url = getLoginUrl(loginOption, {coSignSubmission: submissionId});
      return loginOption;
    },
    [form, submissionId]
  );

  const fetchDigitalAddresses = useCallback(
    async (componentKey: string): ReturnType<typeof fetchCommunicationPreferences> => {
      return await fetchCommunicationPreferences(baseUrl, submissionId, componentKey);
    },
    [baseUrl, submissionId]
  );

  const upload = useCallback(
    async (file: File): ReturnType<typeof createTemporaryFileUpload> => {
      return await createTemporaryFileUpload(baseUrl, submission, file);
    },
    [baseUrl, submission]
  );

  const requestVerificationCode: RequestVerificationCode = useCallback(
    async (componentKey: string, email: string) => {
      return await requestEmailVerificationCode(baseUrl, submission, componentKey, email);
    },
    [baseUrl, submission]
  );
  const verifyCode: VerifyCode = useCallback(
    async (componentKey: string, email: string, code: string) => {
      return await verifyEmailCode(baseUrl, submission, componentKey, email, code);
    },
    [baseUrl, submission]
  );

  return {
    validatePluginCallback,
    componentParameters: {
      addressNL: {addressAutoComplete},
      coSign: {getCosignStatus, getLoginOption},
      customerProfile: {
        fetchDigitalAddresses,
        portalUrl: form.communicationPreferencesPortalUrl,
      },
      email: {requestVerificationCode, verifyCode},
      file: {
        upload,
        destroy: destroyTemporaryFileUpload,
      },
    },
  };
};
