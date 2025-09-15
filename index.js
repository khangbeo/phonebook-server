require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
// const crypto = require("crypto");
// const cors = require("cors");
const app = express();
const Person = require("./models/person");
const unknownEndpoint = require("./middlewares/unknownEndpoint");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.static("dist"));
app.use(express.json());

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

// const persons = [
//   {
//     id: "1",
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((p) => {
      if (p) {
        res.json(p);
      } else {
        res.status(404).json({ error: "Person not found" });
      }
    })
    .catch((e) => next(e));
  // const person = persons.find((p) => p.id === id);
  // if (person) {
  //   res.json(person);
  // } else {
  //   res.status(404).json({
  //     error: "Person not found.",
  //   });
  // }
});

app.get("/info", (req, res, next) => {
  const date = new Date();
  Person.find({})
    .then((persons) => {
      res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date.toString()}</p>
    `);
    })
    .catch((e) => next(e));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((p) => {
      if (p) {
        res.send(204).end();
      } else {
        res.status(404).json({ error: "Person not found" });
      }
    })
    .catch((e) => next(e));

  // persons.filter((p) => p.id !== id);
  // res.send(204).end();
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  Person.findByIdAndUpdate(
    id,
    {
      $set: { number: body.number },
    },
    { new: true, runValidators: true }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).json({ error: "Person not found" });
      }
    })
    .catch((e) => next(e));
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  console.log(req);
  if (!name) {
    return res.status(404).json({
      error: "Name is missing",
    });
  }

  if (!number) {
    return res.status(404).json({
      error: "Number is missing",
    });
  }

  const person = new Person({ name: name, number: number });
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
  // const foundPerson = persons.find((p) => p.name === name);

  // if (foundPerson) {
  //   return res.status(404).json({
  //     error: "Name must be unique",
  //   });
  // }

  // const person = {
  //   id: crypto.randomUUID(),
  //   name,
  //   number,
  // };

  // persons.concat(person);
  // res.json(person);
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
