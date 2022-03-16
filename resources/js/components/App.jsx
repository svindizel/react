import React, {Component} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "./reset.css";
import "./App.css";
import Authorization from "./Authorization/Authorization";
import EmailConfirm from "./EmailConfirm/EmailConfirm";
import Registration from "./Registration/Registration";
import Products from "./Products/Products";

export default class App extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.assetPath)
    };

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/login"
                        element={<Authorization assetPath={this.props.assetPath}/>}
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
}

if (document.getElementById('root')) {
    if(!localStorage.getItem('loggedIn')) {
        localStorage.setItem("loggedIn", "false")
    }
    const assetPath = document.getElementById("root").getAttribute("assetPath");
    ReactDOM.render(<App assetPath={assetPath}/>,
        document.getElementById('root'));
}
