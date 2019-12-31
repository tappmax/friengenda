import { Attachment } from "models/attachment.models";
import { CommonConstants } from "constants/common.constants";
import { AttachmentConstants as constants } from "constants/attachment.constants";
import { CommonState } from "models/common.models";
import { getLoadingActionType, getErrorActionType, getCompleteActionType } from "helpers/action.helpers";
import { CommonStateLoading, CommonStateError, CommonStateReducer } from "./common.reducers";

export const attachmentsReducer = (
    state: CommonState<Attachment[]> = CommonConstants.defaults.commonState,
    action: any
  ): CommonState<Attachment[]> => {
    switch (action.type) {
      case getLoadingActionType(constants.actions.GET_ATTACHMENTS):
        return CommonStateLoading(state);

      case getErrorActionType(constants.actions.GET_ATTACHMENTS):
      case getErrorActionType(constants.actions.SET_ATTACHMENT):
      case getErrorActionType(constants.actions.REMOVE_ATTACHMENT):
        return CommonStateError(action.payload);
        
      case getCompleteActionType(constants.actions.SET_ATTACHMENT):
      case getCompleteActionType(constants.actions.REMOVE_ATTACHMENT):
      case getCompleteActionType(constants.actions.GET_ATTACHMENTS):
        return CommonStateReducer<Attachment[]>(
          action.payload
        );
    }
    return state;
  };
  
  