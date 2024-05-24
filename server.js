// dot env
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const useragent = require("express-useragent");
const { CustomErrorHandler } = require("./src/utils/helpers/custom-error");
const { initEndpoints } = require("./src/utils/helpers/init");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");
const translator = require("./src/utils/middleware/translate")
const https = require('https');
const fs = require('fs');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yml');
// CRON JOBS
require("./src/utils/tasks/request.refresh");

// INIT EXPRESS
const app = express();
const PORT = process.env.PORT || 8000;
// EXPRESS BODY PARSER
app.use(express.json({ limit: "100mb" }), (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ status: 404, message: err.message });
    } // Bad request
    next();
});
app.use(express.urlencoded({ extended: true }));
// MORGAN
app.use(morgan("dev"));
// USER AGENT
app.use(useragent.express());
// HELMET
app.use(helmet());
// COOKIE PARSER
app.use(cookieParser());
// MIDDLEWARE
app.use(translator)
// INIT CORS POLICY & ALLOW ALL ORIGINS
app.use(
    cors({
        origin: function (origin, callback) {
            callback(null, true)
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "language", "ngrok-skip-browser-warning"],
        exposedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin", "language", "ngrok-skip-browser-warning"],
        optionsSuccessStatus: 200,
    })
);
// EXPRESS SESSION
app.set("trust proxy", 1);

app.use(passport.initialize());

// REQUIRE PASSPORT MIDDLEWARE
require("./src/utils/helpers/passport");

// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI, {
    appName: process.env.DB_APP_NAME, 
    maxPoolSize: 10,
    autoIndex: false,
}).then(() => {
    console.log(`INFO [ MONGOOSE ] Connected`);
    // INIT ENDPOINTS
    initEndpoints(express, app);
    // SERVER STATUS CHECK (KEEP_ALIVE)
    app.get("/", (req, res) => {
        res.status(200).send({ status: 200, message: "Server is running" });
    });
    // SWAGGER DOCS
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // INIT ROUTES
    app.use((req, res) => {
        return res.status(404).json({
            code: "FORBIDDEN",
            status: 404,
            message: "Provided endpoint does not exist",
            timestamp: new Date().toISOString(),
        });
    });
    // HANDLE BAD REQUESTS
    app.use((err, req, res, next) => {
        if (err instanceof SyntaxError && err.status === 400 && "body" in err)
            res.status(400).json({
                code: "BAD_REQUEST",
                status: 400,
                message: err.message,
                timestamp: new Date().toISOString(),
            });
        else
            next(err);
    });
    app.use(CustomErrorHandler);
    // Override console.error with a custom function
    console.error = function (error) {
        process.stderr.write(error?.message ? error.message : error);
    };
    if (process.env.NODE_ENV == "prod") {
        const credentials = {
        key: fs.readFileSync("/root/certs/privkey.pem", "utf-8"),
        cert: fs.readFileSync("/root/certs/cert.pem", "utf-8"),
        };
        const httpsServer = https.createServer(credentials, app);
        httpsServer.listen(PORT, () => {
            console.log(`INFO [ EXPRESS ] Started on PORT ${PORT}`);
        });
    }else{
    // START SERVER
        app.listen(PORT, () => {
            console.log(`INFO [ EXPRESS ] Started on PORT ${PORT}`);
        });
    }
}).catch((err) => {
    console.log(err);
    throw err;
});

module.exports = app;