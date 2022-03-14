import React, {Component} from "react";
import S from "./Products.module.css";
import Header from "../Header/Header";
import axios from "axios";

export default class Products extends Component {
    constructor(props) {
        super(props);
    };

    componentDidMount = () => {
        axios
            .get("http://react/api/products")
            .then((response) => {
                if(!response.data.auth) {
                    window.location = "http://react/login"
                }
            })
    }

    render() {
        return (
            <div className={S.products}>
                <Header />

            </div>
        )
    }
}
