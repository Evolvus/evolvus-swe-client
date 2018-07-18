const debug = require("debug")("evolvus-swe-client:index");
const axios = require("axios");
var querystring = require('querystring');

var TIME_OUT = process.env.TIME_OUT || 5000;

module.exports.postToSWE = (sweSetupObject) => {
  return new Promise((resolve, reject) => {
    try {
      var SWE_URL = process.env.SWE_URL || "http://localhost:3000/api/setup";
      debug("SWE_URL", SWE_URL);
      if (sweSetupObject == null || sweSetupObject == undefined) {
        debug(`IllegalArgument:Object is ${sweSetupObject}`);
        resolve(`IllegalArgument:Object is ${sweSetupObject}`);
      }
      var instance = axios.create({
        baseURL: SWE_URL,
        timeout: TIME_OUT
      });
      instance.post(SWE_URL, querystring.stringify(sweSetupObject)).then((response) => {
        debug("RESPONSE", response.data);
        resolve(response.data);
      }).catch((error) => {
        debug(`Error:${error} and failed to store is`, sweSetupObject);
        resolve(error);
      });
    } catch (error) {
      debug(`caught exception ${error} and failed to store is`, sweSetupObject);
      resolve(error);
    }
  });
};