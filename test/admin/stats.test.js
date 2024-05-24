const request = require("supertest");
const expect = require("chai").expect;
const app = require("../../server.js");
const adminToken = process.env.TEST_ADMIN_TOKEN; // Replace 'token' with an actual non expired admin token
const nonAdminToken = process.env.TEST_NON_ADMIN_TOKEN; // Replace 'token' with a non expired non-admin token
describe("Admin Stats Endpoint", () => {
  it("should return stats", async () => {
    const res = await request(app)
      .get("/api/user/stats")
      .set("Authorization", "Bearer " + adminToken);

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.be.an("array");
    expect(res.body.page).to.be.a("number");
    expect(res.body.limit).to.be.a("number");
    expect(res.body.total).to.be.a("number");
    expect(res.body.hasNextPage).to.be.a("boolean");
    expect(res.body.hasPrevPage).to.be.a("boolean");
    const firstData = res.body.data[0];
    expect(firstData).to.have.property("name");
    expect(firstData).to.have.property("role");
    expect(firstData).to.have.property("adsCount");
    expect(firstData).to.have.property("totalAdsAmount");
    expect(firstData).to.have.property("requestsCount");
    expect(firstData).to.have.property("totalRequestsAmount");

  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app)
      .get("/api/user/stats")
      .set("Authorization", "");

    expect(res.statusCode).to.equal(401);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("message");
    expect(res.body.message).to.equal("No auth token");
  });

  it("should return 403 if a non-admin token is provided", async () => {
    const res = await request(app)
      .get("/api/user/stats")
      .set("Authorization", "Bearer " + nonAdminToken);

    expect(res.statusCode).to.equal(403);
    expect(res.body).to.be.an("object");
    expect(res.body).to.have.property("message");
    expect(res.body.message).to.equal("Unauthorized");
  });
});
