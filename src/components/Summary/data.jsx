import {get} from 'api';

const loadSummaryData = async submissionUrl => {
  return await get(`${submissionUrl.href}/summary`);
};

export {loadSummaryData};
