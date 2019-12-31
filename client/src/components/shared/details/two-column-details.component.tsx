import React from "react";
import { Table, TableBody, TableRow } from "@material-ui/core";
import { CommonConstants } from "constants/common.constants";
import { FrenTwoColumnDetailsModel } from "models/common.models";

interface Props {
  model: FrenTwoColumnDetailsModel[];
  children?: any;
  leftWidth?: number;
}

/** Renders `model` prop with left alignment as a two column data table.
 * Any children passed in will be rendered to the top right.
 * Uses capitalized model keys as names, so you should pass in display 
 * friendly names as well as formatted values, as those are not doctored either. */
export function FrenTwoColumnDetails({
  model,
  children,
  leftWidth
}: Props): JSX.Element | null {
  if (!model) return null;
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%", padding: "0 0rem" }}>
        <Table>
          <TableBody>
            {model.map((prop: FrenTwoColumnDetailsModel, i: number) => {
              return (
                <TableRow key={prop + ((model as any)[prop.name] || i) + i}>
                    <th
                      scope="row"
                      style={{ textAlign: "right", padding: "0 1rem", minWidth:leftWidth || '0' }}
                    >
                      {prop.name}
                    </th>
                    <td style={{ padding: "0.1rem 1rem", width: "100%" }}>
                      {prop.value || CommonConstants.ui.defaults.blankChar }
                    </td>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div
        style={{
          width: "30%",
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 1rem"
        }}
      >
        {children}
      </div>
    </div>
  );
}
