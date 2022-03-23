import React, {Component} from "react";
import S from "./Orders.module.css";
import Header from "../Header/Header";

export default class Orders extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
                <Header />
                <div className={S.orders}>

                </div>
            </div>
        )
    }
}
