import React from "react";
import { FrenValidator } from "common/validator";
import { SelectListItem } from "./helpers";
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  FormHelperText
} from "@material-ui/core";
import { listHasItems } from "helpers/common.helpers";
import { appStaticStyles } from "styles/app.styles";

type props = {
  name: string;
  value: any;
  onChange: Function;
  submit: Function;
  validator?: FrenValidator | undefined;
  validate?: any;
  labelText?: string;
  list: SelectListItem[];
  [key: string]: any;
};
export const FrenSelectList = ({
  name,
  value,
  onChange,
  submit,
  validator,
  validate,
  list,
  labelText,
  ...props
}: props) => {
  const inputLabel = React.useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    if (inputLabel.current !== null)
      setLabelWidth(inputLabel.current.offsetWidth);
  }, []);
  const hasError = validator
    ? !!(validator as FrenValidator).message(name, value, validate)
    : false;
  value = listHasItems(list) ? value : ""
  return (
    <FormControl error={hasError} style={appStaticStyles.formControl}>
      <InputLabel id={`${name}-label`}>{labelText}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={name}
        value={value || ""}
        labelWidth={labelWidth}
        onChange={(e: any) => {
          onChange(name, e.target ? e.target.value : undefined);
        }}
        {...props}
      >
        {listHasItems(list)
          ? list.map((option: SelectListItem, i: number) => (
              <MenuItem key={`-${option.text}-${i}`} value={option.value}>
                {option.text}
              </MenuItem>
            ))
          : null}
      </Select>
      {hasError && (
        <FormHelperText>
          {(validator as FrenValidator).message(name, value, validate)}
        </FormHelperText>
      )}
    </FormControl>
  );
};
