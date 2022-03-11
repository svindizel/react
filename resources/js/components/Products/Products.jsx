import React, {Component} from "react";
import S from "./Products.module.css";
import Header from "../Header/Header";

export default class Products extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (
            <div className={S.products}>
                <Header />

            </div>
        )
    }
}
