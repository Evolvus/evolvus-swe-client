const debug = require("debug")("evolvus-swe-client:index");
const axios = require("axios");

var TIME_OUT = process.env.TIME_OUT || 5000;

module.exports.postToSWE = (sweEventObject) => {

  return new Promise((resolve, reject) => {
    try {
      var SWE_URL = process.env.SWE_URL || "http://localhost:3000";
      if (sweEventObject == null) {
        debug(`IllegalArgument:Object is ${sweEventObject}`);
        resolve(`IllegalArgument:Object is ${sweEventObject}`);
      }
      var instance = axios.create({
        baseURL: SWE_URL,
        timeout: TIME_OUT
      });

      instance.post(SWE_URL, sweEventObject).then((response) => {
        debug("response is", response.data);
        resolve(response.data);
      }).catch((error) => {
        debug(`Error:${error} and failed to store is`, sweEventObject);
        resolve(sweEventObject);
      });
    } catch (error) {
      debug(`caught exception ${error} and failed to store is`, sweEventObject);
      resolve(error);
    }
  });
};