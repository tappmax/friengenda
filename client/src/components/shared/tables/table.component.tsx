import { withStyles, createStyles } from "@material-ui/styles";
import { Theme, Table } from "@material-ui/core";
import { variables } from "styles/common.styles";

export const FrenTable = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '& th': {
        paddingTop: theme.spacing(0.25),
        paddingBottom: theme.spacing(0.25),
        backgroundColor: variables.brandColors.frenPrimary,
        textAlign: 'left',
        color: variables.solidColors.white,  
      }
    }
  })
)(Table);
