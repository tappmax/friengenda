import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { ReduxState } from "redux/orchestrator";
import { ConfirmationDialogState } from "models/dialog.models";
import { closeConfirmationDialog } from "actions/dialog.action";
import WarningIcon from '@material-ui/icons/Warning';

export const FrenConfirmationDialog = () => {
  const dispatch = useDispatch();
  const {open, props} = useSelector<ReduxState,ConfirmationDialogState>(state => state.confirmationDialog);

  const handleNo = () => {
    dispatch(closeConfirmationDialog(false))
  }

  const handleYes = () => {
    dispatch(closeConfirmationDialog(true))
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle id="alert-dialog-title">
          <div style={{verticalAlign:'middle', display: 'inline-flex'}}>
          { props.icon === 'warning' && (
              <WarningIcon style={{marginRight:'1rem', paddingTop:'5px'}}/>
          )}
          {props.title}
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>                  
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNo} color="primary" autoFocus>No</Button>
          <Button onClick={handleYes} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

