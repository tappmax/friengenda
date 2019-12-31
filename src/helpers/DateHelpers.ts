import * as moment from 'moment';

/**
 * Get current server time
 */
export function currentServerTime () : Date {
    return new Date(Date.now());
}

/**
 * Convert days to milliseconds
 */
export function daysToMilliseconds (days : number) {
    return days * 24 * 60 * 60 * 1000;
}

/**
 * Convert a date to a string
 */
export const dateToString = (date : Date | string, format?: string) => moment(date).format(format || 'YYYY-MM-DDTH:mm')


/**
 * Convert a month and year to a string
 */
export const makeMonth = (month:number, year:number) => (`${year}-${month.toString().padStart(2,'0')}`);

/**
 * Return the next month 
 * @param month current month
 */
export const nextMonth = (month: string) : string => {
    const values = month.split('-');
    let monthNumber = parseInt(values[1]);
    let yearNumber = parseInt(values[0]);
    return monthNumber == 12 ? makeMonth(1, yearNumber+1) : makeMonth(monthNumber+1,yearNumber);
}
