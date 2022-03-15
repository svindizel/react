import S from "./EmailConfirm.module.css";
import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';
import axios from "axios";

class FormBody extends Component {
    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
    }

    render() {

        if (this.props.isConfirmed === true) {
            return (
                <div className={S.formBody}>
                    На ваш email отправлено письмо с подтверждением регистрации. Пожалуйста, перейдите по ссылке в
                    письме для продолжения.
                </div>
            )
        } else if (this.props.incomplete === true) {
            return (
                <div className={S.formBody}>
                    На ваш email уже было отправлено письмо с подтверждением регистрации. Если вы хотите получить письмо повторно, нажмите на кнопку.
                    <div onClick={this.props.onClickHandler}>
                     Отправить снова
                    </div>
                </div>
                 
            )
        } else {
            return (
                <div className={S.formBody}>
                    <form method="POST" onSubmit={this.props.onSubmitHandler}>
                        <label className={this.props.errors.isEmailIncorrect || this.props.errors.isEmailEmpty || this.props.userExists ? S.errorLabel : S.label} htmlFor="email">Email</label>
                        <div className={S.input}>
                            <input
                                className={this.props.errors.isEmailEmpty || this.props.errors.isEmailIncorrect || this.props.userExists ? S.error : null}
                                onChange={this.props.onChangeHandler}
                                id="email"
                                type="text"
                                name="email"
                            />
                            <button className={S.button} type="submit">Продолжить &#8594;</button>
                        </div>
                        {this.props.errors.isEmailEmpty ?
                            <div className={S.errorText}>Заполните это поле</div> : null}
                        {this.props.errors.isEmailIncorrect ?
                            <div className={S.errorText}>Введите корректный Email</div> : null}
                        {this.props.userExists ?
                                        <div className={S.errorText}>Такой пользователь уже существует</div> : null}
                    </form>
                    <div className={S.registrySuggest}>
                        <div className="text">
                            Уже зарегистрированы?&nbsp;
                        </div>
                        <Link to="/">Войти в систему</Link>
                    </div>
                </div>
            )
        }
    }
}

FormBody.propTypes = {
    isConfirmed: PropTypes.bool.isRequired
}

export default class EmailConfirm extends Component {
    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
        this.state = {
            signUpData: {
                _token: window.token,
                email: "",
            },
            isConfirmed: false,
            incomplete: false,
            userExists: false,
            errors: {
                isEmailEmpty: false,
                isEmailIncorrect: false,
            }
        };
    };

    onClickHandler = (e) => {
        e.preventDefault();
        console.log(this.state.signUpData)
        let state = this.state;
        axios
            .post("http://react/api/register/verify/resend", this.state.signUpData)
            .then((response) => {
                if (response.data.original === "success") {
                    state.signUpData.email = "";
                    state.isConfirmed = true;
                    this.setState(state);
                }
            })
    }

    onChangeHandler = (e) => {
        console.log(this.state)
        const {signUpData} = this.state;
        signUpData[e.target.name] = e.target.value;
        this.setState({signUpData});
    };

    clearErrors = (state) => {
        state.errors.isEmailEmpty = false;
        state.errors.isEmailIncorrect = false;
        this.setState(state);
    };

    validateData = () => {
        let state = this.state;
        this.clearErrors(state);
        let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (state.signUpData.email !== "") {
            if (!state.signUpData.email.match(emailFormat)) {
                state.errors.isEmailIncorrect = true;
                this.setState(state);
                return false
            } else {
                return true
            }
        } else {
            state.errors.isEmailEmpty = true;
            this.setState(state);
            return false
        }
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        let state = this.state;
        if(this.validateData()) {
            axios
                .post("http://react/api/register", this.state.signUpData)
                .then((response) => {
                    if (response.data.original === "success") {
                        state.signUpData.email = "";
                        state.isConfirmed = true;
                        this.setState(state);
                    }
                    if(response.data.original === "incomplete") {
                        state.incomplete = true;
                        this.setState(state);
                    }
                    if(response.data.original === "User exists") {
                        state.signUpData.email = "";
                        state.userExists = true;
                        this.setState(state);
                    }
                })

        }

    };

    render() {
        if(this.state.isConfirmed === false) {

        }
        return (
            <div className={S.container}>
                <div className={S.registration}>
                    <div className={S.registrationForm}>
                        <div className={S.formHeader}>
                            <div className={S.headerText}>
                                Регистрация в системе
                            </div>
                        </div>
                        <FormBody
                            userExists={this.state.userExists}
                            onClickHandler={this.onClickHandler}
                            errors={this.state.errors}
                            isConfirmed={this.state.isConfirmed}
                            onChangeHandler={this.onChangeHandler}
                            onSubmitHandler={this.onSubmitHandler}
                            incomplete={this.state.incomplete}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
