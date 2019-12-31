import React from "react";
import { Button } from "@material-ui/core";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
interface Props {
  clickHandler: (event: any) => void;
  [key: string]: any;
}
export const FrenSaveButton = (props: Props) => {
  return (
    <Button
      color="secondary"
      onClick={props.clickHandler}
      style={{margin:'0,6', padding:0}}
    >
      <span style={{margin: "5px 3px 0 0",}}>
        <SaveOutlinedIcon fontSize="small"/>
      </span>
      {props.children}
    </Button>
  );
};
