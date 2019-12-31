import React from "react";
import { TableFooter, TableRow, TablePagination } from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
interface Props {
  count: number;
  pageSize: number;
  page: number;
  colSpan: number;
  handleChangePage: (
    e: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  handleChangeRowsPerPage: (e: any) => void;
  [key: string]: any;
}
export const FrenPaginationTableFooter = (props: Props) => {
  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25, { label: "All", value: -1 }]}
          colSpan={props.colSpan}
          count={props.count || 0}
          rowsPerPage={props.pageSize || 0}
          page={props.page - 1 || 0}
          SelectProps={{
            inputProps: { "aria-label": "rows per page" },
            native: true
          }}
          onChangePage={props.handleChangePage}
          onChangeRowsPerPage={props.handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </TableRow>
    </TableFooter>
  );
};
