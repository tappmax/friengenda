import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { Button } from "@material-ui/core";
import { variables } from "styles/common.styles";
interface Props {
  clickHandler: (event: any) => void;
  [key: string]: any;
}
export const FrenCancelButton = (props: Props) => {
  return (
    <Button
      color="secondary"
      onClick={props.clickHandler}
      style={{ margin: "0,6", padding: 0 , marginRight: "2rem"}}
    >
      <span
        style={{
          color: variables.brandColors.frenSecondary,
          padding: "6px 2px 0 0"
        }}
      >
        <CloseIcon fontSize="small" />
      </span>
      {props.children}
    </Button>
  );
};
