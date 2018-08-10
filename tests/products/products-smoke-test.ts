import chakram = require("chakram");
import "mocha";
const expect = chakram.expect;
const tags = require("mocha-tags");

tags("smoke")
.describe("products smoke test - HTTP assertions", () => {
    it("should make HTTP assertions easy", () => {
        const response = chakram.get("http://httpbin.org/get?test=chakram");
        expect(response).to.have.status(200);
        expect(response).to.have.header("content-type", "application/json");
        expect(response).to.comprise.of.json({
        args: { test: "chakram" }
        });
        return chakram.wait();
    });
});