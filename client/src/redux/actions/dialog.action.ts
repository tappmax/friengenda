import { DialogConstants } from "constants/dialog.constants";
import { ReduxState } from "redux/orchestrator";
import { ConfirmationDialogState, ConfirmationDialogProps, SessionDialogProps } from "models/dialog.models";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback } from "react";

/**
 * Uses a confirmation dialog
 */
export const useConfirmationDialog = (key: string, callback : (payload: any) => void, deps: any[]) => {
    const confirmationDialog = useSelector<ReduxState,ConfirmationDialogState>(state => state.confirmationDialog);
    const dispatch = useDispatch();
    const stableCallback = useCallback(callback, deps);
    useEffect(() => {
        if(confirmationDialog.props.key === key && !confirmationDialog.open) {
            const result = confirmationDialog.result;

            // Dispatch CLOSED state first to clear the key to make sure this doesnt happen twice
            dispatch({type: DialogConstants.actions.CONFIRMATION_DIALOG_CLOSED});

            // Issue the callback
            if(result)
                stableCallback(confirmationDialog.props.payload);
        }
    }, [confirmationDialog.open, confirmationDialog.result, confirmationDialog.props.key, key, stableCallback, dispatch, confirmationDialog.props.payload])
}

/**
 * Open the centralized confirmation dialog
 * @param message Message to display in the confirmation dialog
 * @param key Key used to uniquely identify the response of the confirmation dialog
 */
export const openConfirmationDialog = (props: ConfirmationDialogProps) => (dispatch: any) => {
    dispatch({
        type: DialogConstants.actions.CONFIRMATION_DIALOG_OPEN,
        payload: {props: props, open: true, result: false}
    })
}

/**
 * Close the opened confirmation dialog
 * @param result Dialog result
 */
export const closeConfirmationDialog = (result: boolean) => (dispatch: any, state: () => ReduxState) => {
    if(!state().confirmationDialog.open)
        return;
        
    dispatch({
        type: DialogConstants.actions.CONFIRMATION_DIALOG_CLOSE,
        payload: result
    })
}

/**
 * Open the session dialog
 */
export const openSessionDialog = (props: SessionDialogProps) => (dispatch: any) => {
    dispatch({
        type: DialogConstants.actions.SESSION_DIALOG_OPEN,
        payload: props
    })
}

/**
 * Close the session dialog
 */
export const closeSessionDialog = () => (dispatch: any, state: () => ReduxState) => {
    if(!state().sessionDialog.open)
        return;
        
    dispatch({
        type: DialogConstants.actions.SESSION_DIALOG_CLOSE
    })
}
