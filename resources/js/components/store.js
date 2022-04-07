import {combineReducers, createStore, applyMiddleware} from "redux";
import modalReducer from "./reducers/modalReducer";
import productsReducer from "./reducers/productsReducer";
import categoriesReducer from "./reducers/categoriesReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

let reducers = combineReducers({
    modal: modalReducer,
    products: productsReducer,
    categories: categoriesReducer
});

let store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

export default store;
