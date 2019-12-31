import React from "react";
import { Button } from "@material-ui/core";
import { variables } from "styles/common.styles";
interface Props {
  clickHandler: (event: any) => void;
  [key: string]: any;
}
export const FrenPlainButton = (props: Props) => {
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
      }}></span>{props.children}
    </Button>
  );
};
