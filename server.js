//Declare variables
const express = require("express");
const path = require("path");
const apiNotes = require("./routes/notes.js");
const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/notes", apiNotes);

app.use(express.static(path.join(__dirname, "public")));

// GET Route for CSS and the client javascript.
app.get("/", (req, res) => res.send("navigate"));

// GET Route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// Wildcard route to direct users to the homepage.
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);
//Listen port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
