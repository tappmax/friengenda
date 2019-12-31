
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { ReduxState } from "redux/orchestrator";
import { CircularProgress, TableBody, TableCell } from "@material-ui/core";
import { OverviewConstants } from "constants/overview.constants";
import { updateBreadcrumbs, httpGetFile } from "actions/common.actions";
import { NavLink } from "models/nav.models";
import { importDataset, getDatasetSummary, getDatasetAttachments, lockDataset } from "actions/dataset.actions";
import { CommonState, Dataset, DatasetSummary, Advisor, Attachment } from "models";
import { FrenTitle, FrenTableTitle } from "components/shared/titles";
import { FrenTwoColumnDetails } from "components/shared/details/two-column-details.component";
import { FrenUploadButton } from "components/shared/buttons/upload-button.component";
import { FrenLockButton } from "components/shared/buttons/lock-button.component";
import { formatCurrency, replacePathParams } from "helpers/formatting.helpers";
import { FrenDownloadButton } from "components/shared/buttons";
import { getAdvisorsWithAlerts } from "actions/advisor.actions";
import { FrenErrorPanel } from "components/shared/common";
import { FrenTable, FrenOrderableThead, HeadCell, FrenOrderableTheadProps, FrenTableLedgerRow, FrenTableCell } from "components/shared/tables";
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import { FrenTableLoader } from "components/shared/common/table-loader.component";
import { variables } from "styles/common.styles";
import { AdvisorConstants } from "constants/advisor.constants";
import { useConfirmationDialog, openConfirmationDialog } from "actions/dialog.action";

export const getUploadHistory : () => NavLink[] = () => [
  {
    text: OverviewConstants.pageTitles.summary,
    path: OverviewConstants.routes.summary
  } as NavLink
];

