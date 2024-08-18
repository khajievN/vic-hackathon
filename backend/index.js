const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const config = require("./env/config");
const helmet = require("helmet");
const {httpLogger, logErrors, errorHandler} = require('./utils/log/httpLogger')
const http = require("http");
const projectRouters = require("./api/routers/projectRouters");
const proposalRouters = require("./api/routers/proposalRouters");
const {startProjectGrantIndexing} = require("./task/projectGrantIndexing");

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(cors({
    credential: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(httpLogger);
// enable files upload
app.use(fileUpload({
    limits: {
        fileSize: 20000000 //20mb
    },
    createParentPath: true
}));

app.use(httpLogger);
app.use("/api/project", projectRouters);
app.use("/api/proposal", proposalRouters);

app.use(logErrors);
app.use(errorHandler);

// set port, listen for requests
const PORT = process.env.PORT || 8080;

// Create an HTTP service.
http.createServer(app).listen(PORT, async function () {
    console.log("STARTED");
    console.log('ENV : ' + config.NODE_ENV);
    console.log('DB HOST : ' + config.DB_HOST);
    startProjectGrantIndexing()
});

