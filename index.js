const express = require("express");
const morgan = require("morgan");
const crypto = require("crypto");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({
      error: "Person not found.",
    });
  }
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date.toString()}</p>
    `);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons.filter((p) => p.id !== id);
  res.send(204).end();
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  const foundPerson = persons.find((p) => p.name === name);

  if (foundPerson) {
    return res.status(404).json({
      error: "Name must be unique",
    });
  }

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

  const person = {
    id: crypto.randomUUID(),
    name,
    number,
  };

  persons.concat(person);
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
