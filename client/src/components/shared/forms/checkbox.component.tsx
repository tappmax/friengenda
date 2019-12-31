import React from "react";
import { FrenValidator } from "common/validator";
import { Checkbox, FormControlLabel, FormControl, FormHelperText } from "@material-ui/core";
import { appStaticStyles } from "styles/app.styles";

interface Props {
  name: string;
  value: boolean;
  onChange: (key: string, val: boolean) => void;
  validator?: FrenValidator | undefined;
  validate?: any;
  labelText?: string;
  [key: string]: any;
}

export const FrenCheckbox = ({
  name,
  value,
  onChange,
  validator,
  validate,
  labelText,
  ...props
}: Props) => {
  const hasError = validator
    ? !!(validator as FrenValidator).message(name, value, validate)
    : false;
  return (
    <FormControl error={hasError} style={appStaticStyles.formControl}>
      <FormControlLabel
        label={labelText}
        control={
          <Checkbox
            key={`${name}-checkbox`}
            checked={value}
            onChange={(e: any, val: any) => {
              return onChange(name, val);
            }}
            name={name}
            id={name}
            value={value}
            color="primary"
            {...props}
          />
        }
      />
      {hasError && (
        <FormHelperText>
          {(validator as FrenValidator).message(name, value, validate)}
        </FormHelperText>
      )}
    </FormControl>
  );
};
