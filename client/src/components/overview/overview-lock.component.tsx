import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { ReduxState } from "redux/orchestrator";
import { CircularProgress, TableBody, TableCell } from "@material-ui/core";
import { OverviewConstants } from "constants/overview.constants";
import { updateBreadcrumbs } from "actions/common.actions";
import { NavLink } from "models/nav.models";
import { lockDataset, getDatasetSummary } from "actions/dataset.actions";
import { CommonState, Dataset, DatasetSummary, Advisor } from "models";
import { FrenTitle, FrenTableTitle } from "components/shared/titles";
import { FrenTwoColumnDetails } from "components/shared/details/two-column-details.component";
import moment from "moment";
import { FrenLockButton } from "components/shared/buttons/lock-button.component";
import { formatCurrency, replacePathParams } from "helpers/formatting.helpers";
import { openConfirmationDialog, useConfirmationDialog } from "actions/dialog.action";
import { FrenTable } from "components/shared/tables/table.component";
import { FrenOrderableThead, HeadCell, FrenOrderableTheadProps, FrenTableLedgerRow, FrenTableCell } from "components/shared/tables";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { FrenTableLoader } from "components/shared/common/table-loader.component";
import { variables } from "styles/common.styles";
import { AdvisorConstants } from "constants/advisor.constants";
import { FrenErrorPanel } from "components/shared/common";

export const getUploadHistory : () => NavLink[] = () => [
  {
    text: OverviewConstants.pageTitles.summary,
    path: OverviewConstants.routes.summary
  } as NavLink,
  {
    text: OverviewConstants.pageTitles.lock,
    path: OverviewConstants.routes.lock
  } as NavLink
];

export const OverviewLock = () => {
  const dispatch = useDispatch();
  const dataset = useSelector<ReduxState,Dataset>(state => state.dataset);
  const datasets = useSelector<ReduxState,CommonState<Dataset[]>>(state => state.datasets);
  const summary = useSelector<ReduxState,CommonState<DatasetSummary>>(state => state.datasetSummary);
  const advisors = useSelector<ReduxState,CommonState<Advisor[]>>(state => state.advisors);

  const handleLockDataset = () => {
    dispatch(openConfirmationDialog({
      icon: "warning",
      title: 'Lock current data set?',
      message: (<>
        {advisors.data.length > 0 && (<FrenErrorPanel allowClose={false} style={{marginBottom:'2rem'}} error={'One or more advisors is missing documentation and payment will be held for this month.'}/>)}
        {'Are you sure you want to lock the current data set?  Locking the current data set is final and can not be reversed.'}         
        </>
      ),
      key: OverviewConstants.dialogKeys.lockDataset
    }))
  };

  useEffect(() => {
    dispatch(updateBreadcrumbs(getUploadHistory()))
  }, [dispatch]);

  useEffect(() => {
    if(dataset.month !== '')
      dispatch(getDatasetSummary(dataset.month))
  }, [dispatch,dataset]);

  useConfirmationDialog(OverviewConstants.dialogKeys.lockDataset, () => {
    dispatch(lockDataset());
  }, [dispatch])
 
  const handleClickAdvisor = (id: number) => {
    dispatch(push(replacePathParams(AdvisorConstants.routes.detail, {advisorId: id}))); 
  };

  return (
    <>
      <FrenTitle title={dataset.month==='' ? 'Loading...' : moment(dataset.month,'YYYY-MM').format('MMMM YYYY')} includeBreak={true}>
        <FrenLockButton disabled={dataset.locked || summary.loading || summary.data.assets === 0} clickHandler={handleLockDataset} style={{padding:0}}>Lock</FrenLockButton>
      </FrenTitle>
      {!summary.loading && summary.data.assets === 0 && (<FrenErrorPanel style={{marginBottom:"2rem"}} error={"No asset totals have been uploaded for the month"} allowClose={false}/>)}
      {(datasets.loading || summary.loading) && (
          <>             
          <div style={{display: 'flex', justifyContent: 'center', marginTop:'2rem'}}>
            <CircularProgress size={80}/>
          </div>            
        </>        
      )}
      {!datasets.loading && !summary.loading && (
      <FrenTwoColumnDetails leftWidth={200} model={[
        {name: 'Total Assets', value: `$ ${formatCurrency(summary.data.assets,false)}`},
        {name: 'Total Commissions', value: `$ ${formatCurrency(summary.data.commissions, false)}`},
        ...(dataset&&dataset.locked&&dataset.lockedBy&&dataset.lockedAt) ? [
          {name: 'Locked By', value: dataset.lockedBy.firstName + " " + dataset.lockedBy.lastName},
          {name: 'Locked At', value: moment(dataset.lockedAt).format("LLL")}
        ] : [],
      ]}/>
      )}

      <FrenTableTitle title="Alerts" style={{marginTop:'2em'}}/>      
      <FrenTable size="small">
        <FrenOrderableThead
              {...({
                headCells: [
                  {
                    disablePadding: false,
                    id: "hasAlerts",
                    isNumeric: false,
                    label: (<ReportProblemIcon style={{padding:0, margin:0, fontSize:16}}/>),
                    width: "1rem"
                  } as HeadCell<Advisor>,
                  {
                    disablePadding: false,
                    id: "name",
                    isNumeric: false,
                    label: "Name",
                    width: "65%"
                  } as HeadCell<Advisor>,
                  {
                    disablePadding: false,
                    id: "paymentType",
                    isNumeric: false,
                    label: "Payment",
                  } as HeadCell<Advisor>,
                  {
                    disablePadding: false,
                    id: "commissions",
                    isNumeric: true,
                    label: "Commissions",
                  } as HeadCell<Advisor>
                ]
              } as FrenOrderableTheadProps<Advisor>)}
            />
            <TableBody>
              <FrenTableLoader loading={advisors.loading} useStale={false} colSpan={3}>
                { advisors.data &&
                  advisors.data.length > 0 &&
                  advisors.data.map((advisor: Advisor) => (
                    <FrenTableLedgerRow
                      style={{height: variables.dimensions.listRowHeight}}
                      key={"advisor_" + advisor.id}
                      onClick={() => handleClickAdvisor(advisor.id)}
                    >
                      <TableCell style={{borderBottom: 0}}>
                        {advisor.hasAlerts && (<ReportProblemIcon style={{padding:0, margin:0, fontSize:16, color:"#cf921c"}}/>)}                        
                      </TableCell>
                      <FrenTableCell data={advisor.name} />
                      <FrenTableCell data={advisor.paymentType} />
                      <FrenTableCell data={advisor.commissions} isMoney={true} style={{ width: "8rem" }}/>
                    </FrenTableLedgerRow>
                  ))}
              </FrenTableLoader>
            </TableBody>          
      </FrenTable>      
    </>
  )
}