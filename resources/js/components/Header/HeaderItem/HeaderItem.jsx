import React, {Component} from "react";
import S from "../Header.module.css";
import {NavLink} from "react-router-dom";

export default class HeaderItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NavLink to={this.props.path} className={(active) => active.isActive ? S.active : S.navigationItem}>
                <div>
                    {this.props.item}
                </div>
            </NavLink>
        )
    }
}
