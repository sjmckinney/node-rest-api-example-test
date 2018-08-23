import chakram = require("chakram");
import "mocha";
const expect = chakram.expect;
const tags = require("mocha-tags");
import { StatusCodes } from "../../helpers/statusCodes";
import { Users } from "../../helpers/userHelpers";
import { SystemMessages } from "../../helpers/systemMessages";

const users: Users = new Users();
const username1: String = "test2@test.com";
const password1: String = "myPassword2";
const username2: String = "test3@test.com";
const password2: String = "myPassword3";
const invalidUsername: String = "test2test.com";
const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
const MONGODB_ID_REGEX = /^[a-f\d]{24}$/i;

tags("smoke")
.describe("Users smoke test - should be able to sign up new user", function() {

    let response: any;

    before(async function() {

        response = await users.createUser(username1, password1);

    });

    it("Creating user should return status code of 201", () => {
        return expect(response).to.have.status(StatusCodes.Created);
    });

    it(`Response should contain username ${username1}`, () => {
        return expect(response.body.message).to.contain(username1);
    });
});

tags("smoke")
.describe("Users smoke test - should be able to log in as an existing user and recieve a JWT in return", function() {

    let response: any;

    before(async function() {

        response = await users.loginAsUser(username1, password1);

    });

    it(`Logging into system as user ${username1} should return status code of 200`, () => {
        return expect(response).to.have.status(StatusCodes.Success);
    });

    it("Response should contain message 'User authentication succeeded'", () => {
        return expect(response.body.message).to.contain(SystemMessages.AuthSucceeded);
    });

    it("Response should contain a JWT token property", () => {
        return expect(response.body.token).not.to.equal(undefined);
    });

    it("Response should contain a valid JWT token", () => {
        return expect(response.body.token).to.match(JWS_REGEX);
    });
});

tags("smoke")
.describe("Users smoke test - should not be able to log in if username incorrect", function() {

    let response: any;

    before(async function() {

        response = await users.loginAsUser(invalidUsername, password1);

    });

    it(`Logging into system as user ${invalidUsername} should return status code of 401`, () => {
        return expect(response).to.have.status(StatusCodes.Unauthorized);
    });

    it("Response should contain message 'User authentication failed'", () => {
        return expect(response.body.message).to.contain(SystemMessages.AuthFailed);
    });

    it("Response should NOT contain a JWT token property", () => {
        return expect(response.body.token).to.equal(undefined);
    });
});

tags("smoke")
.describe("Users smoke test - should not be able to log in if password incorrect", function() {

    let response: any;
    const badPwd: String = "IamClearlyWrong";

    before(async function() {

        response = await users.loginAsUser(username1, badPwd);

    });

    it(`Logging into system as user with incorrect password should return status code of 401`, () => {
        return expect(response).to.have.status(StatusCodes.Unauthorized);
    });

    it("Response should contain message 'User authentication failed'", () => {
        return expect(response.body.message).to.contain(SystemMessages.AuthFailed);
    });

    it("Response should NOT contain a JWT token property", () => {
        return expect(response.body.token).to.equal(undefined);
    });
});

tags("smoke")
.describe("Users smoke test - prevent creation of duplicate user", function() {

    let response: any;

    before(async function() {

        response = await users.createUser(username1, password1);
    });

    it("Atempting to create a duplicate user should return a status code of 422", () => {
        return expect(response).to.have.status(StatusCodes.UnprocessableEntity);
    });

    it("Returned message should contain duplicate user error message", () => {
        return expect(response.body.message).to.contain(SystemMessages.UserTest2Exists);
    });
});

tags("smoke")
.describe("Users smoke test - username validation on creation", function() {

    let response: any;

    before(async function() {

        response = await users.createUser(invalidUsername, password1);
    });

    it("Atempting to create a user with an invalid email should return a status code of 500", () => {
        return expect(response).to.have.status(StatusCodes.ServerError);
    });

    it("Response should contain invalid email message when invalid value used", () => {
        return expect(response.body.error).to.contain(SystemMessages.InvalidUsername);
    });
});

tags("smoke")
.describe("Users smoke test - should be able to retrieve all users", function() {

    let response: any;

    before(async function() {

        await users.createUser(username2, password2);
        
        response = await users.getAllUsers();

    });

    it("Successfully retrieving all users should return a status code of 200", () => {
        return expect(response).to.have.status(StatusCodes.Success);
    });

    it("There should be two users in the system", () => {
        return expect(response.body.length).to.equal(2);
    });

    it("Returned user records should have valid mongodb.id as '_id' property", () => {
        const firstUserId = response.body[0]._id;
        const secondUserId = response.body[1]._id;
        return (expect(firstUserId).to.match(MONGODB_ID_REGEX) &&
                expect(secondUserId).to.match(MONGODB_ID_REGEX));
    });

    it("Returned user records should contain the users' email addresses", () => {
        return expect(`${response.body[0].email}, ${response.body[1].email}`).to.include(username1, username2);
    });

    it("Returned user records should NOT contain a password field", () => {
        return expect(response.body[0].password).to.equal(undefined);
    });
});

tags("smoke")
.describe("Users smoke test - should be able to delete a user", function() {

    let response: any;
    let user: any;

    before(async function() {
        
        user = await users.getTest3User();

        response = await users.deleteUser(username2);

    });

    it("Response should contain correct message", () => {
        return expect(response.body.message).to.equal(SystemMessages.UserTest3Deleted);
    });

    it("Having deleted a record the response should contain exactly one record", async () => {
        
        let response = await users.getAllUsers();
        return expect(response.body.length).to.equal(1);
    });
});
