
/**
 * Create generic function to generate response
 * @param {*} errorCode
 * @param {*} errorMessage
 */
module.exports.genericResponse = function genericResponse(errorCode, errorMessage, response) {
    return {
      code: errorCode,
      message: errorMessage,
      response: response
    };
};