import {useContext} from 'react';
import {useAsync} from 'react-use';
import type {AsyncState} from 'react-use/lib/useAsyncFn';

import {ConfigContext} from '@/Context';
import {type StepSummaryData, type Submission, loadSummaryData} from '@/data/submissions';

/**
 * Fetch the submission summary data once the submission is available.
 */
export const useLoadSummaryData = (
  submission: Submission | null
): AsyncState<StepSummaryData[] | null> => {
  const {baseUrl} = useContext(ConfigContext);
  const id: string | undefined = submission?.id;
  return useAsync(async () => {
    if (!id) return null;
    return await loadSummaryData(baseUrl, id);
  }, [baseUrl, id]);
};
