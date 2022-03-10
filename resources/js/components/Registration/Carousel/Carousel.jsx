import S from "./Carousel.module.css";
import FileUploader from "../FileUploader/FileUploader";
import React, {Component} from "react";
import {toUpper} from "lodash/string";

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
                        <label className={S.label} htmlFor="companyName">Название компании
                        </label>
                        <input
                            id="companyName"
                            type="text"
                            name="companyName"
                            onChange={this.props.onChangeHandler}
                        />
                    </div>
                    <div className={S.input}>
                        <label className={S.label} htmlFor="inn">ИНН / ОГРН
                        </label>
                        <input
                            id="inn"
                            type="text"
                            name="inn"
                            onChange={this.props.onChangeHandler}
                        />
                    </div>
                    <div className={S.buttons}>
                        <button
                            data-action={true}
                            onClick={this.props.onClickHandler}
                            className={S.button}>
                            Продолжить &#8594;
                        </button>
                    </div>
                </div>
            )
        }
        if(this.props.page === 2) {
            return (
                <div className={S.carousel}>
                    <div className={S.companyName}>РЕСТОРАН {toUpper(this.props.companyName)}</div>
                    <FileUploader handleFile={this.props.handleFile}/>
                    <div className={S.buttons}>
                        <button
                            style={{backgroundColor:"#E8E8E8",color:"#969696"}}
                            data-action={false}
                            onClick={this.props.onClickHandler}
                            className={S.button}>
                            &#8592; Назад
                        </button>
                        <button
                            data-action={true}
                            onClick={this.props.onClickHandler}
                            className={S.button}>
                            Продолжить &#8594;
                        </button>
                    </div>
                </div>

            )
        }
        if(this.props.page === 3) {
            return(
                <div className={S.carousel}>
                    <div className={S.input}>
                        <label className={S.label} htmlFor="companyName">Введите пароль
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            onChange={this.props.onChangeHandler}
                        />
                    </div>
                    <div className={S.input}>
                        <label className={S.label} htmlFor="inn">Подтвердите пароль
                        </label>
                        <input
                            id="passwordConfirm"
                            type="password"
                            name="password"
                            onChange={this.props.onChangeHandler}
                        />
                    </div>
                    <div className={S.buttons}>
                        <button
                            style={{backgroundColor:"#E8E8E8",color:"#969696"}}
                            data-action={false}
                            onClick={this.props.onClickHandler}
                            className={S.button}>
                            &#8592; Назад
                        </button>
                        <button
                            data-action={true}
                            type="submit"
                            className={S.button}>
                            Завершить
                        </button>
                    </div>
                </div>
            )
        }
    }
}
