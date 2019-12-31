import React from "react";
export const FrenFullContainer = (props: any) => {
return (<div style={{width: "100%", display: "flex", ...props.style}}>{props.children}</div>);
}