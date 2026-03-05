import express from "express";
import fs from "fs";
import multer from "multer";
import os from "os";
import path from "path";
import { pool } from "./db";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const uploadPath = path.join(__dirname, "public/uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

function getLocalIPv4(): string {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const netInterface = interfaces[name];
    if (!netInterface) continue;

    for (const net of netInterface) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address; // ✅ e.g. 192.168.1.105
      }
    }
  }

  return "Unavailable";
}

// ✅ Home page: show students list
app.get("/", async (req, res) => {
  const students = await pool.query("SELECT * FROM students ORDER BY id DESC");

  const localIP = getLocalIPv4();

  res.render("form", {
    students: students.rows,
    localIP,
  });
});

// ✅ Create student (returns JSON)
app.post("/submit", upload.single("photo"), async (req, res) => {
  try {
    const { first_name, last_name, roll, registration, email, address } =
      req.body;

    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    await pool.query(
      `INSERT INTO students
       (first_name, last_name, roll, registration, email, address, photo)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [first_name, last_name, roll, registration, email, address, photo],
    );

    res.json({
      ok: true,
      message: `Student "${first_name} ${last_name}" saved successfully.`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to save student." });
  }
});
app.get("/view/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM students WHERE id=$1", [id]);

    if (result.rows.length === 0) {
      return res.send("Student not found");
    }

    const student = result.rows[0];

    res.render("view", { student });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
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

// ✅ Get one student for edit (returns JSON)
app.post("/update/:id", upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, roll, registration, email, address } =
      req.body;

    let photoQuery = "";
    let values: any[] = [
      first_name,
      last_name,
      roll,
      registration,
      email,
      address,
    ];

    if (req.file) {
      photoQuery = ", photo=$7";
      values.push(`/uploads/${req.file.filename}`);
      values.push(id);
    } else {
      values.push(id);
    }

    await pool.query(
      `UPDATE students
       SET first_name=$1,last_name=$2,roll=$3,registration=$4,email=$5,address=$6${photoQuery}
       WHERE id=$${values.length}`,
      values,
    );

    res.json({ ok: true, message: "Student updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to update student." });
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

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on all interfaces at port 3000");
});
