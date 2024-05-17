const request = require("supertest");
const { faker } = require("@faker-js/faker");
const server = require("../index");

const newUser = {
  firstname: "Frederique",
  lastname: "Druet",
  phone: "06111475498",
  address: "Bordeaux",
  email: faker.internet.email(),
  password: "Mdp2024*",
  upload_url: "",
};

describe("POST /api/users", () => {
  it("should create a user", async () => {
    const response = await request(server).post("/api/users").send(newUser);
    expect(response.body).toHaveProperty("insertId");
    expect(response.status).toBe(201);
    expect(response.body.insertId).not.toEqual(undefined);
  });
});

describe("POST /api/login", () => {
  it("should log in a user and return a token", async () => {
    const response = await request(server).post("/api/login").send(newUser);
    expect(response.body).toHaveProperty("token");
    expect(response.status).toBe(200);
    expect(response.body.token).not.toEqual(undefined);
  });
  it("should return an error for incorrect login credentials", async () => {
    const incorrectCredentials = {
      email: "invalidmail@exemple.com",
      password: "wrongpassword",
    };
    const response = await request(server)
      .post("/api/login")
      .send(incorrectCredentials);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toEqual("Identifiant incorrect!!!");
  });
});
