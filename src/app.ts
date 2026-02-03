import express from "express";
import path from "path";
import { pool } from "./db";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function getPublicIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

// ✅ Home page: show students list
app.get("/", async (req, res) => {
  const students = await pool.query("SELECT * FROM students ORDER BY id DESC");

  let publicIP = "Unavailable";
  try {
    publicIP = await getPublicIP();
  } catch (err) {
    console.error("Failed to fetch public IP");
  }

  res.render("form", {
    students: students.rows,
    publicIP,
  });
});

// ✅ Create student (returns JSON)
app.post("/submit", async (req, res) => {
  try {
    const { first_name, last_name, roll, registration, email, address } =
      req.body;

    await pool.query(
      `INSERT INTO students (first_name, last_name, roll, registration, email, address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [first_name, last_name, roll, registration, email, address]
    );

    return res.json({
      ok: true,
      message: `Student "${first_name} ${last_name}" saved successfully.`,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to save student." });
  }
});

// ✅ Get one student for edit (returns JSON)
app.get("/student/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM students WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, message: "Student not found." });
    }

    return res.json({ ok: true, student: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to load student." });
  }
});

// ✅ Update student (returns JSON)
app.post("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, roll, registration, email, address } =
      req.body;

    await pool.query(
      `UPDATE students
       SET first_name=$1, last_name=$2, roll=$3, registration=$4, email=$5, address=$6
       WHERE id=$7`,
      [first_name, last_name, roll, registration, email, address, id]
    );

    return res.json({ ok: true, message: "Student updated successfully." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to update student." });
  }
});

// ✅ Delete student (returns JSON)
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM students WHERE id = $1", [id]);

    return res.json({ ok: true, message: "Student deleted successfully." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, message: "Failed to delete student." });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
