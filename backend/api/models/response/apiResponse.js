class ApiResponse {

    static getSuccessResponse(data) {
        return {
            code: 200,
            message: null,
            data: data
        }
    }

    static getFailureResponseWithMessage(code, message) {
        return {
            code: code,
            message: message,
            data: null
        }
    }

    static getFailureResponse(apiError) {
        return {
            code: apiError.code,
            message: apiError.message,
            data: null
        }
    }

}

module.exports = ApiResponse