const findPreviousApplicableStep = (currentStepIndex, submission) => {
  let candidateStepIndex = currentStepIndex - 1;
  while (candidateStepIndex >= 0 && !submission.steps[candidateStepIndex].isApplicable) {
    candidateStepIndex = candidateStepIndex - 1;
    if (candidateStepIndex < 0) break;
  }
  return candidateStepIndex;
};


const findNextApplicableStep = (currentStepIndex, submission) => {
  let candidateStepIndex = currentStepIndex + 1;
  if (candidateStepIndex >= submission.steps.length) return candidateStepIndex;

  while (!submission.steps[candidateStepIndex].isApplicable) {
    candidateStepIndex = candidateStepIndex + 1;
    if (!submission.steps[candidateStepIndex]) break;
  }
  return candidateStepIndex;
};

export {findNextApplicableStep, findPreviousApplicableStep};
