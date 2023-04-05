const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const pool = require("./elephantSQL");
const pg = require("pg");
const port = 7002;
const WebSocket = require("ws");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authMiddleware = async (authToken) => {
  console.log("line 19", authToken);
  const token = authToken.split(" ")[0];
  console.log("TOKEN", token);
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken;
};

// app.use(authMiddleware);

const wss = new WebSocket.Server({ port: 8000 });

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// wss.on("connection", (ws) => {
//   console.log("Client connected");

//   // Send a message to the client when it connects
//   ws.send("Welcome to the WebSocket server");

//   // Listen for messages from the client
//   ws.on("message", (message) => {
//     console.log(`Received message: ${message}`);
//   });

//   // Listen for notifications from PostgreSQL and send the results to the client
//   const client = new pg.Client();
//   client.connect();
//   client.query("LISTEN new_story");

//   client.on("notification", (notification) => {
//     // Query the database and send the new row to the client
//     pool
//       .query(`SELECT * FROM follower_map WHERE follower_id = 1`)
//       .then((result) => {
//         ws.send(JSON.stringify(result.rows[0]));
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   });

//   // Query the database once to get the initial data and send it to the client
//   pool
//     .query(`SELECT * FROM follower_map WHERE follower_id = 1`)
//     .then((result) => {
//       ws.send(JSON.stringify(result.rows));
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// });

app.get("/aboutsomething", async (req, res) => {
  try {
    const decodedToken = authMiddleware(req.header("Authorization")).then((res) => {
      console.log("RESSS MF", res);
    });
    const stories = await pool.query(
      `
      SELECT
      p.id,
      p.content,
      p.caption,
      p.location,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'profile_picture', u.profile_picture
      ) as user,
      p.timestamp
      FROM stories p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.user_id IN (
        SELECT target_id
        FROM follower_map
        WHERE follower_id = 1
        OR p.user_id = 1
      );
        `
    );
    const posts = await pool.query(
      `
      SELECT
      p.id,
      p.content,
      p.caption,
      p.location,
      p.content_type,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'profile_picture', u.profile_picture
      ) as user,
      p.timestamp,
      (
        SELECT json_agg(
          json_build_object(
            'id', l.id,
            'user', json_build_object('id', lu.id, 'name', lu.name, 'profile_picture', lu.profile_picture),
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
    INNER JOIN users u ON p.user_id = u.id
    WHERE p.user_id IN (
      SELECT target_id
      FROM follower_map
      WHERE follower_id = 1
    );
      `
    );
    res.json({ stories, posts });
  } catch (err) {
    console.log(err);
  }
});

app.get("/", async (req, res) => {
  try {
    const authUser = await authMiddleware(req.header("Authorization"));

    const user = await pool.query(
      `
       SELECT *
       FROM users
       WHERE uid = $1
      `,
      [authUser.uid]
    );

    const id = await user.rows[0].id;

    const stories = await pool.query(
      `
        SELECT
        p.id,
        p.content,
        p.caption,
        p.location,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'profile_picture', u.profile_picture
        ) as user,
        p.timestamp
        FROM stories p
        INNER JOIN users u ON p.user_id = u.id
        WHERE p.user_id IN (
          SELECT target_id
          FROM follower_map
          WHERE follower_id = $1
          OR p.user_id = $1
        );
          `,
      [id]
    );

    const posts = await pool.query(
      `
        SELECT
        p.id,
        p.content,
        p.caption,
        p.location,
        p.content_type,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'profile_picture', u.profile_picture
        ) as user,
        p.timestamp,
        (
          SELECT json_agg(
            json_build_object(
              'id', l.id,
              'user', json_build_object('id', lu.id, 'name', lu.name, 'username', lu.username, 'profile_picture', lu.profile_picture),
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
              'user', json_build_object('id', cu.id, 'name', cu.name, 'username', cu.username),
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
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.user_id IN (
        SELECT target_id
        FROM follower_map
        WHERE follower_id = $1
      );
        `,
      [id]
    );
    res.json({ stories, posts, user });
  } catch (err) {
    console.log(err);
  }
});

