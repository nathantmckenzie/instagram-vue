const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const client = require("./elephantSQL");
const port = 7002;

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const posts = await client.query(
      `
      SELECT
      p.id,
      p.content,
      json_build_object(
        'id', u.id,
        'name', u.name
      ) as user,
      p.timestamp,
      (
        SELECT json_agg(
          json_build_object(
            'id', l.id,
            'user', json_build_object('id', lu.id, 'name', lu.name),
            'target_id', l.target_id,
            'timestamp', l.timestamp
          )
        )
        FROM likes l
        INNER JOIN users lu ON l.user_id = lu.id
        WHERE l.target_id = p.id
      ) as likes,
      (
        SELECT json_agg(
          json_build_object(
            'id', c.id,
            'content', c.content,
            'post_id', c.post_id,
            'user', json_build_object('id', cu.id, 'name', cu.name),
            'timestamp', c.timestamp
          )
        )
        FROM (
          SELECT *
          FROM comments
          WHERE post_id = p.id
          ORDER BY id ASC
        ) c
        INNER JOIN users cu ON c.user_id = cu.id
      ) as comments
    FROM posts p
    INNER JOIN users u ON p.user_id = u.id;
      `
    );
    res.json({ posts });
  } catch (err) {
    console.log(err);
  }
});

app.post("/likePost", async (req, res) => {
  try {
    await client.query(
      `INSERT INTO likes (user_id, target_id, timestamp) VALUES ($1, $2, CURRENT_TIMESTAMP);`,
      [req.body.user_id, req.body.target_id]
    );
    console.log("L I K E S");
    return res.send("hi");
  } catch (err) {
    console.log(err);
  }
});

app.post("/removeLikePost", async (req, res) => {
  try {
    await client.query(`DELETE FROM likes WHERE user_id = $1 AND target_id = $2;`, [
      req.body.user_id,
      req.body.target_id,
    ]);
    console.log("REMOVE L I K E S");
    return res.send("bye");
  } catch (err) {
    console.log(err);
  }
});

app.post("/addCommentPost", async (req, res) => {
  try {
    await client.query(
      ` INSERT INTO comments (content, post_id, user_id, timestamp) VALUES ($1, $2, $3, CURRENT_TIMESTAMP);`,
      [req.body.content, req.body.post_id, req.body.user_id]
    );
    console.log("A D D  C O M M E N T");
    return res.send("bye");
  } catch (err) {
    console.log(err);
  }
});

app.post("/removeCommentPost", async (req, res) => {
  try {
    await client.query(`DELETE FROM comments WHERE user_id = $1 AND post_id = $2;`, [
      req.body.user_id,
      req.body.post_id,
    ]);
    console.log("R E M O V E  C O M M E N T");
    return res.send("bye");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
