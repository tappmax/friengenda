import React from "react";
import { Button } from "@material-ui/core";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
interface Props {
  clickHandler: (event: any) => void;
  disabled?: boolean;
  [key: string]: any;
}
export const FrenEditButton = (props: Props) => {
  return (
    <Button
      color="secondary"
      disabled={props.disabled}
      onClick={props.clickHandler}
      style={{margin:'0,6', padding:0}}
    >
      <span style={{margin: "5px 3px 0 0"}}>
        <EditOutlinedIcon fontSize="small" />
      </span>
      {props.children}
    </Button>
  );
};
