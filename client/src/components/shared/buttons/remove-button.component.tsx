import React from "react";
import { Button } from "@material-ui/core";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { variables } from "styles/common.styles";
interface Props {
  clickHandler: (event: any) => void;
  disabled?: boolean;
  [key: string]: any;
}
export const FrenTrashButton = (props: Props) => {
  return (
    <Button
      color={props.color ? props.color : "secondary"}
      onClick={props.clickHandler}
      disabled={props.disabled}
      style={{ ...props.style, opacity: props.disabled ? 0.4 : 1.0}}      
    >
      <span
        style={{
          margin: "5px 3px 0 0"
        }}
      >
        <DeleteOutlineIcon fontSize="small" />
      </span>
      {props.children}
    </Button>
  );
};

export const FrenDeleteButton = (props: Props) => {
  return (
    <FrenTrashButton
      color="primary"
      disabled={props.disabled}
      style={{ color: variables.solidColors.dkRed, margin:'0,6', padding:0, marginRight:'2rem' }}
      clickHandler={props.clickHandler}
    >
      Delete
    </FrenTrashButton>
  );
};