app.post("/signup", (req, res) => {
  try {
    console.log("LINE 79", req.header("authorization"));
    const decodedToken = authMiddleware(req.header("Authorization")).then((user) => {
      console.log("decodedToken", user);
      const { fullName, username } = req.body;
      pool.query(
        `INSERT INTO users (email, uid, name, username, timestamp) VALUES ($1 , $2, $3, $4, CURRENT_TIMESTAMP);`,
        [user.email, user.uid, fullName, username]
      );
      return res.send("hi");
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/likePost", async (req, res) => {
  try {
    await pool.query(
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
    await pool.query(`DELETE FROM likes WHERE user_id = $1 AND target_id = $2;`, [
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
    console.log("HMM", req.body);
    await pool.query(
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
    await pool.query(`DELETE FROM comments WHERE user_id = $1 AND post_id = $2;`, [
      req.body.user_id,
      req.body.post_id,
    ]);
    console.log("R E M O V E  C O M M E N T");
    return res.send("bye");
  } catch (err) {
    console.log(err);
  }
});

app.get("/getFollowingList/:username", async (req, res) => {
  try {
    let userId = await pool.query(
      `
     SELECT id
     FROM users
     WHERE username = $1
     `,
      [req.params.username]
    );

    console.log("USER ID ", userId.rows[0].id);
    userId = userId.rows[0].id;

    const followerList = await pool.query(
      `SELECT
        fm.id,
        fm.target_id,
        tu.name AS target_name,
        fm.follower_id,
        fu.name AS follower_name,
        fu.profile_picture AS follower_profile_picture,
        fm.timestamp
      FROM follower_map fm
      INNER JOIN users tu ON fm.target_id = tu.id
      INNER JOIN users fu ON fm.follower_id = fu.id
      WHERE target_id = $1
     ;`,
      [userId]
    );
    const followingList = await pool.query(
      `SELECT
        fm.id,
        fm.target_id,
        tu.name AS target_name,
        tu.profile_picture AS target_profile_picture,
        fm.follower_id,
        fu.name AS follower_name,
        fm.timestamp
      FROM follower_map fm
      INNER JOIN users tu ON fm.target_id = tu.id
      INNER JOIN users fu ON fm.follower_id = fu.id
      WHERE follower_id = $1
     ;`,
      [userId]
    );
    console.log("G E T  F O L L O W I N G  L I S T", followingList);
    return res.json({ followingList, followerList });
  } catch (err) {
    console.log(err);
  }
});

app.post("/follow", async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO follower_map (target_id, follower_id, timestamp) VALUES ($1, $2, CURRENT_TIMESTAMP);`,
      [req.body.target_id, req.body.follower_id]
    );
    console.log("F O L L O W");
    return res.send("bye");
  } catch (err) {
    console.log(err);
  }
});

app.post("/unfollow", async (req, res) => {
  try {
    await pool.query(
      `DELETE FROM follower_map WHERE target_id = $1 AND follower_id = $2;`,
      [req.body.target_id, req.body.follower_id]
    );
    console.log("U N F O L L O W");
    return res.send("bye");
  } catch (err) {
    console.log(err);
  }
});

app.get("/profile/:username", async (req, res) => {
  try {
    let userId = await pool.query(
      `
     SELECT id
     FROM users
     WHERE username = $1
     `,
      [req.params.username]
    );

    userId = userId.rows[0].id;

    const userData = await pool.query(
      `
      SELECT
        id,
        username,
        name,
        email,
        profile_picture,
        timestamp
      FROM users
      WHERE users.username = $1;
     `,
      [req.params.username]
    );

    const posts = await pool.query(
      `
          SELECT
      p.id,
      p.content,
      p.content_type,
      p.caption,
      p.location,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'profile_picture', u.profile_picture
      ) as user,
      p.timestamp,
      (
        SELECT json_agg(
          json_build_object(
            'id', l.id,
            'user', json_build_object('id', lu.id, 'name', lu.name, 'username', lu.username, 'profile_picture', lu.profile_picture),
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
            'user', json_build_object('id', cu.id, 'name', cu.name, 'username', cu.username, 'profile_picture', cu.profile_picture),
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
    INNER JOIN users u ON p.user_id = u.id
    WHERE u.username = $1;
    `,
      [req.params.username]
    );

    const stories = await pool.query(
      `
          SELECT
            p.id,
            p.content,
            p.caption,
            p.location,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'username', u.username,
              'profile_picture', u.profile_picture
            ) as user,
            p.timestamp
          FROM stories p
          INNER JOIN users u ON p.user_id = u.id
          WHERE u.username = $1;
        `,
      [req.params.username]
    );
    console.log("G E T  P RO F ILE ");
    return res.json({ posts, stories, userData });
  } catch (err) {
    console.log(err);
  }
});

app.get("/post/:postID", async (req, res) => {
  try {
    const post = await pool.query(
      `
      SELECT
      p.id,
      p.content,
      p.content_type,
      p.caption,
      p.location,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'profile_picture', u.profile_picture
      ) as user,
      p.timestamp,
      (
        SELECT json_agg(
          json_build_object(
            'id', l.id,
            'user', json_build_object('id', lu.id, 'name', lu.name, 'profile_picture', lu.profile_picture),
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
            'user', json_build_object('id', cu.id, 'name', cu.name, 'profile_picture', cu.profile_picture),
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
    INNER JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
    ;`,
      [req.params.postID]
    );
    console.log("G E T  P O S T ");
    return res.json({ post });
  } catch (err) {
    console.log(err);
  }
});

app.get("/stories/:userID", async (req, res) => {
  try {
    const stories = await pool.query(
      `SELECT
        p.id,
        p.content,
        p.caption,
        p.location,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'profile_picture', u.profile_picture
        ) as user,
        p.timestamp
      FROM stories p
      INNER JOIN users u ON p.user_id = u.id
      WHERE p.user_id = $1`,
      [req.params.userID]
    );
    console.log("G E T  S T O R Y");
    return res.json({ stories });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
