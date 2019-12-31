import React, { useEffect, useState } from "react";
import { FrenValidator } from "common/validator";
import { SelectListItem } from "./helpers";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { appStaticStyles } from "styles/app.styles";

interface Props {
  name: string;
  value: any;
  onChange: Function;
  submit: Function;
  validator?: FrenValidator | undefined;
  validate?: string;
  labelText?: string;
  list: SelectListItem[];
  [key: string]: any;
}

export const FrenAutocomplete = ({
  name,
  value,
  onChange,
  submit,
  validator,
  validate,
  labelText,
  list,
  style,
  hidden,
  ...rest
}: Props) => {
  const [val, setVal] = useState("" as any);
  useEffect(() => {
    setVal(list.filter(o => o.value === value)[0]);
  }, [list, value]);
  return (
    <div style={{ ...style, visibility: hidden ? "hidden" : "visible" }}>
      <Autocomplete
        options={list}
        style={{ paddingRight: "1rem" }}
        getOptionLabel={(option: any) => option.text || ""}
        disabled={rest.disabled}
        value={val}
        getOptionSelected={(option: SelectListItem, val: any) => {
          return option.value === val;
        }}
        onChange={(e: any, newValue: SelectListItem) => {
          if (newValue && newValue.value) {
            onChange(name, newValue.value);
          } else {
            onChange(name, "");
          }
        }}
        renderInput={(params: any) => {
          return (
            <TextField
              {...params}
              style={{ ...appStaticStyles.formControl, paddingRight: 0 }}
              label={labelText}
              helperText={
                validator
                  ? (validator as FrenValidator).message(name, value, validate)
                  : undefined
              }
              error={
                validator
                  ? !!(validator as FrenValidator).message(name, value, validate)
                  : undefined
              }
              {...rest}
            />
          );
        }}
      />
    </div>
  );
};
