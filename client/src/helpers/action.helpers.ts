import { CommonConstants } from "constants/common.constants";

export const getLoadingActionType = (prefix: string): string =>
`${prefix}${CommonConstants.actionSuffixes.LOADING}`;
export const getCompleteActionType = (prefix: string): string =>
`${prefix}${CommonConstants.actionSuffixes.COMPLETE}`;
export const getErrorActionType = (prefix: string): string =>
`${prefix}${CommonConstants.actionSuffixes.ERROR}`;
