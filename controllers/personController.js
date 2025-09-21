const personRouter = require("express").Router();
const Person = require("../models/person");

personRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

personRouter.get("/:id", (req, res, next) => {
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

personRouter.get("/info", (req, res, next) => {
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

personRouter.delete("/:id", (req, res, next) => {
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

personRouter.put("/:id", (req, res, next) => {
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

personRouter.post("/", (req, res, next) => {
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
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((e) => next(e));
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

module.exports = personRouter;
