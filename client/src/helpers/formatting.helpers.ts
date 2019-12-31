import moment from "moment";
import { CommonConstants } from "constants/common.constants";
const { blankChar } = CommonConstants.ui.defaults;

export function formatDateForDisplay(
  date: any,
  formatString: string = "MM/DD/YYYY h:mm A"
): string {
  if (!date) {
    return blankChar;
  }
  return moment(date).format(formatString);
}

export function formatAsRelativeTime(date: any): string {
  if (!date) {
    return blankChar;
  }

  return moment(date).fromNow();
}

export const formatCurrency = (val: number | string | undefined, dollar : boolean = true, blankChar : string = CommonConstants.ui.defaults.blankChar): string => {
  let sign = "";
  if (typeof val === "number" && val !== 0) {
    if (val < 0) {
      sign = "-";
      val = val * -1;
    }
    val = val.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2,useGrouping:true});
  }
  return val ? `${sign}${dollar?'$':''}${val}` : blankChar;
};

export const formatPercentage = (val: number | undefined, fractionDigits: number = 2, blankChar : string = CommonConstants.ui.defaults.blankChar): string => {
  return val ? `${val.toFixed(fractionDigits)}%` : blankChar;  
}

export const formatCard = (val: number | string): string => {
  val = (val || "").toString().length > 4 ? padLeft(val, 16, "0") : val;
  return val ? val.toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ") : blankChar;
};

export const formatCard4 = (val: number | string): string => {
  return val ? "x" + val.toString().slice(-4) : blankChar;
};

export const truncateText = (
  value: string,
  limit: number = 25,
  completeWords: Boolean = false,
  truncatePattern: string = "..."
): string | undefined => {
  if (value) {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(" ");
    }
    return `${value.substr(0, limit)}${
      value.length > limit ? truncatePattern : ""
    }`;
  }
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
export const padLeft = (
  value: any,
  targetLength: any,
  padString: any
): string => {
  value = value.toString();
  targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
  padString = String(typeof padString !== "undefined" ? padString : " ");
  if (value.length >= targetLength) {
    return String(value);
  } else {
    targetLength = targetLength - value.length;
    if (targetLength > padString.length) {
      const j = padString.length;
      for (let i = 0; i < targetLength / j; i++) {
        padString += padString;
      }
    }
    return padString.slice(0, targetLength) + String(value);
  }
};

/**
 * Generates a non-RFC4122-compliant guid
 * @example const uuid = guid() => '7476c74a-68d0-ef23-0739-08803a7e545d'
 */
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}

/**
 * Returns UI-friendly value from nullable boolean.
 * If null, returns blankChar,
 * If true, returns "Yes"
 * If false, returns "No"
 * @param val boolean
 */
export function yesno(val?: boolean): string {
  return val === null || val === undefined ? blankChar : val ? "Yes" : "No";
}

export function handleExternalLink(href: string) {
  window.location.assign(href);
}

/**
 * Replaces param names in urls with values.
 * @param url server endpoint with parameter names to replace
 * @param keyValuePairs object with parameter names matching the ones in the url and values to use to replace them.
 * @example replacePathParams("/get/:id/:anotherId", {id: 2, anotherId: 'abcd'}) => "/get/2/abcd"
 */
export const replacePathParams = (url: string, keyValuePairs: any): string => {
  for (const key in keyValuePairs) {
    url = url.replace(`:${key}`, keyValuePairs[key]);
  }
  return url;
};

/**
 * Returns capitalized string value. If there are spaces, it will capitalize each word in the string.
 * If input is invalid, it will return an empty string
 * @param input string value, can have spaces
 */
export const capitalize = (input: string): string =>
  typeof input === "string"
    ? input
        .split(" ")
        .map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join(" ")
    : "";
