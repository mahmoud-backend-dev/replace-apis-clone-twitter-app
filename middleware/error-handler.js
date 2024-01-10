
import { StatusCodes } from 'http-status-codes';
const errorHandlerMiddleware = (err, req, res,next) => {
    const customError = {
        message: err.message  || 'Something went wrong try again later',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    }
    if (err.name === 'ValidationError') {
        customError.message = Object.values(err.errors).map((item) => item.message).join(',')
    }
    customError.statusCode = StatusCodes.BAD_REQUEST;
    if (err.code && err.code === 11000) {
        customError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`
        customError.statusCode = StatusCodes.BAD_REQUEST 
    };
    if (err.name === 'CastError') {
        customError.message = `No Item found with id ${err.value}`;
        customError.statusCode = StatusCodes.NOT_FOUND;
    }
    if (err.name === 'JsonWebTokenError') {
        customError.message = `Invalid token, please login again...`;
        customError.statusCode = StatusCodes.UNAUTHORIZED;
    }
    if (err.name === 'TokenExpiredError') {
        customError.message = `Expired token, please login again...`;
        customError.statusCode = StatusCodes.UNAUTHORIZED;
    }
    res.status(customError.statusCode).json({ message: customError.message, stack: err.stack });
};

export default errorHandlerMiddleware;