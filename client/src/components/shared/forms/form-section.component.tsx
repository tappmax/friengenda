import React from "react";

export const FrenFormSection = (props: any) => {
    return (<div style={{maxWidth: 670, padding: "0 2em", ...props.style}}>{props.children}</div>);
}