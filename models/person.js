const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "Name required"],
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => {
        return /\d{2,}-\d{6}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! The format is 123-456789`,
    },
    required: [true, "Phone number required"],
  },
});

personSchema.set("toJSON", {
  tranform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
