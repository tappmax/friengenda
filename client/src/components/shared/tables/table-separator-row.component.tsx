import { withStyles } from "@material-ui/styles";
import { createStyles, TableRow, TableCell } from "@material-ui/core";
import { variables, theme } from "styles/common.styles";
import React from "react";

const styles = createStyles({
    line: {
        height: 1,
        padding: "0!important",        

        '& td': {
            height: 1,
            maxHeight: 1,
            minHeight: 1,
            padding: 0,
            backgroundColor: variables.brandColors.frenOrange
        }
    },
    spacing: {
        padding: 0,

        '& td': {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2)
        }
    }
})

interface Props {
    colSpan?: number;
    colStart?: number;
    classes: any;
}

export const FrenTableSeparatorRow = withStyles(styles) (({
    colSpan,
    colStart,
    classes
} : Props) : JSX.Element | null => {
    return (
        <React.Fragment>
            <TableRow className={classes.spacing}>
                <TableCell colSpan={colSpan}/>
            </TableRow>
            <TableRow className={classes.line}>
                {(colStart && colStart > 0) && (<TableCell style={{background:'none', height: 1}} colSpan={colStart}/>)}
                <TableCell colSpan={colSpan} style={{height: 1}}/>
            </TableRow>
            <TableRow className={classes.spacing}>
                <TableCell colSpan={colSpan}/>
            </TableRow>
        </React.Fragment>
    );
});