export const OverviewSummary = () => {
  const dispatch = useDispatch();
  const dataset = useSelector<ReduxState,Dataset>(state => state.dataset);
  const datasets = useSelector<ReduxState,CommonState<Dataset[]>>(state => state.datasets);
  const attachments = useSelector<ReduxState,CommonState<Attachment[]>>(state => state.attachments);
  const datasetImporting = useSelector<ReduxState,boolean>(state => state.datasetImporting);
  const summary = useSelector<ReduxState,CommonState<DatasetSummary>>(state => state.datasetSummary);
  const importFile = useRef(null)

  const [advisorsWithAlerts, setAdvisorsWithAlerts] = useState<CommonState<Advisor[]>>({error:'', loading: false, data: []});

  useEffect(() => {
    dispatch(updateBreadcrumbs(getUploadHistory()))    
  }, [dispatch]);

  useEffect(() => {
    if(dataset.month !== '') {
      dispatch(getDatasetSummary(dataset.month))
      dispatch(getDatasetAttachments());
      dispatch(getAdvisorsWithAlerts(setAdvisorsWithAlerts));      
    }
  }, [dispatch,dataset]);

  const handleFileLoaded = (e : any) => {    
    dispatch(importDataset(e.currentTarget.result));
    (importFile.current as any).value = "";
  }

  const handleImportDatasetFile = (e: any) => {
    if(!e.target || !e.target.files || e.target.files.length <=0 )
      return;

    const fileReader = new FileReader();
    fileReader.onloadend = handleFileLoaded;
    fileReader.readAsArrayBuffer(e.target.files[0]);    
  }

  const handleImportDataset = () => {
    if(!importFile)
      return;

    const current = importFile.current as any;
    if(!current)
      return;

    current.click()    
  }

  const handleClickAdvisor = (id: number) => {
    dispatch(push(replacePathParams(AdvisorConstants.routes.detail, {advisorId: id}))); 
  };

  const handleLockDataset = () => {
    dispatch(openConfirmationDialog({
      icon: "warning",
      title: 'Lock current data set?',
      message: (<>
        {'Are you sure you want to lock the current data set?  Locking the current data set is final and can not be reversed.'}         
        </>
      ),
      key: OverviewConstants.dialogKeys.lockDataset
    }))
  };

  useConfirmationDialog(OverviewConstants.dialogKeys.lockDataset, () => {
    dispatch(lockDataset());
  }, [dispatch])

  const hasCheckStatements = attachments.data.length > 0 && attachments.data.find(v => v.type === 'CheckStatements') !== undefined;

  return (
    <>      
      <FrenTitle title={dataset.month==='' ? 'Loading...' : moment(dataset.month,'YYYY-MM').format('MMMM YYYY')} includeBreak={true}>
        {!dataset.locked && (<FrenLockButton disabled={!dataset || dataset.locked || !dataset.import || dataset.import.failed===true} clickHandler={handleLockDataset} style={{padding:0}}>Lock</FrenLockButton>)}
      </FrenTitle>
      {(advisorsWithAlerts.data.length > 0 || (!dataset.import || dataset.import.count===0) || (dataset.import && dataset.import.failed)) && (
        <FrenErrorPanel 
          allowClose={false}
          style={{marginBottom:'2rem'}}
          error={(
          <ul style={{padding:0, margin:0}}>
            {advisorsWithAlerts.data.length > 0 && !dataset.locked && (<li>One or more advisors are missing documentation and will receive no payment for this month</li>)}            
            {advisorsWithAlerts.data.length > 0 && dataset.locked && (<li>One or more advisors were missing documentation and did receive no payment for this month</li>)}
            {(!dataset.import || dataset.import.count===0) && (<li>Assets totals must be uploaded before month can be locked</li>)}
            {(dataset.import && dataset.import.failed) && (<li>Upload errors must be resolved before month can be locked</li>)}
          </ul>
          )}
        />)}      
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
        ...(dataset&&dataset.locked) ? [
          {name: 'Processed At', value: dataset.processedAt ? moment(dataset.processedAt).format("LLL") : 'Processing...'}
        ] : [],
      ]}/>
      )}

      {(!dataset || !dataset.locked) && (
        <>
          <FrenTitle title="Upload" includeBreak={true}>
            <FrenUploadButton disabled={datasetImporting || dataset.locked} clickHandler={handleImportDataset} style={{padding:0}}>
              Upload
              <input id="overview-import-file" type="file" ref={importFile} style={{ display: 'none' }} onChange={handleImportDatasetFile}/>
            </FrenUploadButton>
          </FrenTitle>
          {!datasets.loading && !datasetImporting && dataset && dataset.import && (
            <>
              <FrenTwoColumnDetails leftWidth={200} model={[
                {name: 'Uploaded By', value: dataset.import.importedBy.firstName + " " + dataset.import.importedBy.lastName},
                {name: 'Uploaded At', value: moment(dataset.import.importedAt).format("LLL")},
                {name: 'Plans Uploaded', value: (dataset.import.count || 0).toString()}
              ]}/>        
              {dataset.import.errors && dataset.import.errors.length > 0 && (
                <FrenTwoColumnDetails leftWidth={200} 
                  model={
                  dataset.import.errors.map((v,i) => ({
                    name: i===0?'Plans Failed':' ',
                    value: (<span style={{color:'#FF0000'}}>{v}</span>)
                }))}/>
              )}
            </>
          )}
          {!datasets.loading && !datasetImporting && dataset && !dataset.import && (
            <>             
              <div style={{display: 'flex', justifyContent: 'center', marginTop:'2rem'}}>
                <span style={{fontStyle:'italic'}}>No data uploaded</span>
              </div>            
            </>
          )}
          {(datasets.loading || datasetImporting) && (
            <>             
              <div style={{display: 'flex', justifyContent: 'center', marginTop:'2rem'}}>
                <CircularProgress size={80}/>
              </div>            
            </>
          )}
        </>
      )}
      
      {!datasets.loading && dataset.locked && (
          <>
            <FrenTitle title={"Reports"} includeBreak={true}/>            
            <FrenTwoColumnDetails leftWidth={200} model={[
              { name: "ACH", value: (
                <FrenDownloadButton clickHandler={() => dispatch(httpGetFile({
                  url:`/reports/ach?from=${dataset.month}&to=${dataset.month}&format=xlsx`,
                  filename: `ACH Report ${dataset.month}.xlsx`
                }))}>
                  DOWNLOAD
                </FrenDownloadButton>
              )},
              { 
                name: "Check Statements", 
                value: (
                  <>
                    {dataset.locked && !dataset.processedAt && ('Processing...')}
                    {dataset.locked && dataset.processedAt && (<FrenDownloadButton disabled={!hasCheckStatements} clickHandler={() => dispatch(httpGetFile({
                      url:`/datasets/attachments/CheckStatements`,
                      filename: `Check Statements ${dataset.month}.pdf`
                    }))}>
                      DOWNLOAD
                    </FrenDownloadButton>)}
                  </>
                )}
            ]}/>
          </>
        )}

        {advisorsWithAlerts.data.length > 0 && (
          <>
            <FrenTableTitle title="No Payment" style={{marginTop:'2em'}}/>      
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
                <FrenTableLoader loading={advisorsWithAlerts.loading} useStale={false} colSpan={3}>
                  { advisorsWithAlerts.data &&
                    advisorsWithAlerts.data.length > 0 &&
                    advisorsWithAlerts.data.map((advisor: Advisor) => (
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
        )}              
    </>
  )
}