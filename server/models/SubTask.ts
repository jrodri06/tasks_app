import { Schema, model } from 'mongoose';

const subTask = new Schema({
    parentId: {
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
    required: {
        type: Boolean,
        default: false
    },
    done: {
        type: Boolean,
        default: false
    }
})

export default model('SubTask', subTask)