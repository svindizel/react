import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "./reset.css";
import "./App.css";
import Authorization from "./Authorization/Authorization";
import EmailConfirm from "./EmailConfirm/EmailConfirm";
import Registration from "./Registration/Registration";
import Products from "./Products/Products";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Authorization/>}
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
            </Routes>
        </BrowserRouter>
    );
}

if (document.getElementById('root')) {
    if(!localStorage.getItem('loggedIn')) {
        localStorage.setItem("loggedIn", "false")
    }
    ReactDOM.render(<App/>,
        document.getElementById('root'));
}
