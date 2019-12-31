import { withStyles } from "@material-ui/styles";
import { Theme, createStyles, TableRow } from "@material-ui/core";
import { variables } from "styles/common.styles";

export const FrenTableLedgerRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: variables.solidColors.white,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: variables.alphaColors.highlighterYellow45
      },
      "&:nth-of-type(odd)": {
        backgroundColor: variables.alphaColors.frenGreen20,
        "&:hover": {
          backgroundColor: variables.alphaColors.frenGreen50
        }
      }
    }
  })
)(TableRow);
