import * as express from "express";
import { Pool, QueryResult, PoolClient } from 'pg';
import DatabaseError from '@errors/DatabaseError';
import NotFoundError from '@errors/NotFoundError';
import { getSettingValue } from './SettingService';
import { logger } from '@services/LoggerService';

let db: Pool;

export type Transaction = {
    query: (sql: string, params?: any[]) => Promise<QueryResult>;
    queryAll: (sql: string, params?: any[]) => Promise<any[]>;
    queryFirstOrNull: (sql: string, params?: any[]) => Promise<any>;
    queryFirstOrThrow: (sql: string, params?: any[]) => Promise<any>;
    queryFirstOrNotFound: (sql : string, params ?: any[], error?: string) => Promise<any>;
    queryFirstOrEmpty: (sql : string, params?: any[]) => Promise<any>;
}

export function initialize() {
    logger.info("[STARTUP] Initializing database...");
    db = new Pool({
        host : getSettingValue<string>('DatabaseHost'),
        port : getSettingValue<number>('DatabasePort'),
        user : getSettingValue<string>('DatabaseUsername'),
        password : getSettingValue<string>('DatabasePassword'),
        database : getSettingValue<string>('DatabaseName')
    });
}

export async function shutdown () {
    await db.end();
}

/**
 * Create a transaction that is automatically rolled back if any exceptions are thrown
 * @param callback Callback used to do all transaction processing
 */
export async function transaction(callback : (tx: Transaction) => Promise<void>) : Promise<void> {
    const client = await db.connect();
    const tx : Transaction = {        
        query: (sql: string, params?: any[]) => query(sql, params, client),
        queryAll: (sql: string, params?: any[]) => queryAll(sql, params, client),
        queryFirstOrNull: (sql: string, params?: any[]) => queryFirstOrNull(sql, params, client),
        queryFirstOrThrow: (sql: string, params?: any[]) => queryFirstOrThrow(sql, params, client),
        queryFirstOrNotFound: (sql : string, params ?: any[], error?: string) => queryFirstOrNotFound(sql, params, error, client),
        queryFirstOrEmpty: (sql : string, params?: any[]) => queryFirstOrEmpty(sql, params, client)
    }

    try {
        await client.query('BEGIN');
    } catch (err) {
        client.release();
        throw err;
    }

    try {
        await callback(tx);
    } catch (err) {
        await client.query('ROLLBACK');
        client.release();
        throw err;
    }

    try {
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        client.release();
        throw err;
    }

    client.release();
}

/**
 * Execute the the query and return the query results
 * @param sql query text
 * @param params values for the query
 * @returns query results
 */
export async function query(sql: string, params?: any[], client?: PoolClient): Promise<QueryResult> {
    try {
        return await (client || db).query(sql, params);
    } catch(err) {
        throw new DatabaseError(err);
    }    
}

/**
 * Execute the the query and return all rows
 * @param sql query text
 * @param params values for the query
 * @returns rows
 */
export async function queryAll (sql: string, params?: any[], client?: PoolClient): Promise<any[]> {
    try {
        return (await (client || db).query(sql, params)).rows;
    } catch(err) {
        throw new DatabaseError(err);
    }    
}

/**
 * Execute the the query and return the first row or null if there are no rows
 * @param sql query text
 * @param params values for the query
 */
export async function queryFirstOrNull(sql: string, params?: any[], client?: PoolClient): Promise<any> {
    const result = await query(sql, params, client);
    if (result.rowCount == 0)
        return null;

    return result.rows[0];
}

/**
 * Execut ethe query and return the first row or throw an error if there are no rows.
 * @param sql query text
 * @param params values for the query
 * @param err optional error message to throw
 */
export async function queryFirstOrThrow(sql: string, params?: any[], client?: PoolClient): Promise<any> {
    const result = await query(sql, params, client);
    if (result.rowCount == 0)
        throw new DatabaseError("no rows");

    return result.rows[0];
}

/**
 * Execute the query and return the first row or throw a NotFound error if no rows were returned
 * @param sql Query string
 * @param params Query parameters
 * @param error Optional details to pass the NotFoundError
 */
export async function queryFirstOrNotFound (sql : string, params ?: any[], error?: string, client?:PoolClient) : Promise<any> {
    const result = await query(sql, params, client);
    if(result.rowCount==0)
        throw new NotFoundError(error);

    return result.rows[0];
}    

/**
 * Execute a query and return the first row or an empty object if no rows were returned
 * @param sql Query string
 * @param params Query parameters
 * @return First row
 */
export async function queryFirstOrEmpty (sql : string, params?: any[], client?: PoolClient) : Promise<any> {
    const result = await query(sql, params);
    return result.rowCount === 0 ? {} : result.rows[0];
}       
