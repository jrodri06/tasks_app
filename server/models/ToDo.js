"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const toDoSchema = new mongoose_1.Schema({
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
    }
}, {
    minimize: false
});
exports.default = mongoose_1.model('ToDo', toDoSchema);
