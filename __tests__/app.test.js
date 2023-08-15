const { app } = require("../app");

const request = require("supertest");

const db = require("../db/connection");

const seed = require("../db/seeds/seed");

const data = require("../db/data/test-data/index.js");
const endpoint = require('../endpoints.json')
beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});
describe("/api/topics", () => {
  test("GET 200: Responds with an array of topic objects with slugs and descriptions", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(topics).toEqual([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
    });
});
describe("/api", () => {
  test("GET: 200: responds with object containing all the ap endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints  = response.body;
        expect(endpoints).toEqual({
         endpoint
        });
      });
    })
  })
