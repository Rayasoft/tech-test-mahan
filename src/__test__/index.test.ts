import { server } from "..";
import request from "supertest";
import { expect } from "chai";

describe("express", function () {
  after(() => {
    server.close();
  });

  it("should respond with 200 for /status", async () => {
    const res = await request(server).get("/status");
    expect(res.statusCode).to.equal(200);
  });

  it("should respond with 404 with non-existant routes", function testPath(done) {
    request(server).get("/non-existant-path").expect(404, done);
  });

  describe("basic auth", async () => {
    it("should respond with 200 when called with valid Authorization header value", async () => {
      const res = await request(server)
        .get("/basic-auth")
        .set(
          "authorization",
          "Basic bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ=="
        );
      expect(res.statusCode).to.equal(200);
    });
    it("should respond with 400 when called with missed Authorization header value", async () => {
      const res = await request(server).get("/basic-auth");
      expect(res.statusCode).to.equal(400);
    });
    it("should respond with 400 when called with missed 'Basic' in Authorization header value", async () => {
      const res = await request(server)
        .get("/basic-auth")
        .set(
          "authorization",
          " bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ=="
        );
      expect(res.statusCode).to.equal(400);
    });
    it("should respond with 400 when called with empty username", async () => {
      let credentialsStr = ":testPassword";
      let buff = Buffer.from(credentialsStr);
      let base64data = buff.toString("base64");
      const res = await request(server)
        .get("/basic-auth")
        .set("authorization", `Basic ${base64data}`);
      expect(res.statusCode).to.equal(400);
    });
    it("should respond with 400 when called with empty password", async () => {
      let credentialsStr = "testUser@gmail.com:";
      let buff = Buffer.from(credentialsStr);
      let base64data = buff.toString("base64");
      const res = await request(server)
        .get("/basic-auth")
        .set("authorization", `Basic ${base64data}`);
      expect(res.statusCode).to.equal(400);
    });
    it("should respond with 400 when called with username includes :", async () => {
      let credentialsStr = "testUser:@gmail.com:password";
      let buff = Buffer.from(credentialsStr);
      let base64data = buff.toString("base64");
      const res = await request(server)
        .get("/basic-auth")
        .set("authorization", `Basic ${base64data}`);
      expect(res.statusCode).to.equal(400);
    });
    it("should respond with 400 when called with password includes :", async () => {
      let credentialsStr = "testUser@gmail.com:pas:sword";
      let buff = Buffer.from(credentialsStr);
      let base64data = buff.toString("base64");
      const res = await request(server)
        .get("/basic-auth")
        .set("authorization", `Basic ${base64data}`);
      expect(res.statusCode).to.equal(400);
    });
    it("should respond with 400 when called with username and password includes :", async () => {
      let credentialsStr = "testUs:er@gmail.com:pas:sword";
      let buff = Buffer.from(credentialsStr);
      let base64data = buff.toString("base64");
      const res = await request(server)
        .get("/basic-auth")
        .set("authorization", `Basic ${base64data}`);
      expect(res.statusCode).to.equal(400);
    });
    it("should respond with 400 when called with username is not an email", async () => {
      let credentialsStr = "testUsergmail.com:password";
      let buff = Buffer.from(credentialsStr);
      let base64data = buff.toString("base64");
      const res = await request(server)
        .get("/basic-auth")
        .set("authorization", `Basic ${base64data}`);
      expect(res.statusCode).to.equal(400);
    });
    it("should respond with 401 when called with an invalid username", async () => {
      let credentialsStr =
        "jake2@microsoft.com:Ev9LDHVXVm0jlVkyUpm3cK&DTxvzX@of7USM3plzoX9A";
      let buff = Buffer.from(credentialsStr);
      let base64data = buff.toString("base64");
      const res = await request(server)
        .get("/basic-auth")
        .set("authorization", `Basic ${base64data}`);
      expect(res.statusCode).to.equal(401);
    });
    it("should respond with 401 when called with an invalid password", async () => {
      let credentialsStr =
        "jake@microsoft.com:2Ev9LDHVXVm0jlVkyUpm3cK&DTxvzX@of7USM3plzoX9A";
      let buff = Buffer.from(credentialsStr);
      let base64data = buff.toString("base64");
      const res = await request(server)
        .get("/basic-auth")
        .set("authorization", `Basic ${base64data}`);
      expect(res.statusCode).to.equal(401);
    });
  });
});
