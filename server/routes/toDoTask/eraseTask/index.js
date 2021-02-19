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
const SubTask_1 = __importDefault(require("../../../models/SubTask"));
const route = express_1.Router();
route.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers['x-http-method-override'] === 'DELETE') {
        try {
            const { id } = req.body;
            yield ToDo_1.default.deleteOne({ _id: id });
            yield SubTask_1.default.deleteMany({ parentId: id });
            res.status(202).json({ message: `Successfully deleted` });
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ errorMessage: err.message });
        }
    }
    else {
        res.status(400).json({ message: 'Could not find "DELETE" in method override' });
    }
}));
exports.default = route;
