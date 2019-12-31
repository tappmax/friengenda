// Adapted from Simple React Validator v0.0.3 | Created By Dockwa | MIT License | 2017 https://www.npmjs.com/package/simple-react-validator
import React from "react";
import moment from "moment";
export class FrenValidator {
  private fields = {} as any;
  private errorMessages = {};
  private messagesShown = {};
  private rules = {};
  messages: any;
  className: any;
  element: (message: any, className?: any) => any;

  constructor(options = {} as any) {
    this.fields = {};
    this.errorMessages = {};
    this.messagesShown = false;
    //https://www.npmjs.com/package/simple-react-validator#rules
    this.rules = {
      accepted: {
        message: "The :attribute must be accepted.",
        rule: (val: any) => val === true,
        required: true
      },
      after: {
        message: "The :attribute must be after :date.",
        rule: (
          val: { isAfter: (arg0: any, arg1: string) => void },
          params: any[]
        ) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(val) &&
          val.isAfter(params[0], "day"),
        messageReplace: (
          message: { replace: (arg0: string, arg1: any) => void },
          params: { format: (arg0: string) => void }[]
        ) => message.replace(":date", params[0].format("MM/DD/YYYY"))
      },
      after_or_equal: {
        message: "The :attribute must be after or on :date.",
        rule: (
          val: { isSameOrAfter: (arg0: any, arg1: string) => void },
          params: any[]
        ) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(val) &&
          val.isSameOrAfter(params[0], "day"),
        messageReplace: (
          message: { replace: (arg0: string, arg1: any) => void },
          params: { format: (arg0: string) => void }[]
        ) => message.replace(":date", params[0].format("MM/DD/YYYY"))
      },
      alpha: {
        message: "The :attribute may only contain letters.",
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z]*$/i)
      },
      alpha_space: {
        message: "The :attribute may only contain letters and spaces.",
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z\s]*$/i)
      },
      alpha_num: {
        message: "The :attribute may only contain letters and numbers.",
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9]*$/i)
      },
      alpha_num_space: {
        message:
          "The :attribute may only contain letters, numbers, and spaces.",
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9\s]*$/i)
      },
      alpha_num_dash: {
        message:
          "The :attribute may only contain letters, numbers, and dashes.",
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9_-]*$/i)
      },
      alpha_num_dash_space: {
        message:
          "The :attribute may only contain letters, numbers, dashes, and spaces.",
        rule: (val: any) => this.helpers.testRegex(val, /^[A-Z0-9_-\s]*$/i)
      },
      array: {
        message: "The :attribute must be an array.",
        rule: (val: any) => Array.isArray(val)
      },
      before: {
        message: "The :attribute must be before :date.",
        rule: (
          val: { isBefore: (arg0: any, arg1: string) => void },
          params: any[]
        ) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(val) &&
          val.isBefore(params[0], "day"),
        messageReplace: (
          message: { replace: (arg0: string, arg1: any) => void },
          params: { format: (arg0: string) => void }[]
        ) => message.replace(":date", params[0].format("MM/DD/YYYY"))
      },
      before_or_equal: {
        message: "The :attribute must be before or on :date.",
        rule: (
          val: { isSameOrBefore: (arg0: any, arg1: string) => void },
          params: any[]
        ) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(val) &&
          val.isSameOrBefore(params[0], "day"),
        messageReplace: (
          message: { replace: (arg0: string, arg1: any) => void },
          params: { format: (arg0: string) => void }[]
        ) => message.replace(":date", params[0].format("MM/DD/YYYY"))
      },
      between: {
        message: "The :attribute must be between :min and :max:type.",
        rule: (val: any, params: string[]) =>
          this.helpers.size(val, params[2]) >= parseFloat(params[0]) &&
          this.helpers.size(val, params[2]) <= parseFloat(params[1]),
        messageReplace: (
          message: {
            replace: (
              arg0: string,
              arg1: any
            ) => {
              replace: (
                arg0: string,
                arg1: any
              ) => { replace: (arg0: string, arg1: string) => void };
            };
          },
          params: any[]
        ) =>
          message
            .replace(":min", params[0])
            .replace(":max", params[1])
            .replace(":type", this.helpers.sizeText(params[2]))
      },
      boolean: {
        message: "The :attribute must be a boolean.",
        rule: (val: boolean) => val === false || val === true
      },
      card_exp: {
        message: "The :attribute must be a valid expiration date.",
        rule: (val: any) =>
          this.helpers.testRegex(
            val,
            /^(([0]?[1-9]{1})|([1]{1}[0-2]{1}))\s?\/\s?(\d{2}|\d{4})$/
          )
      },
      card_num: {
        message: "The :attribute must be a valid credit card number.",
        rule: (val: any) =>
          this.helpers.testRegex(val, /^\d{4}\s?\d{4,6}\s?\d{4,5}\s?\d{0,8}$/)
      },
      currency: {
        message: "The :attribute must be a valid currency.",
        rule: (val: any) =>
          this.helpers.testRegex(val, /^\$?(\d{1,3})(,?\d{3})*\.?\d{0,2}$/)
      },
      date: {
        message: "The :attribute must be a date.",
        rule: (val: any) =>
          this.helpers.momentInstalled() && moment.isMoment(val)
      },
      date_equals: {
        message: "The :attribute must be on :date.",
        rule: (
          val: { isSame: (arg0: any, arg1: string) => void },
          params: any[]
        ) =>
          this.helpers.momentInstalled() &&
          moment.isMoment(val) &&
          val.isSame(params[0], "day"),
        messageReplace: (
          message: { replace: (arg0: string, arg1: any) => void },
          params: { format: (arg0: string) => void }[]
        ) => message.replace(":date", params[0].format("MM/DD/YYYY"))
      },
      email: {
        message: "The :attribute must be a valid email address.",
        rule: (val: any) =>
          this.helpers.testRegex(
            val,
            /^[A-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
          )
      },
      exactly: {
        message: "The :attribute must be :max:type.",
        rule: (val: any, params: string[]) =>
          this.helpers.size(val, params[1]) === parseFloat(params[0]),
        messageReplace: (
          message: {
            replace: (
              arg0: string,
              arg1: any
            ) => { replace: (arg0: string, arg1: string) => void };
          },
          params: any[]
        ) =>
          message
            .replace(":max", params[0])
            .replace(":type", this.helpers.sizeText(params[1]))
      },
      in: {
        message: "The selected :attribute must be :values.",
        rule: (val: any, params: { indexOf: (arg0: any) => number }) =>
          params.indexOf(val) > -1,
        messageReplace: (
          message: { replace: (arg0: string, arg1: string) => void },
          params: any
        ) => message.replace(":values", this.helpers.toSentence(params))
      },
      integer: {
        message: "The :attribute must be an integer.",
        rule: (val: any) => this.helpers.testRegex(val, /^\d*$/)
      },
      max: {
        message: "The :attribute may not be greater than :max:type.",
        rule: (val: any, params: string[]) =>
          this.helpers.size(val, params[1]) <= parseFloat(params[0]),
        messageReplace: (
          message: {
            replace: (
              arg0: string,
              arg1: any
            ) => { replace: (arg0: string, arg1: string) => void };
          },
          params: any[]
        ) =>
          message
            .replace(":max", params[0])
            .replace(":type", this.helpers.sizeText(params[1]))
      },
      min: {
        message: "The :attribute must be at least :min:type.",
        rule: (val: any, params: string[]) =>
          this.helpers.size(val, params[1]) >= parseFloat(params[0]),
        messageReplace: (
          message: {
            replace: (
              arg0: string,
              arg1: any
            ) => { replace: (arg0: string, arg1: string) => void };
          },
          params: any[]
        ) =>
          message
            .replace(":min", params[0])
            .replace(":type", this.helpers.sizeText(params[1]))
      },
      must_match: {
        message: "The :attribute must match :pw.",
        rule: (val: any, params: string[]) =>
          (params[1] || ({ password: "" } as any)).password === val.password,
        messageReplace: (
          message: {
            replace: (
              arg0: string,
              arg1: any
            ) => { replace: (arg0: string, arg1: string) => void };
          },
          params: any[]
        ) => message.replace(":pw", this.helpers.humanizeFieldName(params[0]))
      },
      not_in: {
        message: "The selected :attribute must not be :values.",
        rule: (val: any, params: { indexOf: (arg0: any) => number }) =>
          params.indexOf(val) === -1,
        messageReplace: (
          message: { replace: (arg0: string, arg1: string) => void },
          params: any
        ) => message.replace(":values", this.helpers.toSentence(params))
      },
      not_regex: {
        message: "The :attribute must not match the required pattern.",
        rule: (val: any, params: any[]) =>
          !this.helpers.testRegex(
            val,
            typeof params[0] === "string" || params[0] instanceof String
              ? new RegExp(params[0] as any)
              : params[0]
          )
      },
      numeric: {
        message: "The :attribute must be a number.",
        rule: (val: any) => this.helpers.numeric(val)
      },
      phone: {
        message: "The :attribute must be a valid phone number.",
        rule: (val: any) =>
          this.helpers.testRegex(
            val,
            /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/
          )
      },
      regex: {
        message: "The :attribute must match the required pattern.",
        rule: (val: any, params: any[]) =>
          this.helpers.testRegex(
            val,
            typeof params[0] === "string" || params[0] instanceof String
              ? new RegExp(params[0] as any)
              : params[0]
          )
      },
      required: {
        message: "The :attribute field is required.",
        rule: (val: any) => !this.helpers.isBlank(val),
        required: true
      },
      size: {
        message: "The :attribute must be :size:type.",
        rule: (val: any, params: string[]) =>
          this.helpers.size(val, params[1]) === parseFloat(params[0]),
        messageReplace: (
          message: {
            replace: (
              arg0: string,
              arg1: any
            ) => { replace: (arg0: string, arg1: string) => void };
          },
          params: any[]
        ) =>
          message
            .replace(":size", params[0])
            .replace(":type", this.helpers.sizeText(params[1]))
      },
      string: {
        message: "The :attribute must be a string.",
        rule: (val: any) => typeof val === typeof "string"
      },
      typeof: {
        message: "The :attribute is not the correct type of :type.",
        rule: (val: any, params: any[]) => typeof val === typeof params[0],
        messageReplace: (
          message: { replace: (arg0: string, arg1: string) => void },
          params: any[]
        ) => message.replace(":type", typeof params[0])
      },
      url: {
        message: "The :attribute must be a url.",
        rule: (val: any) =>
          this.helpers.testRegex(
            val,
            /^(https?|ftp):\/\/(-\.)?([^\s/?.#-]+\.?)+(\/[^\s]*)?$/i
          )
      },
      zip: {
        message: "The :attribute must be a US ZIP code or Canadian Postal Code",
        rule: (val: any) => this.helpers.testRegex(val, /^\d{5}(.\d{4})?$/)
      },
      ...(options["validators"] || {})
    };

    // apply default options
    this.messages = options.messages || {};
    this.className = options.className;

    // apply default element
    if (options.element === false) {
      this.element = (message: any) => message;
    } else if (options.hasOwnProperty("element")) {
      this.element = options.element;
    } else if (
      typeof navigator === "object" &&
      navigator.product === "ReactNative"
    ) {
      this.element = (message: any) => message;
    } else {
      this.element = (message: React.ReactNode, className: any) =>
        React.createElement(
          "div",
          {
            className: className || this.className || "validation-message"
          },
          message
        );
    }
  }

  getErrorMessages() {
    return this.errorMessages;
  }

  showMessages() {
    this.messagesShown = true;
  }

  hideMessages() {
    this.messagesShown = false;
  }

  allValid() {
    for (let key in this.fields) {
      if (this.fieldValid(key) === false) {
        return false;
      }
    }
    return true;
  }

  fieldValid(field: string | number | symbol) {
    return (
      this.fields.hasOwnProperty(field) && (this.fields as any)[field] === true
    );
  }

  purgeFields() {
    this.fields = {};
    this.errorMessages = {};
  }

  messageAlways(field: any, message: any, options = {}) {
    if (message && this.messagesShown) {
      return this.helpers.element(message, options);
    }
  }

  message(
    field: string,
    inputValue: any,
    validations: any,
    options = {} as any
  ) {
    (this.errorMessages as any)[field] = null;
    (this.fields as any)[field] = true;
    if (!Array.isArray(validations)) {
      validations = validations.split("|");
    }
    var rules = options.validators
      ? { ...this.rules, ...options.validators }
      : this.rules;
    for (let validation of validations) {
      let [value, rule, params] = this.helpers.normalizeValues(
        inputValue,
        validation
      );
      if (!this.helpers.passes(rule, value, params, rules)) {
        this.fields[field] = false;
        let message = this.helpers.message(rule, field, options, rules);

        if (params.length > 0 && rules[rule].hasOwnProperty("messageReplace")) {
          message = rules[rule].messageReplace(message, params);
        }

        (this.errorMessages as any)[field] = message;
        if (this.messagesShown) {
          return message;
          // return this.helpers.element(message, options);
        }
      }
    }
  }

  helpers = {
    parent: this,

    passes(rule: string | number, value: any, params: any, rules: any) {
      if (!rules.hasOwnProperty(rule)) {
        console.error(
          `Rule Not Found: There is no rule with the name ${rule}.`
        );
        return true;
      }
      if (!this.isRequired(rule, rules) && this.isBlank(value)) {
        return true;
      }
      return rules[rule].rule(value, params, this.parent) !== false;
    },

    isRequired(
      rule: string | number,
      rules: { [x: string]: { required: any } }
    ) {
      return rules[rule].hasOwnProperty("required") && rules[rule].required;
    },

    isBlank(value: string | null) {
      return typeof value === "undefined" || value === null || value === "";
    },

    normalizeValues(value: any, validation: any) {
      return [
        this.valueOrEmptyString(value),
        this.getValidation(validation),
        this.getOptions(validation)
      ];
    },

    getValidation(validation: { split?: any }) {
      if (
        validation === Object(validation) &&
        !!Object.keys(validation).length
      ) {
        return Object.keys(validation)[0];
      } else {
        return validation.split(":")[0];
      }
    },

    getOptions(validation: any) {
      if (
        validation === Object(validation) &&
        !!Object.values(validation).length
      ) {
        var params = Object.values(validation)[0];
        return Array.isArray(params) ? params : [params];
      } else {
        let params: string[] = (validation as string).split(":");
        return (params as string[]).length > 1
          ? (params as string[])[1].split(",")
          : [];
      }
    },

    valueOrEmptyString(value: null) {
      return typeof value === "undefined" || value === null ? "" : value;
    },

    toSentence(arr: any) {
      return (
        arr.slice(0, -2).join(", ") +
        (arr.slice(0, -2).length ? ", " : "") +
        arr.slice(-2).join(arr.length > 2 ? ", or " : " or ")
      );
    },

    testRegex(
      value: { toString: () => { match: (arg0: any) => null } },
      regex: RegExp
    ) {
      return value.toString().match(regex) !== null;
    },

    message(
      rule: string | number,
      field: any,
      options: { messages?: any },
      rules: { [x: string]: { message: any } }
    ) {
      options.messages = options.messages || {};
      var message =
        options.messages[rule] ||
        options.messages.default ||
        this.parent.messages[rule] ||
        this.parent.messages.default ||
        rules[rule].message;
      return message.replace(":attribute", this.humanizeFieldName(field));
    },

    humanizeFieldName(field: {
      replace: (
        arg0: RegExp,
        arg1: string
      ) => {
        replace: (arg0: RegExp, arg1: string) => { toLowerCase: () => void };
      };
    }) {
      // supports snake_case or camelCase
      return field
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .toLowerCase();
    },

    element(message: any, options: { element?: any; className?: any }) {
      var element = options.element || this.parent.element;
      return element(message, options.className);
    },

    numeric(val: any) {
      return this.testRegex(val, /^(\d+.?\d*)?$/);
    },

    momentInstalled() {
      if (!moment) {
        console.warn(
          "Date validators require using momentjs https://momentjs.com and moment objects."
        );
        return false;
      } else {
        return true;
      }
    },

    size(val: string, type: string): number {
      // if an array or string get the length, else return the value.
      if (type === "string" || type === undefined || type === "array") {
        return val.length;
      } else if (type === "num") {
        return parseFloat(val);
      } else {
        return 0;
      }
    },

    sizeText(type: string): string {
      if (type === "string" || type === undefined) {
        return " characters";
      } else if (type === "array") {
        return " elements";
      } else {
        return "";
      }
    }
  };
}
