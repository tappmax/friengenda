/**
 * Convert dollars to cents
 * @param dollars dollar amount
 */
export function dollarsToCents (dollars : number) : number {
    return dollars == undefined ? undefined : Math.round(dollars * 100);
}

/**
 * Convert cents to dollars
 * @param cents number of cents
 */
export function centsToDollars (cents : number) : number {
    return cents == undefined ? undefined : cents / 100;
}

/**
 * Round dollars to two decimal places
 * @param dollars 
 */
export function roundDollars (dollars : number) : number {
    return dollars == undefined ? undefined : centsToDollars(dollarsToCents(dollars));
}

/**
 * Formats money for display with sign, commas, and optional dollar sign
 * @param val dollar amount to format
 * @param dollarSign Prepend dollar sign or not
 * @param defaultVal
 */
export const moneyToString = (
  val: number | string | undefined,
  dollarSign: boolean = true,
  defaultVal: string = "—"
): string => {
  let sign = "";
  if (typeof val === "number") {
    if (val < 0) {
      sign = "-";
      val = val * -1;
    }
    val = val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    });
  }
  return val ? `${sign}${dollarSign ? "$" : ""}${val}` : defaultVal;
};