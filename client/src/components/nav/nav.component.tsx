import React, { useEffect } from "react";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { variables } from "styles/common.styles";
import { NavLink, Section } from "models/nav.models";
import { RouterState, push } from "connected-react-router";
import { AppConstants } from "constants/app.constants";
import { sections } from "data/navigation.data";
import * as logo from "assets/logo-fren-portal.png";
import { withStyles } from "@material-ui/styles";
import { useSelector, useDispatch } from "react-redux";
import { ReduxState } from "redux/orchestrator";
import ReportProblem from '@material-ui/icons/ReportProblem';
import { DatasetAlertCount, Dataset, Broker, Advisor, CommonState } from "models";
import { getDatasetAlertCount } from "actions/dataset.actions";

// const StyledBadge = withStyles(theme => ({
//   badge: {
//     top: 2,
//     fontSize: 10,
//     backgroundColor: variables.brandColors.frenLtBlue
//   },
//   badgeActive: {
//     top: 2,
//     fontSize: 10,
//     backgroundColor: '#F00',
//     color: '#FFF'
//   },

// })) (({active, badgeContent, children, classes, style} : {active:boolean, badgeContent: any, children:any, classes: any, style:any}) => {  
//   return (<Badge style={style} classes={{badge:active ? classes.badgeActive : classes.badge}} badgeContent={badgeContent}>{children}</Badge>)
// })


const styles = {
  root: {
    display: "flex"
  },
  drawer: {
    width: variables.dimensions.drawerWidth,
    flexShrink: 0,
    backgroundColor: variables.brandColors.frenBlue,
    color: variables.solidColors.white
  },
  drawerPaper: {
    width: variables.dimensions.drawerWidth,
    backgroundColor: variables.brandColors.frenBlue
  },
  sidebarToolbar: {
    minHeight: variables.dimensions.topHeight
  }
};

export interface NavComponentProps {
  classes: {[key in (keyof typeof styles)] : any};
}

export const Nav = withStyles(styles)((props: NavComponentProps) => {
  const router = useSelector<ReduxState,RouterState<any>>(state => state.router);
  const dispatch = useDispatch();
  const alertCounts = useSelector<ReduxState,DatasetAlertCount>(state => state.datasetAlertCount);
  const dataset = useSelector<ReduxState,Dataset>(state => state.dataset);  
  const broker = useSelector<ReduxState,CommonState<Broker>>(state => state.broker);  
  const advisor = useSelector<ReduxState,CommonState<Advisor>>(state => state.advisor);  

  useEffect(() => {
    if(!broker.loading && !advisor.loading)
      dispatch(getDatasetAlertCount());
  }, [dispatch, dataset, broker, advisor]);

  if (router.location.pathname === AppConstants.routes.login) 
    return null;

  const currentRoute = `/${router.location.pathname.split("/")[1]}`;
  return (
    <div className={props.classes.root}>
      <CssBaseline />
      <Drawer
        className={props.classes.drawer}
        variant="permanent"
        classes={{paper: props.classes.drawerPaper}}
        anchor="left"
      >
        <div className={props.classes.sidebarToolbar}>
          <img
            src={logo.default.toString()}
            alt="Fren portal logo"
            style={{
              padding: "1rem",
              width: 122,
              margin: "0 auto",
              display: "block"
            }}
          />
        </div>
        {sections.filter(s => s.enabled && s.nav === "side").map((section: Section) => {
          return (
            <React.Fragment key={section.name}>
              <Divider />
              <List>
                {section.links.filter(l => l.enabled).map((link: NavLink, index: number) => (
                  <span
                    key={link.path}
                    onClick={() => dispatch(push(link.path))}
                    style={{
                      color:
                        link.path === currentRoute
                          ? variables.brandColors.frenPrimary
                          : variables.solidColors.white,
                      textDecoration: "none"
                    }}
                  >
                    <ListItem
                      button
                      key={link.text}
                      style={{
                        backgroundColor:
                          link.path === currentRoute
                            ? variables.brandColors.frenSecondaryMuted
                            : undefined,
                        borderBottom:
                          link.path === currentRoute
                            ? `2px ${variables.brandColors.frenPrimary} solid`
                            : undefined
                      }}
                    >                      
                      <ListItemIcon
                        style={{
                          color:
                            link.path === currentRoute
                              ? variables.brandColors.frenPrimary
                              : variables.solidColors.white
                        }}
                      >
                        {link.icon}
                      </ListItemIcon>                     
                      <ListItemText primary={(
                        <div style={{display:'flex'}}>
                          <div>{link.text}</div>                          
                          {link.alert && alertCounts[link.alert] > 0 &&  (
                            <>
                              <div style={{ flexGrow: 1, display:'inline' }} />
                              {/* <StyledBadge active={link.path === currentRoute} badgeContent={1} style={{top:2}}> */}
                                <ReportProblem fontSize="small" style={{padding:0, margin:0, display:'inline'}}/>
                              {/* </StyledBadge> */}
                            </>
                          )}
                        </div>
                      )} />
                    </ListItem>
                  </span>
                ))}
              </List>
            </React.Fragment>
          );
        })}
      </Drawer>
    </div>
  );
}
)
