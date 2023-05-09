const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

var mysql = require("mysql2");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "report_darbs",
  multipleStatements: true,
});
connection.connect();

app.get("/user", (req, res) => {
  connection.query(`SELECT id, vards, uzv FROM employer`, (error, result) => {
    res.send(result);
  });
});

app.get("/source", (req, res) => {
  connection.query(`SELECT id, name_lv FROM report_source`, (error, result) => {
    res.send(result);
  });
});

app.get("/object", (req, res) => {
  connection.query(`SELECT id, name FROM object`, (error, result) => {
    res.send(result);
  });
});

app.get("/device", (req, res) => {
  connection.query(`SELECT id, name_lv FROM report_device`, (error, result) => {
    res.send(result);
  });
});

app.get("/type", (req, res) => {
  connection.query(`SELECT id, name_lv FROM issue_type`, (error, result) => {
    res.send(result);
  });
});

app.post("/post", (req, res) => {
  const o = req.body;

  connection.query(
    `INSERT INTO report_issue (date, time, id_user, id_source, name, id_obj, id_device, id_type, note) VALUES ("${o.date}", "${o.time}", "${o.user}", "${o.source}", "${o.title}", "${o.object}", "${o.device}", "${o.type}", "${o.note}")`
  );
});

app.post("/post2", (req, res) => {
  const o = req.body;

  connection.query(
    `INSERT INTO report_action (name, id_status, date, time, id_user, id_report) VALUES ("${o.title}", "${o.status}", "${o.date}", "${o.time}", "${o.user}", "${o.issue}")`
  );
});

app.get("/getfromid", (req, res) => {
  connection.query(`SELECT vards FROM employer`, (error, result) => {
    res.send(result);
  });
});

app.get("/issue", (req, res) => {
  connection.query(
    `SELECT report_issue.id, report_issue.date, report_issue.time, employer.uzv AS id_user,report_source.name_lv AS id_source, object.name AS id_obj ,report_issue.name,report_device.name_lv AS id_device,issue_type.name_lv AS id_type, note FROM report_issue    
  LEFT JOIN object ON report_issue.id_obj = object.id
  LEFT JOIN employer ON report_issue.id_user = employer.id
  LEFT JOIN report_source ON report_issue.id_source = report_source.id
  LEFT JOIN report_device ON report_issue.id_device = report_device.id
  LEFT JOIN issue_type ON report_issue.id_device = issue_type.id`,
    (error, result) => {
      res.send(result);
    }
  );
});

app.get("/action", (req, res) => {
  connection.query(
    `SELECT report_action.id,  report_action.name, report_status.name_en AS id_status, report_action.date, report_action.time, person.fname AS id_user, report_issue.id AS id_report FROM report_action    
  LEFT JOIN person ON report_action.id_user = person.id
  LEFT JOIN report_status ON report_action.id_status = report_status.id
  LEFT JOIN report_issue ON report_action.id_report = report_issue.id`,
    (error, result) => {
      res.send(result);
    }
  );
});

app.get("/status", (req, res) => {
  connection.query(`SELECT id, name_lv FROM report_status`, (error, result) => {
    res.send(result);
  });
});

app.get("/issues", (req, res) => {
  connection.query(`SELECT id FROM report_issue`, (error, result) => {
    res.send(result);
  });
});

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port 3000`);
  }
});
