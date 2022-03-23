import React, {Component} from "react";
import S from "./Header.module.css";
import HeaderItem from "./HeaderItem/HeaderItem";

export default class Header extends Component {
    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
        this.state = {
            navigationItems: [
                {id: 1, item: "Заказы", path: "/orders"},
                {id: 2, item: "Товары", path: "/products"}
            ]
        }

    };

    onLogOut = (e) => {
        axios
            .post("http://react/api/logout")
            .then((response) => {
                console.log(response);
                localStorage.setItem("loggedIn", "false")
                window.location = "http://react/login";
            })
    }

    renderHeaderItems = () => {
        let navigation = this.state.navigationItems;
        return navigation.map(navigationItem =>
            <HeaderItem
                key={navigationItem.id}
                item={navigationItem.item}
                path={navigationItem.path}
            />
        )
    }

    render() {
        return (
            <div className={S.header}>
                <div className={S.navigation}>
                    {this.renderHeaderItems()}
                </div>
                <div className={S.button} onClick={this.onLogOut}>Log Out</div>
            </div>
        )
    }
}
