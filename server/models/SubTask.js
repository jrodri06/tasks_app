"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subTask = new mongoose_1.Schema({
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
    done: {
        type: Boolean,
        default: false
    }
});
exports.default = mongoose_1.model('SubTask', subTask);
