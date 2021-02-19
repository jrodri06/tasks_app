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
route.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { name, description, type, price, specialInput } = req.body;
    const newTodo = new ToDo_1.default({
        name,
        description,
        type,
        price,
        specialInput
    });
    try {
        yield newTodo.save();
        res.status(201).json({ message: `Your task "${name}" has been created` });
    }
    catch (err) {
        res.status(500).send({ message: `Something went wrong: ${err}` });
    }
}));
exports.default = route;
