import React from "react";
import { Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { variables } from "styles/common.styles";
interface Props {
  clickHandler: (event: any) => void;
  [key: string]: any;
}
export const FrenAddButton = (props: Props) => {
  return (
    <Button
      color="secondary"
      style={{
        marginBottom: "2rem",
        ...props.style
      }}
      onClick={props.clickHandler}
    >
      <span style={{
        margin: "5px 3px 0 0",
        color: variables.brandColors.frenPrimary
      }}><AddCircleIcon /></span>{props.children}
    </Button>
  );
};
