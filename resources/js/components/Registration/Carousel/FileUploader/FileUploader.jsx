import React, {Component, createRef} from "react";
import S from "./FileUploader.module.css";
import {toUpper} from "lodash/string";

export default class FileUploader extends Component {
    constructor(props) {
        super(props);
        this.hiddenFileInput = createRef();
        this.state = {
            ready: false,
            logoSrc: null
        };
    };

    onClickHandler = (e) => {
        this.hiddenFileInput.current.click();
    };

    componentDidMount() {
        this.hiddenFileInput.current.focus();
        if(this.state.logoSrc === null) {
            let state = this.state;
            state.logoSrc = this.props.logo;
            this.setState(state)
        }
    };

    onChangeHandler = (e) => {
        const uploadedLogo = e.target.files[0];
        this.props.handleFile(uploadedLogo);
        this.renderLogo(uploadedLogo);
    }

    renderLogo = (uploadedLogo) => {
        console.log(35, uploadedLogo)
        let state = this.state;
        let reader = new FileReader();
        let url = reader.readAsDataURL(uploadedLogo);
        reader.onloadend = (e) => {
            state.logoSrc = [reader.result];
            state.ready = true;
            this.props.handleFIleToRender([reader.result])
            this.setState(state);
        }
    }

    setLogoSrc = () => {
        let state = this.state;
        if (state.logoSrc === null) {
            state.logoSrc = this.props.logo;
            this.setState(state);
        }
    }

    //{/*className={() => {if (this.state.ready) {return S.hide}return S.thumb}}*/}
    render() {
        return (
            <div className={S.fileUploader}>
                <div className={S.uploaderContent}>
                    <div className={S.logoPreview}>
                        <img
                            className={{/*this.state.ready ? S.hide : S.thumb*/}}
                            src={this.state.logoSrc === null ? this.props.logo : this.state.logoSrc}
                            alt=""
                        />
                    </div>
                    <div>
                        <div className={S.companyName}>???????????????? {toUpper(this.props.companyName)}</div>
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
                    ?????????????? ?????????? ???????????????????????????? ?????? ?????????????????????????? ??????????????. ???? ???????????? ???? ?????????????????? ??????????????, ???? ?? ????????
                    ???????????? ?????????? ???????????????????????????? ?????????????? ???? ??????????????????.
                </div>
            </div>
        )
    }
}

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
                    <div className={S.buttonHeader}>?????????????????? ??????????????</div>
                    <div className={S.buttonBody}>???????????????????? {'<'} 300x300 ?? ???????????? {'<'} 3????</div>
                </div>
            </div>
        )
    }
}
