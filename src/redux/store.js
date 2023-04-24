import { applyMiddleware, compose, createStore } from "redux";
import reducer from "./reducers/index.js";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

let finalCreateStore = compose(applyMiddleware(thunk, createLogger()))(
  createStore
);

export function configureStore(initialState) {
  return finalCreateStore(reducer, initialState);
}
