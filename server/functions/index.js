"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const method_override_1 = __importDefault(require("method-override"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.config();
const app = express_1.default();
app.use(cors_1.default({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));
app.use(body_parser_1.default.json());
app.use(method_override_1.default('_method'));
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log('Connected to db!'))
    .catch(err => console.log(`Error occurred! ${err.message}`));
app.use(routes_1.default);
// app.use('/.netlify/functions/', routes);
app.listen(4001, () => console.log(`Server is running on port 4001`));
