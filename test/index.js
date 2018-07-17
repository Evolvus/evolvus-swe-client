const debug = require("debug")("evolvus-swe-client.test.index");
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const shortid = require("shortid");

chai.use(chaiAsPromised);

let index = require("../index");

describe('testing index.js', () => {
  let sweEventObject = {
    wfInstanceId: shortid.generate(),
    wfInstanceStatus: "IN_PROGRESS",
    wfEntity: "ROLE",
    wfEntityAction: "CREATE",
    query: JSON.stringify("query"),
    wfEventDate: Date.now(),
    wfEvent: "PENDING_AUTHORIZATION",
    createdBy: "KamalaraniP",
    createdDate: Date.now()
  };
  let invalidsweEvent = {
    wfInstanceId: shortid.generate(),
    wfInstanceStatus: "IN_PROGRESS",
    query: JSON.stringify("query"),
    wfEventDate: Date.now(),
    wfEvent: "PENDING_AUTHORIZATION",
    createdBy: "KamalaraniP",
    createdDate: Date.now()
  };

  describe("testing with sweEvent objects", () => {
    beforeEach((done) => {
      process.env.SWE_URL = "http://localhost:3000";
      done();
    });

    it('should save valid object to database', (done) => {
      var res = index.postToSWE(sweEventObject);
      expect(res)
        .to.be.eventually.include(sweEventObject)
        .notify(done);
    });

    it('should respond with status code 400 if sweObject is invalid', (done) => {
      var res = index.postToSWE(invalidsweEvent);
      expect(res)
        .to.be.fulfilled.then((resp) => {
          expect(resp).to.include(invalidsweEvent);
          done();
        });
    });

    it('should be resolved with IllegalArgument when input object is null', (done) => {
      var res = index.postToSWE(null);
      expect(res)
        .to.be.eventually.include("IllegalArgument")
        .notify(done);
    });

    it('should be resolved with IllegalArgument when input object is undefined', (done) => {
      let input;
      var res = index.postToSWE(input);
      expect(res)
        .to.be.eventually.include("IllegalArgument")
        .notify(done);
    });
  });

  describe("testing when the server is down", () => {
    beforeEach((done) => {
      process.env.SWE_URL = "http://localhost:4000";
      done();
    });

    it('should respond with connection refused if workflow engine is down', (done) => {
      var res = index.postToSWE(sweEventObject);
      expect(res).to.be.fulfilled.then((resp) => {
        expect(resp).to.include(sweEventObject);
        done();
      });
    });
  });
});