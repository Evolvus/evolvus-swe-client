const debug = require("debug")("evolvus-swe-client.test.index");
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const shortid = require("shortid");

chai.use(chaiAsPromised);

let index = require("../index");

describe('testing index.js', () => {
  let sweSetupObject = {
    tenantId: "T001",
    wfEntity: "Role",
    wfEntityAction: "create",
    flowCode: "flow",
    createdBy: "KamalaraniP"
  };
  let invalidsweEvent = {

    flowCode: "flow",
    createdBy: "KamalaraniP"
  };

  describe("testing with sweSetup objects", () => {
    beforeEach((done) => {
      process.env.SWE_URL = "http://localhost:3000/api/setup";
      done();
    });

    it('should save valid object to database', (done) => {
      var res = index.postToSWE(sweSetupObject);
      expect(res)
        .to.be.eventually.have.property('data')
        .to.include(sweSetupObject)
        .notify(done);
    });

    it('should respond with status code 400 if sweObject is invalid', (done) => {
      var res = index.postToSWE(invalidsweEvent);
      expect(res)
        .to.be.fulfilled.then((resp) => {
          expect(resp.response.status)
            .to.be.eql(400);
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
      process.env.SWE_URL = "http://localhost:4000/api/setup";
      done();
    });

    it('should respond with connection refused if workflow engine is down', (done) => {
      var res = index.postToSWE(sweSetupObject);
      expect(res)
        .to.be.fulfilled.then((resp) => {
          expect(resp.code)
            .to.be.include("ECONNREFUSED");
          done();
        });
    });
  });
});