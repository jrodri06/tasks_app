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
const ToDo_1 = __importDefault(require("../../models/ToDo"));
const SubTask_1 = __importDefault(require("../../models/SubTask"));
const route = express_1.Router();
route.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allData = yield ToDo_1.default.find({});
        let subTasks = [];
        let position = 0;
        for (let task of allData) {
            const results = yield SubTask_1.default.find({ parentId: task._id });
            if (results.length > 0) {
                subTasks = [...subTasks, {
                        position,
                        subTask: results
                    }];
            }
            else {
                subTasks = [...subTasks, {
                        position,
                        subTask: []
                    }];
            }
            position++;
        }
        ;
        const final = allData.map((task, i) => {
            const match = subTasks.find(subtask => subtask.position === i);
            if (match === undefined) {
                return task;
            }
            else {
                return Object.assign(Object.assign({}, task.toObject()), { subtask: match.subTask });
            }
        });
        res.status(200).send(final);
    }
    catch (err) {
        res.status(500).json({ message: `A problem occured: ${err.message}` });
    }
}));
exports.default = route;
