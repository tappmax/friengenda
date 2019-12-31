import { FrenValidator } from "common/validator";

export interface FormVM {
  validator: FrenValidator | undefined;
  onChange: OnChangeFunction;
  submit: Function;
}

export interface FormWithPasswordVM extends FormVM {
  minPasswordScore: number;
  minPasswordLength: number;
}
export type SelectListItem = {
  text: string;
  value: any;
  isSelected: boolean;
};

export type OnChangeFunction = (name: string, val: any) => any;

// TODO: probably need to make some overrides
export const GetSelectList = (list: string[]) => {
  return list ? list.map((item: string) => ({
    isSelected: false,
    text: item,
    value: item
  } as SelectListItem))
  : [];
}