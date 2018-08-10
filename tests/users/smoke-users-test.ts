import chakram = require("chakram");
import "mocha";
const expect = chakram.expect;
const tags = require("mocha-tags");
import { StatusCodes } from "../../helpers/statusCodes";

const username1: String = "test2@test.com";
const password1: String = "myPassword2";
const invalidUsername: String = "test2test.com";

tags("smoke")
.describe("Users smoke test - should be able to sign up new user", function() {

    let response: any;

    before(function() {
        return chakram.post("http://localhost:3000/users/signup", {
            "email": username1,
            "password": password1
        }).then(function(resp) { response = resp; });
    });

    it("Creating user should return status code of 201", () => {
        return expect(response).to.have.status(StatusCodes.Created);
    });

    it(`response body should contain username ${username1}`, () => {
        return expect(response.body.message).to.contain(username1);
    });
});

tags("smoke")
.describe("Users smoke test - prevent creation of duplicate user", function() {

    let response: any;

    before(function() {
        return chakram.post("http://localhost:3000/users/signup", {
            "email": username1,
            "password": password1
        }).then(function(resp) { response = resp; });
    });

    it("Atempting to create a duplicte user should return status code of 422", () => {
        return expect(response).to.have.status(StatusCodes.UnprocessableEntity);
    });

    it(`response body should contain duplicate user error message`, () => {
        return expect(response.body.message).to.contain(`User ${username1} already exists in the system.`);
    });
});

tags("smoke")
.describe("Users smoke test - username validation", function() {

    let response: any;

    before(function() {
        return chakram.post("http://localhost:3000/users/signup", {
            "email": invalidUsername,
            "password": password1
        }).then(function(resp) { response = resp; });
    });

    it("Atempting to create a duplicte user should return status code of 500", () => {
        return expect(response).to.have.status(StatusCodes.ServerError);
    });

    it(`response body should contain invalid email message when invalid email address used`, () => {
        return expect(response.body.error).to.contain(`User validation failed: email: Path \`email\` is invalid (${invalidUsername}).`);
    });
});