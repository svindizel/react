import React, {Component} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "./reset.css";
import "./App.css";
import Authorization from "./Authorization/Authorization";
import EmailConfirm from "./EmailConfirm/EmailConfirm";
import Registration from "./Registration/Registration";
import Products from "./Products/Products";
import Orders from "./Orders/Orders";
import store from "./store";
import {Provider, useDispatch} from "react-redux";
import ProductsContainer from "./Products/ProductsContainer";
import getProducts from "./reducers/productsReducer";
import TestComponent from "./TestComponent";

export default function App(props) {
        return (
            <BrowserRouter>
                <TestComponent/>
                <Routes>
                    <Route
                        path="/login"
                        element={<Authorization assetPath={props.assetPath}/>}
                    />
                    <Route
                        exact path="/"
                        element={<Navigate replace to="/login"/>}
                    />
                    <Route
                        path="/verify"
                        element={<EmailConfirm/>}
                    />
                    <Route
                        exact path="/registration/*"
                        element={<Registration/>}
                    />
                    <Route
                        path="/products"
                        element={<Products/>}
                    />
                    <Route
                        path="/orders"
                        element={<Orders/>}
                    />
                </Routes>

            </BrowserRouter>
        );
}

if (document.getElementById('root')) {
    if (!localStorage.getItem('loggedIn')) {
        localStorage.setItem("loggedIn", "false")
    }
    const assetPath = document.getElementById("root").getAttribute("assetPath");
    ReactDOM.render(
        <Provider store={store}>
            <App assetPath={assetPath}/>
        </Provider>,
        document.getElementById('root')
    );
}
