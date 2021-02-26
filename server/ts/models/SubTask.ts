import { Schema, model } from 'mongoose';

const subTask = new Schema({
    parentTempId: {
        type: String,
        required: true,
        min: 1,
        max: 110
    },
    subtaskTempId: {
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
    price: {
        type: Number,
        required: false
    },
    done: {
        type: Boolean,
        default: false
    }
})

export default model('SubTask', subTask)