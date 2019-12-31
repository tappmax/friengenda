import React from "react";
import { NavLink, Section } from "models/nav.models";
import { AppConstants } from "constants/app.constants";
import { ManagerConstants } from "constants/manager.constants";
import { ContractConstants } from "constants/contract.constants";
import { PlanConstants } from "constants/plan.constants";
import { BrokerConstants } from "constants/broker.constants";
import { AdvisorConstants } from "constants/advisor.constants";
import { ReportConstants } from "constants/report.constants";

import DashboardIcon from "@material-ui/icons/Dashboard";
import LanguageIcon from "@material-ui/icons/Language";
import DescriptionIcon from "@material-ui/icons/Description";
import TocIcon from "@material-ui/icons/Toc";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import PeopleIcon from "@material-ui/icons/People";
import AssessmentIcon from "@material-ui/icons/Assessment";
import SettingsIcon from "@material-ui/icons/Settings";
import PublishIcon from "@material-ui/icons/Publish";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export const featureLinks: NavLink[] = [
    {
      text: AppConstants.pageTitles.base,
      path: AppConstants.routes.base,
      icon: <DashboardIcon />,
      enabled: true
    },
    {
      text: ManagerConstants.pageTitles.list,
      path: ManagerConstants.routes.list,
      icon: <LanguageIcon />,
      enabled: true
    },
    {
      text: ContractConstants.pageTitles.list,
      path: ContractConstants.routes.list,
      icon: <DescriptionIcon />,
      enabled: true
    },
    {
      text: PlanConstants.pageTitles.list,
      path: PlanConstants.routes.list,
      icon: <TocIcon />,
      enabled: true
    },
    {
      text: BrokerConstants.pageTitles.list,
      path: BrokerConstants.routes.list,
      icon: <DeviceHubIcon />,
      enabled: true,
      alert: 'broker'
    },
    {
      text: AdvisorConstants.pageTitles.list,
      path: AdvisorConstants.routes.list,
      icon: <PeopleIcon />,
      enabled: true,
      alert: 'advisor'
    },
    {
      text: ReportConstants.pageTitles.list,
      path: ReportConstants.routes.list,
      icon: <AssessmentIcon />,
      enabled: true
    }
  ];
  
  export const siteLinks: NavLink[] = [
    { text: "Settings", path: "/settings", icon: <SettingsIcon />, enabled: false },
    { text: "Upload", path: "/upload", icon: <PublishIcon />, enabled: true }
  ];
  
  export const accountLinks: NavLink[] = [
    { text: "Logout", path: AppConstants.routes.login, icon: <ExitToAppIcon />, enabled: true }
  ];
  
  export const sections: Section[] = [
    { name: "features", links: featureLinks, enabled: true, nav: "side" },
    { name: "settings", links: siteLinks, enabled: false, nav: "side" },
    { name: "account", links: accountLinks, enabled: true, nav: "top" }
  ];