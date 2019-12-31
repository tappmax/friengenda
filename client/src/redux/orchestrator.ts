import { combineReducers } from 'redux';
import {
  CommonState,
  PaginatedResponse,
  Enums,
  AppSession
} from 'models/common.models';
import { userReducer } from 'reducers/user.reducers';
import { AppUser } from 'models/auth.models';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { NavLink } from 'models/nav.models';
import {
  breadcrumbReducer,
  enumsReducer,
  appSessionReducer
} from 'reducers/common.reducers';
import {
  ConfirmationDialogState,
  SessionDialogState
} from 'models/dialog.models';
import {
  confirmationDialogReducer,
  sessionDialogReducer
} from 'reducers/dialog.reducers';

export interface ReduxState {
  router: RouterState<any>;

  user: CommonState<AppUser>;

  breadcrumbs: NavLink[];
  enums: CommonState<Enums>;
  appSession: AppSession;

  confirmationDialog: ConfirmationDialogState;
  sessionDialog: SessionDialogState;
}

export const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),

    user: userReducer,

    datasets: datasetsReducer,
    dataset: datasetReducer,
    datasetImporting: datasetImportingReducer,
    datasetSummary: datasetSummaryReducer,
    datasetAlertCount: datasetAlertCountReducer,

    advisorsPaginated: advisorsPaginatedReducer,
    advisors: advisorsReducer,
    advisor: advisorReducer,
    advisorOptions: advisorOptionsReducer,

    brokers: brokersReducer,
    broker: brokerReducer,
    brokerOptions: brokerOptionsReducer,

    contracts: contractsReducer,
    contract: contractReducer,
    contractOptions: contractOptionsReducer,

    managers: managersReducer,
    manager: managerReducer,
    managerOptions: managerOptionsReducer,

    plansPaginated: paginatedPlansReducer,
    plans: plansReducer,
    plan: planReducer,

    breadcrumbs: breadcrumbReducer,
    enums: enumsReducer,
    attachments: attachmentsReducer,
    appSession: appSessionReducer,

    confirmationDialog: confirmationDialogReducer,
    sessionDialog: sessionDialogReducer
  });
