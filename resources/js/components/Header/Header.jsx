import React, {Component} from "react";
import S from "./Header.module.css";

export default class Header extends Component {
    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
    };

    onClickHandler = (e) => {
        axios
            .post("http://react/api/logout")
            .then((response) => {
                console.log(response);
                if (response.status === 204 || response.status === 200) {
                    window.location = "http://react/";
                }
            })
    }

    render() {
        return (
            <div className={S.header}>
                <div>Заказы</div>
                <div>Товары</div>
                <div className={S.button} onClick={this.onClickHandler}>Log Out</div>
            </div>
        )
    }
}
