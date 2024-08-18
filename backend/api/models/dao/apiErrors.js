class ApiErrors {
    // COMMON
    static INVALID_PARAMETERS = new ApiErrors(1000, "INVALID_PARAMETERS");
    static UNKNOWN_ERROR = new ApiErrors(1001,'UNKNOWN_ERROR');
    static NOT_EXIST = new ApiErrors(1002,'NOT_EXIST');

    // ARTIST
    static ALREADY_EXIST_ARTIST_NAME = new ApiErrors(2001,'ALREADY_EXIST_ARTIST_NAME');
    static ALREADY_EXIST_ARTIST_EMAIL = new ApiErrors(2002,'ALREADY_EXIST_ARTIST_EMAIL');
    static ALREADY_EXIST_ARTIST_WALLET_ADDRESS = new ApiErrors(2003,'ALREADY_EXIST_ARTIST_WALLET_ADDRESS');
    static DOES_NOT_EXIST_ARTIST = new ApiErrors(2004,'DOES_NOT_EXIST_ARTIST');
    static DOES_NOT_VERIFIED_ARTIST = new ApiErrors(2005,'DOES_NOT_VERIFIED_ARTIST');
    static NOT_OWNER_OF_COLLECTION = new ApiErrors(2006,'NOT_OWNER_OF_COLLECTION');


    static ALREADY_SELL_REQUEST_SUBMITTED = new ApiErrors(2007,'ALREADY_SELL_REQUEST_SUBMITTED');
    static ALREADY_COLLECTION_VERIFIED = new ApiErrors(2008,'ALREADY_COLLECTION_VERIFIED');


    // USER
    static INVALID_SIGNATURE = new ApiErrors(3001,'INVALID_SIGNATURE');
    static IS_NOT_ADMIN_ROLE = new ApiErrors(3002,'IS_NOT_ADMIN_ROLE');
    static ALREADY_EXIST_USERNAME = new ApiErrors(3003,'ALREADY_EXIST_USERNAME');

    // JWT
    static INVALID_TOKEN = new ApiErrors(4001,'INVALID_TOKEN');
    static EXPIRED_TOKEN = new ApiErrors(4002,'EXPIRED_TOKEN');

    // ADMIN
    static INVALID_ADMIN_CREDENTIALS = new ApiErrors(5001,'INVALID_ADMIN_CREDENTIALS');
    static INVALID_ADMIN_OLD_PASSWORD = new ApiErrors(5002,'INVALID_ADMIN_OLD_PASSWORD');
    static ALREADY_EXIST_EMAIL_ADDRESS = new ApiErrors(5003,'ALREADY_EXIST_EMAIL_ADDRESS');



    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
    toString() {
        return `ApiError : ${this.message}`;
    }
}
module.exports = ApiErrors