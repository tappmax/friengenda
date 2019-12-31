import React from "react";
import { Button } from "@material-ui/core";
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
interface Props {
  clickHandler: (event: any) => void;
  disabled?: boolean;
  style?: any;
  [key: string]: any;
}
export const FrenDownloadButton = (props: Props) => {
  return (
    <Button
      color="secondary"
      disabled={props.disabled}
      onClick={props.clickHandler}
      style={{margin:'0,6', padding:0, ...props.style}}
    >
      <span style={{margin: "5px 3px 0 0"}}>
        <CloudDownloadOutlinedIcon fontSize="small" />
      </span>
      {props.children}
    </Button>
  );
};
