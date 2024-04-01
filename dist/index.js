"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./utils/config"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("./auth/passportConfig");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const toolRoute_1 = __importDefault(require("./routes/toolRoute"));
const upvoteRoute_1 = __importDefault(require("./routes/upvoteRoute"));
const reportRoute_1 = __importDefault(require("./routes/reportRoute"));
const adRoute_1 = __importDefault(require("./routes/adRoute"));
const session = require('express-session');
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
//https://medium.com/@chiragmehta900/how-to-connect-mongodb-atlas-with-node-js-typescript-123eeadd3d5c
mongoose_1.default
    .connect(config_1.default.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    console.log(`Running on ENV = ${process.env.NODE_ENV}`);
    console.log('Connected to mongoDB.');
})
    .catch((error) => {
    console.log('Unable to connect.');
    console.log(error);
});
//Middlewares
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
//comment this out for next request. work on logout next
// app.use(session({
//   secret: 'JusticeChinedu111',
//   resave: false,
//   saveUninitialized: false
// }));
//passport
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
//routes
app.get('/', (req, res) => {
    res.send('Welcome to Stars center!');
});
app.use("/users", userRoute_1.default);
app.use("/tools", toolRoute_1.default);
app.use("/upvotes", upvoteRoute_1.default);
app.use("/reports", reportRoute_1.default);
app.use("/ads", adRoute_1.default);
// Middleware
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
