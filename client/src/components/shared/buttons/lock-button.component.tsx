import React from "react";
import { Button } from "@material-ui/core";
import LockOpen from "@material-ui/icons/LockOpen";

interface Props {
  clickHandler: (event: any) => void;
  disabled? : boolean;
  [key: string]: any;
}

export const FrenLockButton = ({clickHandler, disabled, style, children} : Props) => {
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
        <LockOpen fontSize="small"/>
      </span>
      {children}
    </Button>
  );
};
