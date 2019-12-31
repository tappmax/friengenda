import React from "react";

export const FrenForm = (props: any) => {
  return (
    <form noValidate autoComplete="off" style={{position: "relative", ...props.style}}>
      {props.children}
    </form>
  );
};
