import React from "react";
import { FrenValidator } from "common/validator";
// import ReactPasswordStrength from "react-password-strength";
import { OnChangeFunction } from "./helpers";

type props = {
  name: string;
  value: any;
  onChange: OnChangeFunction;
  minPasswordLength: number;
  minPasswordScore: number;
  validator?: FrenValidator | undefined;
  validate?: any;
  labelText?: string;
  [key: string]: any;
};
export const FrenPassword = (props: props) => {
  const {
    name,
    value,
    onChange,
    minPasswordLength,
    minPasswordScore,
    validator,
    validate,
    labelText,
  } = props;
  return (
    <>
      <div style={{ position: "relative" }}>
        {labelText && <label>{labelText}</label>}
        {/* <ReactPasswordStrength
          minLength={minPasswordLength}
          minScore={minPasswordScore}
          scoreWords={["weak", "okay", "good", "strong", "stronger"]}
          changeCallback={(score: any, password: any, isValid: any) =>
            onChange(name, (password || {password: null}).password)
          }
          style={{border: "none"}}
          inputProps={{
            name: name,
            value: value,
            ...props
          }}
        /> */}
        {validator && (validator as FrenValidator).message(name, value, validate)}
      </div>
    </>
  );
};
