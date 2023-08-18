const { app } = require("../app");

const request = require("supertest");

const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const article = require("../db/data/test-data/articles");
const data = require("../db/data/test-data/index.js");
const endpoint = require("../endpoints.json");
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
            })
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
  });
});
describe("/api", () => {
  test("GET: 200: responds with object containing all the api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body;
        expect(endpoints).toEqual({
          endpoint,
        });
      });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200: responds with array of articles with comment counts in descending date order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    test("GET 200   | Returns object ordered by date descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({
            key: "created_at",
            descending: true,
          });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200   | Return 200 and array with correct comment objects", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).not.toBe(0);
        body.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment.article_id).toBe(3);
        });
      });
  });
  test("GET 200   | Return empty array when given article_id with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(0);
      });
  });
  test("GET 200   | Return the array ordered by most recent comments first", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 404   | Return 400 and sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/10000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET 400   | Return 400 and sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/three/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST", () => {
  test("201: creates new comment and responds with newly created comment from table", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "rogersop", body: "A whacky good read" })
      .expect(201)
      .then((response) => {
        const { comment } = response.body;
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("body", "A whacky good read");
        expect(comment).toHaveProperty("article_id", 3);
        expect(comment).toHaveProperty("author", "rogersop");
      });
  });
  test("400: responds with appropriate error message when invalid id is sumbimtted", () => {
    return request(app)
      .post("/api/articles/wrongspace/comments")
      .send({ username: "rogersop", body: "A whacky good read" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with appropriate error message when id does not exist", () => {
    return request(app)
      .post("/api/articles/9000/comments")
      .send({ username: "rogersop", body: "A whacky good read" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with the correct error message when username does not exist", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ username: "Billy", body: "A whacky good read" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with the correct error message when the input body is missing information", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ body: "A whacky good read" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
test("200: responds with newly created comment when additional not needed infomation is added to the right request body", () => {
  return request(app)
    .post("/api/articles/3/comments")
    .send({
      username: "rogersop",
      body: "A whacky good read",
      hobby: "running",
    })
    .expect(201)
    .then((response) => {
      const { comment } = response.body;
      expect(comment).toHaveProperty("votes", 0);
      expect(comment).toHaveProperty("comment_id");
      expect(comment).toHaveProperty("created_at");
      expect(comment).toHaveProperty("body", "A whacky good read");
      expect(comment).toHaveProperty("article_id", 3);
      expect(comment).toHaveProperty("author", "rogersop");
    });
});

describe("PATCH", () => {
  test("200: updates votes for the given article by article id and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toEqual({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          article_id: 3,
          votes: 1,
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: responds with appropriate error message when article id isan  invalid thingy magigy ", () => {
    return request(app)
      .patch("/api/articles/tree")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("400: responds with appropriate error message when body contains a non-integer value", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "tree" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("404: responds with an appropriate error message when article id does not exist", () => {
    return request(app)
      .patch("/api/articles/1231212")
      .send({ inc_votes: 1 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article id does not exist");
      });
  });
  test("200: responds with given article and updates votes if request body has unnecessary info", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1, mood: "great" })
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        expect(article).toEqual({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          article_id: 3,
          votes: 1,
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  describe("GET", () => {
    test("200: responds with 200 when comment exists", () => {
      return request(app).get("/api/comments/3").expect(200);
    });
    test("400: responds with appropriate error message when comment id is invalid", () => {
      return request(app)
        .get("/api/comments/tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with appropriate error message when comment id does not exist", () => {
      return request(app)
        .get("/api/comments/1231212")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Comment id does not exist");
        });
    });
  });
  describe("DELETE Request thingy", () => {
    test("204: deletes comment by given comment id", () => {
      return request(app)
        .delete("/api/comments/3")
        .expect(204)
        .then(() => {
          return request(app).get("/api/comments/3").expect(404);
        })
        .then((response) => {
          expect(response.body.msg).toBe("Comment id does not exist");
        });
    });
    test("400: responds with appropriate error message when comment id is invalid", () => {
      return request(app)
        .delete("/api/comments/tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with appropriate error message when comment id does not cracker lacking exist", () => {
      return request(app)
        .delete("/api/comments/1231212")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Comment id does not exist");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("200: responds with the array of the users with right username, name, and avatar_url properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { users } = response.body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
