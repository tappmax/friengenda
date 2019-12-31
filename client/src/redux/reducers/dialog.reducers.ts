import { ConfirmationDialogState, SessionDialogState } from "models/dialog.models";
import { DialogConstants } from "constants/dialog.constants";

export const confirmationDialogReducer = (
    state: ConfirmationDialogState = { props: {title: 'Confirmation', message: '?', key:'', icon:'none' }, open: false, result: false },
    action: any
  ): ConfirmationDialogState => {
    
  switch (action.type) {
    case DialogConstants.actions.CONFIRMATION_DIALOG_OPEN:
      return action.payload;

    case DialogConstants.actions.CONFIRMATION_DIALOG_CLOSE:
      return {
        props: state.props,
        open: false,
        result: action.payload
      }

    case DialogConstants.actions.CONFIRMATION_DIALOG_CLOSED:
      return {
        props: {...state.props, key:''},
        open: false,
        result: false
      }
  }

  return state;
}

export const sessionDialogReducer = (
  state: SessionDialogState = { props: { }, open: false },
  action: any
): SessionDialogState => {
  
  switch (action.type) {
    case DialogConstants.actions.SESSION_DIALOG_OPEN:
      return {
        open: true,      
        props: action.payload
      }

    case DialogConstants.actions.SESSION_DIALOG_CLOSE:
      return {
        props: state.props,
        open: false      
      }
  }

  return state;
}
