const morgan = require('morgan');
const json = require('morgan-json');
let ApiErrors = require('../../api/models/dao/apiErrors');
let ApiResponse = require('../../api/models/response/apiResponse');
const format = json({
    method: ':method',
    body: ':body',
    url: ':url',
    status: ':status',
    contentLength: ':res[content-length]',
    responseTime: ':response-time'
})
morgan.token('body', (req, res) => JSON.stringify(req.body));

const logger = require('./logger');

const httpLogger = morgan(format, {
    stream: {
        write: (message) => {
            const {
                method,
                url,
                body,
                status,
                contentLength,
                responseTime
            } = JSON.parse(message)

            logger.info('HTTP Access Log', {
                timestamp: new Date().toString(),
                method,
                url,
                body,
                status: Number(status),
                contentLength,
                responseTime: Number(responseTime)
            })
        }
    }
});

function logErrors(err, req, res, next) {
    console.error(err.stack)
    next(err)
}

function errorHandler(err, req, res, next) {
    return res.status(200).send(
        ApiResponse.getFailureResponseWithMessage(ApiErrors.UNKNOWN_ERROR.code, err.message)
    );
}

module.exports = {
    httpLogger,
    logErrors,
    errorHandler
}