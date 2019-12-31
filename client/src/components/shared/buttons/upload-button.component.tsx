import React from "react";
import { Button } from "@material-ui/core";
import PublishIcon from "@material-ui/icons/Publish";

interface Props {
  clickHandler: (event: any) => void;
  disabled? : boolean;
  [key: string]: any;
}

export const FrenUploadButton = ({clickHandler, disabled, style, children} : Props) => {
  return (
    <Button
      color="secondary"
      disabled={disabled || false}
      style={style}
      onClick={clickHandler}
    >
      <span style={{
        padding: 0,
        margin: "5px 3px 0 0"
      }}>
        <PublishIcon fontSize="small"/>
      </span>
      {children}
    </Button>
  );
};
