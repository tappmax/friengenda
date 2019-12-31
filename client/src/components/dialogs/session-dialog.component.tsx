import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { ReduxState } from "redux/orchestrator";
import { SessionDialogState } from "models/dialog.models";
import { closeSessionDialog } from "actions/dialog.action";
import WarningIcon from '@material-ui/icons/Warning';

export const FrenSessionDialog = () => {
  const dispatch = useDispatch();
  const {open} = useSelector<ReduxState,SessionDialogState>(state => state.sessionDialog);
  //const {data:user} = useSelector<ReduxState,CommonState<AppUser>>(state => state.user);

  const handleOk = () => {
    dispatch(closeSessionDialog())
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle id="alert-dialog-title">
          <div style={{verticalAlign:'middle', display: 'inline-flex'}}>
            <WarningIcon style={{marginRight:'1rem', paddingTop:'5px'}}/>
            Warning
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your session will end in 2 minutes due to inactivity 
            <p>As a security precaution, if there is no additional activity in your session, the session will end and you will be brought to the login page.</p>
            <p>If you are still working, choose OK to continue.</p>
          </DialogContentText>                  
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk} color="primary" autoFocus>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

