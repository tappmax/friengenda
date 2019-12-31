import React from "react";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import { appStaticStyles } from "styles/app.styles";
import { FrenSortableTh } from "./sortable-th.component";
import { variables } from "styles/common.styles";

export interface FrenOrderableTheadProps<T> {
  onRequestSort: (name: keyof T, descend: boolean) => void;
  headCells: HeadCell<T>[];
}
export interface HeadCell<T> {
  id: keyof T;
  isNumeric: boolean;
  disablePadding: boolean;
  label: any;
  order?: boolean;
  descend?: boolean;
  width?: string;
  show?: boolean;
}
export function FrenOrderableThead<T>(props: FrenOrderableTheadProps<T>) {
  const { onRequestSort, headCells } = props;

  return (
    <TableHead>
      <TableRow style={appStaticStyles.table.header}>
        {headCells.map((headCell: HeadCell<T>, i: number) => {
          if(headCell.show !== undefined && !headCell.show)
            return null;
            
          if (headCell.order === undefined || headCell.descend === undefined) {
            return (
              <TableCell
                key={`fren-orderable-thead-${headCell.id as any}-${i}`}
                style={{
                  color: variables.solidColors.white,
                  userSelect: "none",
                  width: headCell.width
                }}
                align={headCell.isNumeric ? "right" : "left"}
                padding={headCell.disablePadding ? "none" : "default"}
              >
                <span
                  style={{
                    color: variables.solidColors.white,
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  {headCell.label}
                </span>
              </TableCell>
            );
          } else {
            return (
              <FrenSortableTh
                key={`fren-orderable-thead-${headCell.id as any}-${i}`}
                {...{ headCell, index: i, onRequestSort }}
              />
            );
          }
        })}
      </TableRow>
    </TableHead>
  );
}
