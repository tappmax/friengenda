import React from "react";
import { FrenValidator } from "common/validator";
import { TextField } from "@material-ui/core";
import { appStaticStyles } from "styles/app.styles";

type props = {
  name: string;
  value: any;
  onChange: Function;
  submit: () => void;
  validator?: FrenValidator | undefined;
  validate?: any;
  labelText?: string;
  [key: string]: any;
};
export const FrenInput = ({
  name,
  value,
  onChange,
  submit,
  validator,
  validate,
  labelText,
  style,
  hidden,
  ...props
}: props) => {
  let styles = {
    ...appStaticStyles.formControl,
    paddingTop: !labelText ? "1rem" : undefined
  };
  if (value === undefined) {
    value = ""
  }
  return (
    <>
      <div style={{...styles, ...style, visibility: hidden ? "hidden" : "visible"}}>
        <TextField
          label={labelText}
          onChange={(e: any) => onChange(name, e.target.value)}
          onKeyPress={(e: any) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          helperText={
            validator
              ? (validator as FrenValidator).message(name, value, validate)
              : undefined
          }
          value={value}
          error={
            validator
              ? !!(validator as FrenValidator).message(name, value, validate)
              : undefined
          }
          style={{width: "100%"}}
          {...props}
        />
      </div>
    </>
  );
};
