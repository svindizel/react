import React, {Component} from "react";
import S from "./Authorization.module.css";
import {Link} from "react-router-dom";

export default class Authorization extends Component {

    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
        this.state = {
            signInData: {
                _token: window.token,
                email: "",
                password: "",
            }
        };
    };

    onChangeHandler = (e) => {
        const {signInData} = this.state;
        signInData[e.target.name] = e.target.value;
        this.setState({signInData});
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.setState({isLoading: true});
        axios
            .post("http://react/api/login", this.state.signInData)
            .then((response) => {
                console.log(response)
                if (response.status === 204 || response.status === 200) {
                    window.location = "http://react/products";
                    this.setState({
                        email: "",
                        password: "",
                    })
                }
            })
    };

    render() {
        console.log(this.props)
        return (
            <div className={S.authorization}>
                <div className={S.authorizationForm}>
                    <div className={S.formHeader}>
                        <div className={S.headerText}>
                            Авторизация
                        </div>
                    </div>
                    <div className={S.formBody}>
                        <form method="POST" onSubmit={this.onSubmitHandler}>

                            <div className={S.input}>
                                <label className={S.label} htmlFor="email">Email
                                </label>
                                <input
                                    required
                                    id="email"
                                    type="text"
                                    name="email"
                                    onChange={this.onChangeHandler}
                                />
                            </div>
                            <div className={S.input}>
                                <label className={S.label} htmlFor="password">Пароль
                                </label>
                                <input
                                    required
                                    id="password"
                                    type="password"
                                    name="password"
                                    onChange={this.onChangeHandler}
                                />
                            </div>
                            <button className={S.button} type="submit">Войти в систему</button>
                        </form>
                        <div className={S.registrySuggest}>
                            <div className="text">
                                Еще не зарегистрированы?&nbsp;
                            </div>
                            <Link to='/verify'>Регистрация</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
