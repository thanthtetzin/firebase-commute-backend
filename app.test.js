const request = require("supertest");
const app = require("./app");

describe("Test the '/documents' path", () => {
  test("It should response 403 forbidden without authtoken at header", done => {
    request(app)
      .get("/documents")
      .then(response => {
        expect(response.statusCode).toBe(403);
        done();
      });
  });
});
