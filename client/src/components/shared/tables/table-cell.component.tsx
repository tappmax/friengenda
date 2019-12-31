import React from "react";
import { CommonConstants } from "constants/common.constants";
import { formatCurrency } from "helpers/formatting.helpers";
import { TableCell } from "@material-ui/core";
interface Props {
  isMoney?: boolean;
  isNumber?: boolean;
  alignRight?: boolean;
  data: any;
  style?: any;
  colSpan?: number;
  className?: any;
  onClick?: (e:any) => void;
}

export const FrenTableCell = ({ isNumber, isMoney, style, data, colSpan, alignRight, className, onClick }: Props) => {
  let blankChar = CommonConstants.ui.defaults.blankChar
  let styles: any = { padding: "0 1rem", borderBottom: 0 };
  if (isMoney === true) {
    isNumber = true;
    data = formatCurrency(data, false);
  }
  if (styles) styles = { ...styles, ...style };
  return (
    <TableCell className={className} style={styles} colSpan={colSpan} onClick={onClick} >
      {isMoney && <span>$</span>}
      <span style={{ float: (isNumber||alignRight) ? "right" : "left" }}>{data || blankChar}</span>
    </TableCell>
  );
};
