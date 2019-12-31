import React, { useEffect } from "react";
import { variables } from "styles/common.styles";
import {
  AppBar,
  IconButton,
  Toolbar,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  withStyles
} from "@material-ui/core";
import Lock from "@material-ui/icons/Lock";
import LockOpen from "@material-ui/icons/LockOpen";
import { AppConstants } from "constants/app.constants";
import { UserMenu } from "./user-menu.component";
import { ReduxState } from "redux/orchestrator";
import { useSelector, useDispatch } from "react-redux";
import { RouterState } from "connected-react-router";
import { Dataset } from "models/dataset.models";
import { getDatasets, setCurrentDataset, updateDatasetProcessedAt } from "actions/dataset.actions";
import moment from "moment";
import { getEnums } from "actions/common.actions";
import { CommonState, AppUser } from "models";

const styles = {
  root: {
    display: "flex"
  },
  toolbar: {
    minHeight: variables.dimensions.topHeight,
    backgroundColor: variables.brandColors.frenDkBlue,
    alignItems: "flex-start",
    paddingTop: "1rem",
    paddingBottom: "2rem",
    paddingLeft: variables.dimensions.drawerWidth,
    marginLeft: '1rem',
  },
  viewingFormControl: {
    minWidth: '10rem', 
    margin:'0 1rem'
  },
  lockIconContainer : {
    marginTop:'1.2rem'
  }
} as const;

type ToolbarProps = {
  classes: {[key in (keyof typeof styles)] : any};
}

export const FrenToolbar = withStyles(styles)((props: ToolbarProps) => {
  const dispatch = useDispatch();

  // State hooks
  const { data: user } = useSelector<ReduxState,CommonState<AppUser>>(state => state.user);
  const router = useSelector<ReduxState,RouterState<any>>(state => state.router);
  const dataset = useSelector<ReduxState,Dataset>(state => state.dataset);
  const { data: datasets, loading: datasetsLoading } = useSelector<ReduxState,CommonState<Dataset[]>>(state => state.datasets);
  // const alertCount = useSelector<ReduxState,number>(state => state.datasetAlertCount);

  const handleDatasetChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(setCurrentDataset(e.target.value as string))
  };

  // Update the datasets 
  useEffect(() => {
    if(user.authorized) {
      dispatch(getDatasets());
      dispatch(getEnums());
    }
  }, [dispatch, user.authorized])

  useEffect(() => {
    const timer = (dataset.locked && !dataset.processedAt) ? setTimeout(() => {dispatch(updateDatasetProcessedAt())}, 5000) : undefined;
    return () => {
      if(timer)
        clearTimeout(timer);
    }    
  }, [dispatch, dataset.locked, dataset.processedAt]);


  if(!user.authorized)
    return (<></>);

  const isEditing = router.location.pathname.match(/^.*\/(edit|create)$/)!==null;

  return router.location.pathname === AppConstants.routes.login ? null : (
    <div className={props.classes.root}>
      <AppBar position="static" elevation={0}>
        <Toolbar className={props.classes.toolbar}>
          <FormControl className={props.classes.viewingFormControl}>
            <InputLabel style={{ color: variables.alphaColors.white50 }}>
              Viewing
            </InputLabel>
            <Select
              disabled={isEditing}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={(datasetsLoading || !dataset) ? 'loading' : dataset.month}
              style={{ color: isEditing ? variables.solidColors.ltGray : variables.solidColors.white }}
              onChange={handleDatasetChange}
            >              
              {datasetsLoading && (<MenuItem value='loading'><span style={{fontStyle:'italic'}}>Loading</span></MenuItem>)}
              {datasets && datasets.length > 0 && datasets.map((dataset, i) => (
                <MenuItem key={`dataset-${dataset.id}`} value={dataset.month}>{moment(dataset.month,'YYYY-MM').format('MMMM YYYY')}</MenuItem>
              ))}              
            </Select>
          </FormControl>
          <div className={props.classes.lockIconContainer}>
            {(dataset && dataset.locked === false) ? <LockOpen style={{color: isEditing ? variables.solidColors.ltGray : variables.solidColors.white}}/> : <Lock style={{color:'#999'}}/>}
          </div>
          <div style={{ flexGrow: 1 }} />
          <IconButton
            aria-label="display more actions"
            edge="end"
            color="inherit"
          >
            {/* <Badge badgeContent={alertCount} color="primary">
              <ReportProblemOutlinedIcon />
            </Badge> */}
            {/* TODO: some kind of badge */}
          </IconButton>
          <UserMenu username={`${user.firstName} ${user.lastName}`}/>
        </Toolbar>
      </AppBar>
    </div>
  );
})
