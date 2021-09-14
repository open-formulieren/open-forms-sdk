/**
 * Render a single form step, as part of a started submission for a form.
 */

import React, {useRef, useContext} from 'react';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import { useHistory, useParams } from 'react-router-dom';
import usePrevious from 'react-use/esm/usePrevious';
import isEqual from 'lodash/isEqual';

import useAsync from 'react-use/esm/useAsync';
import useDebounce from 'react-use/esm/useDebounce';

import { post, put } from 'api';

import Button from 'components/Button';
import Card from 'components/Card';
import FormIOWrapper from 'components/FormIOWrapper';
import { Toolbar, ToolbarList } from 'components/Toolbar';
import Loader from 'components/Loader';
import { ConfigContext } from 'Context';
import Types from 'types';
import LogoutButton from 'components/LogoutButton';


const STEP_LOGIC_DEBOUNCE_MS = 300;


const submitStepData = async (stepUrl, data) => {
  const stepDataResponse = await put(stepUrl, {data});
  return stepDataResponse.data;
};

const doLogicCheck = async (stepUrl, data) => {
  const url = `${stepUrl}/_check_logic`;
  const stepDetailData = await post(url, {data});
  if (!stepDetailData.ok) {
    throw new Error('Invalid response'); // TODO -> proper error & use ErrorBoundary
  }
  return stepDetailData.data;
};

const FormStep = ({
    form,
    submission,
    submissionStepData,
    onLoadFormStep,
    onLogicCheck,
    onStepSubmitted,
    onLogout,
    onSubmissionDataChanged,
}) => {
  const config = useContext(ConfigContext);
  // component state
  const formRef = useRef(null);

  // react router hooks
  const history = useHistory();
  const { step: slug } = useParams();

  const intl = useIntl();

  // look up the form step via slug so that we can obtain the submission step
  const formStep = form.steps.find(s => s.slug === slug);
  const submissionStep = submission.steps.find(s => s.formStep === formStep.url);

  // fetch the form step configuration
  const {loading} = useAsync(() => onLoadFormStep(submissionStep.url), [submissionStep.url]);

  const checkLogic = async (previousData) => {
    if (previousData && isEqual(previousData, submissionStepData.data)) return;

    await onLogicCheck(formRef, submissionStep.url, submissionStepData.data);
  }

  const previousData = usePrevious(submissionStepData.data);

  useDebounce(
    () => checkLogic(previousData),
    STEP_LOGIC_DEBOUNCE_MS,
    [submissionStepData.data]
  );

  const onFormIOSubmit = async ({ data }) => {
    if (!submission) {
      throw new Error("There is no active submission!");
    }

    await submitStepData(submissionStep.url, data);
    // This will reload the submission
    await doLogicCheck(submissionStep.url, data);
    onStepSubmitted(formStep);
  };

  // we wrap the submit so that we control our own submit button, as the form builder
  // does NOT include submit buttons. We need this to navigate between our own steps
  // and navigate flow.
  //
  // The handler of this submit event essentially calls the underlying formio.js
  // instance submit method, which leads to the submit event being emitted, and we tap
  // into that to handle the actual submission.
  const onReactSubmit = (event) => {
    event.preventDefault();

    // current is the component, current.instance is the component instance, and that
    // object has an instance property pointing to the WebForm...
    const formInstance = formRef.current.instance.instance;
    if (!formInstance) {
      console.warn("Form was not rendered (yet), aborting submission.");
      return;
    }

    // submit the Formio.js form instance, which causes the submit event to be emitted.
    formInstance.submit();
  };

  const onFormSave = async (event) => {
    event.preventDefault();
  };

  const onPrevPage = (event) => {
    event.preventDefault();
    const indexPreviousStep = form.steps.indexOf(formStep) - 1;
    const prevStepSlug = form.steps[indexPreviousStep]?.slug;
    const navigateTo = prevStepSlug ? `/stap/${prevStepSlug}` : '/';
    history.push(navigateTo);
  };

  // See https://help.form.io/developers/form-renderer#form-events
  const onFormIOChange = (changed, flags, modifiedByHuman) => {
    // if there are no changes, do nothing
    if ( !(flags && flags.changes && flags.changes.length) ) return;
    if ( !modifiedByHuman ) return;
    const data = {...changed.data};
    onSubmissionDataChanged(data);
  };

  const {data, configuration, canSubmit} = submissionStepData;

  return (
    <Card title={submissionStep.name}>
      { loading ? <Loader modifiers={['centered']} /> : null }

      {
        (!loading && configuration) ? (
          <form onSubmit={onReactSubmit}>
            <FormIOWrapper
              ref={formRef}
              form={configuration}
              submission={{data: data}}
              onChange={onFormIOChange}
              onSubmit={onFormIOSubmit}
              options={{noAlerts: true, baseUrl: config.baseUrl, intl}}
            />
            <Toolbar modifiers={['mobile-reverse-order', 'bottom']}>
              <ToolbarList>
                <Button
                  variant="anchor"
                  component="a"
                  onClick={onPrevPage}
                >{formStep.literals.previousText.resolved}</Button>
              </ToolbarList>
              <ToolbarList>
                <Button
                  type="button"
                  variant="secondary"
                  name="save" onClick={onFormSave} disabled>{formStep.literals.saveText.resolved}</Button>
                <Button
                  type="submit"
                  variant="primary"
                  name="next"
                  disabled={!canSubmit}
                >{formStep.literals.nextText.resolved}</Button>
              </ToolbarList>
            </Toolbar>
            {form.loginRequired ? <LogoutButton onLogout={onLogout}/> : null}
          </form>
        ) : null
      }
    </Card>
  );
};

FormStep.propTypes = {
  form: Types.Form,
  submission: PropTypes.object.isRequired,
  onStepSubmitted: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};


export { FormStep, doLogicCheck };
