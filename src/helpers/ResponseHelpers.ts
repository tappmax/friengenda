import * as _ from 'lodash';
import * as express from "express";
import FrenError, { FriendlyDetails, errorToResponse } from '@errors/FrenError';
import InternalServerError from "@errors/InternalServerError";
import {logger} from '@services/LoggerService';
import DatabaseError from "@errors/DatabaseError";

const isProduction = process.env.NODE_ENV === 'production';

export function renderSuccess (res: express.Response, message : string) {
    res.render(`Success`, { message : message });
}

export function renderError (res: express.Response, message : string) {
    res.status(400).render(`Error`, { message : message });
}

export function successResponse (res: express.Response) {
    return res.json({ error: "Success" });
}

function sendErrorResponse (res: express.Response, status: number, error : string, details?: any, innerError?: any, friendlyDetails?: FriendlyDetails) {
    res.status(status).json(_.omitBy({
        error : error,
        details : details,
        friendlyDetails : friendlyDetails,
        innerError : isProduction ? undefined : innerError
    },_.isNil));
}
/**
 * Generates a response from a product error
 */
export function errorResponse (res: express.Response, err: Error)  {
    // Wrap database errors into an internal server error
    if(err instanceof DatabaseError)
        err = new InternalServerError(err);

    // Log all internal server errors
    if(err instanceof InternalServerError)
        logger.error('InternalServerError', err.innerError);

    if(err instanceof FrenError)
        return res.status(err.status).json(errorToResponse(err.toJSON()));

    // Log unknown errors
    logger.error('UnknownError', err);

    return sendErrorResponse(res, 500, 'InternalServerError', null, err);
}
