import S from "./EmailConfirm.module.css";
import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

class FormBody extends Component {
    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
    }

    render() {
        if(this.props.isConfirmed === true) {
            return (
                <div className={S.formBody}>
                    На ваш email отправлено письмо с подтверждением регистрации. Пожалуйста, перейдите по ссылке в письме для продолжения.
                </div>
            )
        }
        return (
            <div className={S.formBody}>
                <form method="POST" onSubmit={this.props.onSubmitHandler}>
                    <label className={S.label} htmlFor="email">Email
                    </label>
                    <div className={S.input}>
                        <input
                            onChange={this.props.onChangeHandler}
                            id="email"
                            type="email"
                            name="email"
                        />
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
        const { signUpData } = this.state;
        signUpData[e.target.name] = e.target.value;
        this.setState({ signUpData });
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
        console.log(this.state)
        return (
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
        )
    }
}
