import S from "./Carousel.module.css";
import FileUploader from "./FileUploader/FileUploader";
import React, {Component} from "react";
import Suggestions from "./Suggestions/Suggestions";

export default class Carousel extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
    }

    render() {
        if (this.props.page === 1) {
            return (
                <div className={S.carousel}>
                    <div className={S.input}>
                        <label
                            className={this.props.errors.isInnEmpty ? S.errorLabel : S.label}
                            htmlFor="inn"
                        >
                            ИНН / ОГРН
                        </label>
                        <input
                            className={this.props.errors.isInnEmpty ? S.error : null}
                            id="inn"
                            type="text"
                            name="inn"
                            autocomplete="off"
                            value={this.props.registryData.step_1.inn}
                            onChange={this.props.onChangeHandler}
                        />
                        {this.props.errors.isInnEmpty ?
                            <div className={S.errorText}>Заполните это поле</div> : null}
                        <div className={S.dropdown}>
                            <Suggestions
                                suggestions={this.props.suggestions}
                                companySelectHandler={this.props.companySelectHandler}
                            />
                        </div>

                    </div>
                    <div className={S.buttons}>
                        <button
                            data-action={true}
                            onClick={this.props.nextPage}
                            className={S.button}>
                            Продолжить &#8594;
                        </button>
                    </div>
                </div>
            )
        }
        if (this.props.page === 2) {
            return (
                <div className={S.carousel}>

                    <FileUploader companyName={this.props.companyName} handleFile={this.props.handleFile}/>
                    <div className={S.buttons}>
                        <button
                            style={{backgroundColor: "#E8E8E8", color: "#969696"}}
                            data-action={false}
                            onClick={this.props.previousPage}
                            className={S.button}>
                            &#8592; Назад
                        </button>
                        <button
                            data-action={true}
                            onClick={this.props.nextPage}
                            className={S.button}>
                            Продолжить &#8594;
                        </button>
                    </div>
                </div>
            )
        }
        if (this.props.page === 3) {
            return (
                <div className={S.carousel}>
                    <div className={S.input}>
                        <label
                            className={this.props.errors.isPasswordEmpty || this.props.errors.isPasswordIncorrect || this.props.errors.isPasswordsNotMatch ? S.errorLabel : S.label}
                            htmlFor="companyName">Введите пароль
                        </label>
                        <input
                            className={this.props.errors.isPasswordEmpty || this.props.errors.isPasswordIncorrect || this.props.errors.isPasswordsNotMatch ? S.error : null}
                            id="password"
                            type="password"
                            name="password"
                            onChange={this.props.onChangeHandler}
                        />
                        {this.props.errors.isPasswordEmpty ?
                            <div className={S.errorText}>Заполните это поле</div> : null}
                        {this.props.errors.isPasswordIncorrect ?
                            <div className={S.errorText}>Пароль должен быть длиннее 8 символов</div> : null}
                    </div>
                    <div className={S.input}>
                        <label
                            className={this.props.errors.isPasswordConfirmEmpty || this.props.errors.isPasswordsNotMatch ? S.errorLabel : S.label}
                            htmlFor="inn">Подтвердите пароль
                        </label>
                        <input
                            className={this.props.errors.isPasswordConfirmEmpty || this.props.errors.isPasswordsNotMatch ? S.error : null}
                            id="passwordConfirm"
                            type="password"
                            name="passwordConfirm"
                            onChange={this.props.onChangeHandler}
                        />
                        {this.props.errors.isPasswordConfirmEmpty ?
                            <div className={S.errorText}>Заполните это поле</div> : null}
                        {this.props.errors.isPasswordsNotMatch ?
                            <div className={S.errorText}>Пароли не совпадают</div> : null}
                    </div>
                    <div className={S.buttons}>
                        <button
                            style={{backgroundColor: "#E8E8E8", color: "#969696"}}
                            data-action={false}
                            onClick={this.props.previousPage}
                            className={S.button}>
                            &#8592; Назад
                        </button>
                        <button
                            data-action={true}
                            onClick={this.props.nextPage}
                            className={S.button}>
                            Завершить
                        </button>
                    </div>
                </div>
            )
        }
    }
}
