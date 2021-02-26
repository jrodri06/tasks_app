import { Schema, model, Document } from 'mongoose';

export interface ToDo extends Document {
  userCookie: string,
  lastUpdatedBy: string,
  name: string,
  description: string,
  type: string,
  price: number,
  done: boolean,
  specialInput: object,
  tempIdentifier: string
}

const toDoSchema = new Schema({
  userCookie: {
    type: String,
    required: true,
    min: 1,
    max: 110
  },
  lastUpdatedBy: {
    type: String,
    required: true,
    min: 1,
    max: 110
  },
  name: {
    type: String,
    required: true,
    min: 1,
    max: 110
  },
  description: {
    type: String,
    required: false,
    min: 2,
    max: 256
  },
  type: {
    type: String,
    required: true,
    min: 1,
    max: 55
  },
  price: {
    type: Number,
    required: false
  },
  done: {
    type: Boolean,
    default: false
  }, 
  specialInput: {
    type: Object,
    required: true
  },
  tempIdentifier: {
    type: String,
    required: true
  }
}, { 
  minimize: false 
});

export default model<ToDo>('ToDo', toDoSchema);
