import React from "react";
export const FrenHalfContainer = (props: any) => {
return (<div style={{width: "50%", ...props.style}}>{props.children}</div>);
}