import React from "react";
import { FrenValidator } from "common/validator";
import {
  InputAdornment,
  InputLabel,
  Input,
  FormControl,
  FormHelperText
} from "@material-ui/core";
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
export const FrenPercentInput = ({
  name,
  value,
  onChange,
  submit,
  validator,
  validate,
  labelText,
  style,
  ...props
}: props) => {
  const hasError = validator
    ? !!(validator as FrenValidator).message(name, value, validate)
    : false;

  return (
    <>
      <FormControl error={hasError} style={{...appStaticStyles.formControl, ...style}}>
        <InputLabel htmlFor={name}>{labelText}</InputLabel>
        <Input
          onChange={(e: any) => onChange(name, e.target.value)}
          onKeyPress={(e: any) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          value={value || ""}
          type="number"
          startAdornment={<InputAdornment position="start">%</InputAdornment>}
          {...props}
        />
        {hasError && (
          <FormHelperText>
            {(validator as FrenValidator).message(name, value, validate)}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};
