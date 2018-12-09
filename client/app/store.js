import { applyMiddleware, createStore } from "redux";
import { routerMiddleware } from 'react-router-redux';
import reducers from 'reducers';
import logger from "redux-logger";
import thunk from "redux-thunk";

export default function configureStore(history) {
  const middleWares = [thunk, routerMiddleware(history)];
  if (process.env.NODE_ENV !== `production`) {
    // middleWares.push(logger());
  }
  const middleware = applyMiddleware(...middleWares);

  return createStore(reducers, middleware);
}
