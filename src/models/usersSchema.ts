import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface IUser extends Document {
  fname: string;
  lname: string;
  email: string;
  phoneNumber: string;
  gender: string;
  status: string;
  profile: string;
  address: string;
  datecreated: Date;
  dateUpdated: Date;
}

const usersSchema: Schema = new Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },
  lname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error("not valid email");
      }
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 10
  },
  gender: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  datecreated: Date,
  dateUpdated: Date
});

// model
const User = mongoose.model<IUser>("users", usersSchema);

export default User;