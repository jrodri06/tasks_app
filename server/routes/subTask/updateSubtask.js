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
const SubTask_1 = __importDefault(require("../../models/SubTask"));
const route = express_1.Router();
route.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId, done } = req.body;
    try {
        yield SubTask_1.default.findOneAndUpdate({ _id: taskId }, { done });
        res.status(200).json({ message: 'Done status updated' });
    }
    catch (err) {
        res.status(500).json({ message: `Your request was not processed: ${err.message}` });
    }
}));
exports.default = route;
