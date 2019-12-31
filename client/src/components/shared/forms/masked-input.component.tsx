import React from "react";
import { FrenValidator } from "common/validator";
import NumberFormat from "react-number-format";
import { appStaticStyles } from "styles/app.styles";
import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input
} from "@material-ui/core";

type Props = {
  name: string;
  value: any;
  onChange: Function;
  submit: () => void;
  format?: string | undefined;
  validator?: FrenValidator | undefined;
  validate?: any;
  labelText?: string;
  [key: string]: any;
};
export const FrenMaskableNumberInput = ({
  name,
  value,
  onChange,
  submit,
  validator,
  validate,
  labelText,
  format,
  style,
  ...props
}: Props) => {
  const hasError = validator
    ? !!(validator as FrenValidator).message(name, value, validate)
    : false;
  return (
    <>
        <FormControl error={hasError} style={{...appStaticStyles.formControl, ...style}}>
          <InputLabel htmlFor={name}>{labelText}</InputLabel>
          <NumberFormat
            customInput={Input}
            format={format}
            onChange={(e: any) => onChange(name, e.target.value)}
            onKeyPress={(e: any) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            value={value || ""}
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
