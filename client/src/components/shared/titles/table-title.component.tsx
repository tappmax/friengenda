import React from "react";

interface Props {
  title: string;
  children?: any;
  style?: any;
}

/** Renders `title` prop with left alignment as an `h2` and
 * any children passed in will be rendered to the right in same line. 
 */
export const FrenTableTitle = ({ title, children, style }: Props) => {
  return (
    <h2
      style={{
        ...(style||{}),
        display: "flex",
        marginBottom : 0
      }}
    >
      <span style={{ flexGrow: 1 }}>{title}</span>
      <span style={{ display: "flex", justifyContent: "flex-end" }}>{children}</span>
    </h2>
  );
};
