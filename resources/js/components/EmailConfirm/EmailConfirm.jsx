import S from "./EmailConfirm.module.css";
import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

class FormBody extends Component {
    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
        this.state = {
            errors: {
                isEmailEmpty: false,
                isEmailIncorrect: false,
            }
        }
    }

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
        if (state.signInData.email !== "") {
            if (!state.signInData.email.match(emailFormat)) {
                state.errors.isEmailIncorrect = true;
                this.setState(state);
                return false
            }
            return true
        } else {
            if (state.signInData.email === "") {
                state.errors.isEmailEmpty = true;
            }
            this.setState(state);
            return false
        }
    }

    render() {
        let isEmailIncorrect = this.state.errors.isEmailIncorrect;
        let isEmailEmpty = this.state.errors.isEmailEmpty;
        if (this.props.isConfirmed === true) {
            return (
                <div className={S.formBody}>
                    На ваш email отправлено письмо с подтверждением регистрации. Пожалуйста, перейдите по ссылке в
                    письме для продолжения.
                </div>
            )
        }
        return (
            <div className={S.formBody}>
                <form method="POST" onSubmit={this.props.onSubmitHandler}>
                    <label className={`${isEmailIncorrect || isEmailEmpty ? S.errorLabel : S.label}`} htmlFor="email">Email</label>
                    <div className={S.input}>
                        <input
                            onChange={this.props.onChangeHandler}
                            id="email"
                            type="email"
                            name="email"
                        />
                        {this.state.errors.isEmailEmpty ?
                            <div className={S.errorText}>Заполните это поле</div> : null}
                        {this.state.errors.isEmailIncorrect ?
                            <div className={S.errorText}>Введите корректный Email</div> : null}
                        <button className={S.button} type="submit">Продолжить &#8594;</button>
                    </div>
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
            isConfirmed: false
        };
    };

    onChangeHandler = (e) => {
        console.log(this.state)
        const {signUpData} = this.state;
        signUpData[e.target.name] = e.target.value;
        this.setState({signUpData});
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        axios
            .post("http://react/api/register", this.state.signUpData)
            .then((response) => {
                if (response.status === 204 || response.status === 200) {
                    //window.location = "http://react/registration";
                    this.setState({
                        email: "",
                    })
                }
            })
        this.state.isConfirmed = true;
    };

    render() {
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
                            isConfirmed={this.state.isConfirmed}
                            onChangeHandler={this.onChangeHandler}
                            onSubmitHandler={this.onSubmitHandler}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
