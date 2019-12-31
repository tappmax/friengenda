import { HeadCell } from "./orderable-thead.component";
import { TableCell } from "@material-ui/core";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import React from "react";
import { variables } from "styles/common.styles";
import { appStaticStyles } from "styles/app.styles";

interface Props<T> {
  onRequestSort: (name: keyof T, descend: boolean) => void;
  headCell: HeadCell<T>;
  index: number;
}
export function FrenSortableTh<T>({
  headCell,
  index: i,
  onRequestSort
}: Props<T>) {
  return (
    <TableCell
      key={`fren-sortable-th-${headCell.id as any}-${i}`}
      style={{ color: variables.solidColors.white, userSelect: "none", width:headCell.width }}
      align={headCell.isNumeric ? "right" : "left"}
      padding={headCell.disablePadding ? "none" : "default"}
      sortDirection={
        headCell.order ? (headCell.descend ? "desc" : "asc") : undefined
      }
    >
      <span
        style={{
          color: variables.solidColors.white,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between"
        }}
        onClick={(e: React.MouseEvent<unknown>) => {
          e.preventDefault();
          onRequestSort(headCell.id, headCell.order ? !headCell.descend : true);
        }}
      >
        {headCell.label}
        <div
          style={{
            transition: "transform 200ms ease",
            marginBottom: "-10px",
            transform:
              headCell.order && !!headCell.descend
                ? "rotate(180deg) translateY(10px)"
                : "rotate(0deg)"
          }}
        >
          <ArrowDropUp
            style={
              {
                opacity: headCell.order ? "1" : "0.4",
                "&:hover": {
                  opacity: 1
                }
              } as any
            }
          />
        </div>
        {headCell.order ? (
          <span style={appStaticStyles.visuallyHidden}>
            {headCell.descend ? "sorted descending" : "sorted ascending"}
          </span>
        ) : null}
      </span>
    </TableCell>
  );
}
