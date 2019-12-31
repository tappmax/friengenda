import React from "react";
import { variables } from "styles/common.styles";
interface Props {
  title: any;
  includeBreak?: boolean;
  children?: any;
  /** html element name */
  component?: any;
  [key: string]: any;
}
/** Renders `title` prop with left alignment as an `h2` and
 * any children passed in will be rendered to the right in same line. 
 * Option to render a heavy bottom border */
export const FrenTitle = ({ title, includeBreak, children, component, ...rest }: Props) => {
  const Component = component ? component : "h2";
  return (
    <Component
      style={{
        display: "flex",
        borderBottom: includeBreak
          ? `solid 7px ${variables.brandColors.frenPrimary}`
          : undefined,
        ...rest.style
      }}
    >
      <span style={{ flexGrow: 1, verticalAlign:'bottom' }}>{title}</span>
      <span style={{ display: "flex", justifyContent: "flex-end" }}>{children}</span>
    </Component>
  );
};
