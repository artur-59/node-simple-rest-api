const express = require("express");
const router = express.Router();
const connection = require("../config");

// http://localhost:5000/students GET ALL STUDENTS
router.get("/", (request, response) => {
  connection.query("SELECT * FROM student", (err, results) => {
    if (err) response.status(500).send(err);
    response.json(results);
  });
});

// http://localhost:5000/students/1 GET ONE STUDENT
router.get("/:id", (request, response) => {
  const studentId = request.params.id;
  connection.query(
    `SELECT * FROM student WHERE id =${studentId}`,
    (err, results) => {
      if (err) response.status(500).send(err);
      response.json(results);
    }
  );
});

// http://localhost:5000/students CREATE STUDENT
router.post("/", (request, response) => {
  const { email, name, age, enrollment_date, active } = request.body;
  connection.query(
    "INSERT INTO student (email, name, age, enrollment_date, active) VALUES (?, ?, ?, ?, ?);",
    [email, name, age, enrollment_date, active],
    (err, results) => {
      if (err) response.status(500).send(err);

      connection.query(
        `SELECT * FROM student WHERE id =${results.insertId}`,
        (err2, student) => {
          if (err) response.status(500).send(err);
          response.json(student);
        }
      );
    }
  );
});

// http://localhost:5000/students/1 EDIT STUDENT
router.put("/:id", (request, response) => {
  const studentId = request.params.id;
  const { email, name, age, enrollment_date, active } = request.body;
  if (!email || !name) {
    return response
      .status(400)
      .send({ message: "Please provide the student name and email" });
  }
  connection.query(
    `UPDATE student SET email = ?, name = ?, active = ?, enrollment_date = ?, age = ? WHERE id =${studentId}`,
    [email, name, age, enrollment_date, active],
    (err, results) => {
      if (err) response.status(500).send(err);
      response.json(results);
    }
  );
});

// http://localhost:5000/students/1 DELETE ONE STUDENT
router.delete("/:id", (request, response) => {
  const studentId = request.params.id;
  connection.query(`DELETE FROM student WHERE id = ${studentId}`, (err) => {
    if (err) response.status(500).send(err);
    response.status(200).send({ message: "Student successfully deleted." });
  });
});

// http://localhost:5000/students DELETE ALL STUDENTS
router.delete("/", (request, response) => {
  connection.query("TRUNCATE student", (err) => {
    if (err) response.status(500).send(err);
    response
      .status(200)
      .send({ message: "All students successfully deleted." });
  });
});

// http://localhost:5000/students/al GET ALL STUDENTS WITH "al" IN THE NAME
router.get("/specific-get", (request, response) => {
  connection.query(
    "SELECT * FROM student WHERE name LIKE 'al%'",
    (err, results) => {
      if (err) response.status(500).send(err);
      response.json(results);
    }
  );
});

// http://localhost:5000/students/al GET ALL STUDENTS ORDERED BY ENROLLMENT DATE
router.get("/order-by-data", (request, response) => {
    connection.query(
      "SELECT * FROM student ORDER BY enrollment_date",
      (err, results) => {
        if (err) response.status(500).send(err);
        response.json(results);
      }
    );
  });

module.exports = router;
