"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ToDo_1 = __importDefault(require("../../../models/ToDo"));
const route = express_1.Router();
route.get('/:taskId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Get Task');
    const { taskId } = req.params;
    try {
        const task = yield ToDo_1.default.findById(taskId);
        res.status(200).send(task);
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
route.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body;
    const updatedTask = req.body;
    try {
        yield ToDo_1.default.findByIdAndUpdate(_id, updatedTask);
        res.status(204).json({ message: 'Task has been updated' });
    }
    catch (err) {
        res.status(500).json({ message: `Your request was not processed: ${err.message}` });
    }
}));
exports.default = route;
