const { app } = require("../app");

const request = require("supertest");

const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const article = require("../db/data/test-data/articles") 
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

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: responds with a single article and contains all the relevant information for it", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toEqual(
            expect.objectContaining({
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            article_id: 3,
            votes: 0,
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }),
            );
        });
    });
    test("400: Responds with appropriate error when invalid id is used", () => {
      return request(app)
        .get("/api/articles/tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: Responds with appropriate error when non-existent id is used", () => {
      return request(app)
        .get("/api/articles/9000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article id does not exist");
        });
    });
  })
})
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
