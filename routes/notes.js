//express module
const notes = require("express").Router();
//UUID module
const { v4: uuidv4 } = require("uuid");
const {
  readFromFile,
  writeToFile,
  readAndAppend,
} = require("../helpers/fsUtils");

// GET Route for retrieving all the feedback
notes.get("/", (req, res) => {
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
notes.get("/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((notes) => notes.id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json("No note with that ID");
    });
});

// DELETE Route for a specific note
notes.delete("/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided in the URL
      const result = json.filter((notes) => notes.id !== noteId);

      // Save that array to the filesystem
      writeToFile("./db/db.json", result);

      // Respond to the DELETE request
      res.json(`Item ${noteId} has been deleted 🗑️`);
    });
});

// POST Route for submitting feedback
notes.post("/", (req, res) => {
  // Destructuring assignment for the items in req.body
  ({ title: noteTitle, text: noteText } = req.body);

  // If all the required properties are present
  if (noteTitle && noteText) {
    // Variable for the object we will save
    const newNote = {
      title: noteTitle,
      text: noteText,
      id: uuidv4(),
    };
    readAndAppend(newNote, "./db/db.json");
    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.error("Error in saving note");
  }
});
//module exports
module.exports = notes;
