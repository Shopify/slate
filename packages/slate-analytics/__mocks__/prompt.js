let newConsentAnswer = {};
let updatedConsentAnswer = {};

module.exports = {
  __setNewConsentAnswer: (newAnswer) =>
    (newConsentAnswer = Object.assign({}, newConsentAnswer, newAnswer)),

  __setUpdatedConsentAnswer: (newAnswer) =>
    (updatedConsentAnswer = Object.assign({}, updatedConsentAnswer, newAnswer)),

  forNewConsent: jest.fn(() => {
    return newConsentAnswer;
  }),

  forUpdatedConsent: jest.fn(() => {
    return updatedConsentAnswer;
  }),
};
