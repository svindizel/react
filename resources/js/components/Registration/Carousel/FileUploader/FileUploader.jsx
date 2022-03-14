import React, {Component, createRef} from "react";
import S from "./FileUploader.module.css";
import {toUpper} from "lodash/string";

class UploadButton extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className={S.uploadButton} onClick={this.props.onClickHandler}>
                <div className={S.logo}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="#354AFF"
                    >
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                    </svg>
                </div>
                <div className={S.buttonText}>
                    <div className={S.buttonHeader}>Загрузить логотип</div>
                    <div className={S.buttonBody}>Разрешение {'<'} 300x300 и размер {'<'} 3Мб</div>
                </div>
            </div>
        )
    }
}

export default class FileUploader extends Component {
    constructor(props) {
        super(props);
        this.hiddenFileInput = createRef();
        this.state = {
            ready: false
        };
    };

    onClickHandler = (e) => {
        this.hiddenFileInput.current.click();
        console.log("adasdasd")
    };

    componentDidMount() {
        this.hiddenFileInput.current.focus();
    };

    onChangeHandler = (e) => {
        const uploadedLogo = e.target.files[0];
        this.props.handleFile(uploadedLogo);
        this.renderLogo(uploadedLogo);
    }

    renderLogo = (uploadedLogo) => {
        let reader = new FileReader();
        let url = reader.readAsDataURL(uploadedLogo);
        reader.onloadend = (e) => {
            this.setState({
                logoSrc: [reader.result],
            });
            this.setState({ready: true})
        }
        console.log(this.state)
    }

    render() {
        return (
            <div className={S.fileUploader}>
                <div className={S.uploaderContent}>
                    <div className={S.logoPreview}>
                        {() => {
                            if (this.state.ready) {
                                return (<img className={S.original} src={this.state.logoSrc} alt=""/>)
                            }
                            return null
                        }}
                        <img className={() => {
                            if (this.state.ready) {
                                return S.hide
                            }
                            return S.thumb
                        }} src={this.state.logoSrc} alt=""/>
                    </div>
                    <div>
                        <div className={S.companyName}>РЕСТОРАН {toUpper(this.props.companyName)}</div>
                        <UploadButton onClickHandler={this.onClickHandler}/>
                        <input
                            ref={this.hiddenFileInput}
                            type="file"
                            name="logo"
                            style={{display: 'none'}}
                            onChange={this.onChangeHandler}
                        />
                    </div>
                </div>
                <div className={S.attention}>
                    Логотип будет использоваться для брендирования системы. Вы можете не загружать логотип, но в этом
                    случае будет использоваться логотип по умолчанию.
                </div>
            </div>
        )
    }
}
