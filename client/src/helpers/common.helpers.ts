import { useState } from "react";

/**
 * Returns if CommonState<T>.data has changed from previously passed in props
 * @param current value of calling component's this.props.["common state object's key"]
 * @param previous value passed in by component update method's prevProps["common state object's key"].
 */
export const commonStateDataChanged = (current: any, previous: any) => {
  return current.data !== previous.data;
};

/**
 * Returns if CommonState<T>.error has changed from previously passed in props
 * @param current value of calling component's this.props.["common state object's key"]
 * @param previous value passed in by component update method's prevProps["common state object's key"].
 */
export const commonStateErrorChanged = (current: any, previous: any) => {
  return current.error !== previous.error;
};

export const listHasItems = (list: any) =>
  !!(list && list.length && list.length > 0);

export const useForceUpdate = () => {
  const [, setIt] = useState(false);
  return () => setIt(it => !it);
};

export const isEmptyObject = (obj: any) =>
  Object.entries(obj).length === 0 && obj.constructor === Object;

export const copy = (obj: any) => JSON.parse(JSON.stringify(obj));
export const removeEmptyProps = (obj: any) => {
  for (let prop in obj) {
    if (obj[prop] === "") obj[prop] = undefined;
  }
  return obj;
}