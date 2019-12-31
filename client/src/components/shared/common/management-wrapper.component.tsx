import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAppSessionEditing } from "actions/common.actions";
export interface ManagementWrapperProps extends ManagementProps {
  component: any;
}
export interface ManagementProps {
  type: "edit" | "create";
  [key: string]: any;
}
export function withManageEntity(Component: any, type: "edit" | "create") {
  return function(props: any) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(setAppSessionEditing(true));
      return () => {
        dispatch(setAppSessionEditing());
      };
    }, [dispatch]);
    return <Component {...{ ...props, type }} />;
  };
}

export function asAddEntity(Component: any) {
  return withManageEntity(Component, "create");
}

export function asEditEntity(Component: any) {
  return withManageEntity(Component, "edit");
}
