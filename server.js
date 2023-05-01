const express = require("express")
const app = express()
const port = 3000
const path = require('path')

const sqlite3 = require("sqlite3").verbose()

const db_comment = new sqlite3.Database("./topic_comments_data.db")
const db_topic = new sqlite3.Database("./topic_content_data.db")

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', '*')
    next();
  });


app.use('/', express.static(path.join(__dirname, 'frontend')))


app.get("/comments/:uid", (req, res) => {
  let uid = req.params.uid;

  if (uid.length > 16) {
    res.send(406);
    return;
  } else {
    let sql = `SELECT * FROM Statistic WHERE author_uid = '${uid}' and reply_time > '2022-12-31 11:21:00' and reply_time < '2023-04-18 00:00:00'`;
    db_comment.all(sql, (err, rows) => {
      if (err) {
        console.error(err);
        res.json([]);
        return;
      }
      res.json(rows);
    });
  }
});

app.get("/topics/:uid", (req, res) => {
  let uid = req.params.uid;

  if (uid.length > 16) {
    res.send(406);
    return;
  } else {
    let sql = `SELECT * FROM Topic WHERE author_uid = '${uid}'`;
    db_topic.all(sql, (err, rows) => {
      if (err) {
        console.error(err);
        res.json([]);
        return;
      }
      res.json(rows);
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
