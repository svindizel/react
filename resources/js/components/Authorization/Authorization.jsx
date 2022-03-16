import React, {Component} from "react";
import S from "./Authorization.module.css";
import {Link} from "react-router-dom";
import axios from "axios";

export default class Authorization extends Component {

    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
        this.state = {
            signInData: {
                _token: window.token,
                email: "",
                password: "",
            },
            errors: {
                isEmailEmpty: false,
                isPasswordEmpty: false,
                isEmailIncorrect: false,
                isPasswordIncorrect: false
            }
        };
        window.state = this.state
    };

    console = () => {
        console.log("fjdsfsklfjs")
    }
    onChangeHandler = (e) => {
        const {signInData} = this.state;
        signInData[e.target.name] = e.target.value;
        this.setState({signInData});
    };
    clearErrors = (state) => {
        state.errors.isEmailEmpty = false;
        state.errors.isPasswordEmpty = false;
        state.errors.isEmailIncorrect = false;
        state.errors.isPasswordIncorrect = false;
        this.setState(state);
    }
    validateData = () => {
        let state = this.state;
        this.clearErrors(state);
        let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (state.signInData.email !== "" && state.signInData.password !== "") {
            if (!state.signInData.email.match(emailFormat) || state.signInData.password.length < 8) {
                if (!state.signInData.email.match(emailFormat)) {
                    state.errors.isEmailIncorrect = true;
                }
                if (state.signInData.password.length < 8) {
                    state.errors.isPasswordIncorrect = true;
                }
                this.setState(state);
                return false
            } else {
                return true
            }
        } else {
            if (state.signInData.email === "") {
                state.errors.isEmailEmpty = true;
            }
            if (state.signInData.password === "") {
                state.errors.isPasswordEmpty = true;
            }
            this.setState(state);
            return false
        }
    }

    componentDidMount = () => {
        axios
            .get("http://react/api/products")
            .then((response) => {
                if(response.data.auth) {
                    window.location = "http://react/products"
                }
            })
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.validateData();
        console.log(this.state.errors);
        if (this.validateData) {
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
        }
    };

    render() {
        console.log(localStorage.loggedIn)
        let isEmailIncorrect = this.state.errors.isEmailIncorrect;
        let isEmailEmpty = this.state.errors.isEmailEmpty;
        let isPasswordIncorrect = this.state.errors.isPasswordIncorrect;
        let isPasswordEmpty = this.state.errors.isPasswordEmpty;
        return (
            <div className={S.container}>
                <img src={this.props.assetPath + "/lazyloadtest.jpg"} alt=""/>
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
                                    <label
                                        className={`${isEmailIncorrect || isEmailEmpty ? S.errorLabel : S.label}`}
                                        htmlFor="email">Email
                                    </label>
                                    <input
                                        className={`${isEmailIncorrect || isEmailEmpty ? S.error : null}`}
                                        id="email"
                                        type="text"
                                        name="email"
                                        onChange={this.onChangeHandler}
                                    />
                                    {this.state.errors.isEmailEmpty ?
                                        <div className={S.errorText}>Заполните это поле</div> : null}
                                    {this.state.errors.isEmailIncorrect ?
                                        <div className={S.errorText}>Введите корректный Email</div> : null}
                                </div>
                                <div className={S.input}>
                                    <label
                                        className={this.state.errors.isPasswordEmpty || this.state.errors.isPasswordIncorrect ? S.errorLabel : S.label}
                                        htmlFor="password">Пароль
                                    </label>
                                    <input
                                        className={this.state.errors.isPasswordEmpty || this.state.errors.isPasswordIncorrect ? S.error : null}
                                        id="password"
                                        type="password"
                                        name="password"
                                        onChange={this.onChangeHandler}
                                    />
                                    {this.state.errors.isPasswordEmpty ?
                                        <div className={S.errorText}>Заполните это поле</div> : null}
                                    {this.state.errors.isPasswordIncorrect ?
                                        <div className={S.errorText}>Пароль должен быть длиннее 8 символов</div> : null}
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
            </div>
        )
    }
};
