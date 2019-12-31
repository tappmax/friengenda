import { applyMiddleware, compose, createStore, Store } from "redux";
import reduxThunk from "redux-thunk";
import { createRootReducer, ReduxState } from "./orchestrator";
import { routerMiddleware } from "connected-react-router";

const logger = (store : any) => (next : any) => (action : any) => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
}

const useLogging = false;

export const configureStore = (history: any, initialState?: ReduxState) => {
  const middleware = [reduxThunk, routerMiddleware(history)]

  if(useLogging) 
    middleware.push(logger);

  const store: Store<ReduxState> = createStore(
    createRootReducer(history),
    initialState!,
    compose(applyMiddleware(...middleware))
  );

  return store;
};
