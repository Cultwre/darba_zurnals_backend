const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

var mysql = require("mysql2");
const connection = mysql.createPool({
  host: "auth-db483.hstgr.io",
  user: "u353443769_aras",
  password: `testadmin`,
  database: `u353443769_aras`,
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
});

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
    `INSERT INTO ralfs_report_issue (date, time, id_user, id_source, name, id_obj, id_device, id_type, note) VALUES ("${o.date}", "${o.time}", "${o.user}", "${o.source}", "${o.title}", "${o.object}", "${o.device}", "${o.type}", "${o.note}")`
  );
});

app.post("/post2", (req, res) => {
  const o = req.body;

  connection.query(
    `INSERT INTO ralfs_report_action (name, id_status, date, time, id_user, id_report) VALUES ("${o.title}", "${o.status}", "${o.date}", "${o.time}", "${o.user}", "${o.issue}")`
  );
});

app.get("/getfromid", (req, res) => {
  connection.query(`SELECT vards FROM employer`, (error, result) => {
    res.send(result);
  });
});

app.get("/issue", (req, res) => {
  connection.query(
    `SELECT ralfs_report_issue.id, ralfs_report_issue.date, ralfs_report_issue.time, employer.uzv AS id_user,report_source.name_lv AS id_source, object.name AS id_obj ,ralfs_report_issue.name,report_device.name_lv AS id_device,issue_type.name_lv AS id_type, note FROM ralfs_report_issue    
  LEFT JOIN object ON ralfs_report_issue.id_obj = object.id
  LEFT JOIN employer ON ralfs_report_issue.id_user = employer.id
  LEFT JOIN report_source ON ralfs_report_issue.id_source = report_source.id
  LEFT JOIN report_device ON ralfs_report_issue.id_device = report_device.id
  LEFT JOIN issue_type ON ralfs_report_issue.id_device = issue_type.id`,
    (error, result) => {
      res.send(result);
    }
  );
});

app.get("/action", (req, res) => {
  connection.query(
    `SELECT ralfs_report_action.id,  ralfs_report_action.name, report_status.name_en AS id_status, ralfs_report_action.date, ralfs_report_action.time, person.fname AS id_user, ralfs_report_issue.id AS id_report FROM ralfs_report_action    
  LEFT JOIN person ON ralfs_report_action.id_user = person.id
  LEFT JOIN report_status ON ralfs_report_action.id_status = report_status.id
  LEFT JOIN ralfs_report_issue ON ralfs_report_action.id_report = ralfs_report_issue.id`,
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
  connection.query(`SELECT id FROM ralfs_report_issue`, (error, result) => {
    res.send(result);
  });
});
app.get("/", (req, res) => {
  res.send(`deez`);
});

app.listen(3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`listening on port 3000`);
  }
});
