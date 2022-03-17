import React, {Component} from "react";
import S from "./Registration.module.css";
import FormData from "form-data";
import Carousel from "./Carousel/Carousel";
import NotFound from "../NotFound/NotFound";
import axios from "axios";

export default class Registration extends Component {

    constructor(props) {
        super(props);
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');
        this.state = {
            registryData: {
                step_1: {
                    companyName: "",
                    inn: "",
                    token: token,
                    _token: window.token
                },
                step_2: {
                    token: token,
                    _token: window.token,
                    logo: ""
                },
                step_3: {
                    password: "",
                    passwordConfirm: "",
                    token: token,
                    _token: window.token
                },
                /*companyName: "",
                inn: "",
                password: "",*/

            },
            carouselPage: 1,
            suggestions: [],
            errors: {
                isPasswordConfirmEmpty: false,
                isPasswordEmpty: false,
                isPasswordIncorrect: false,
                isPasswordsNotMatch: false,
                isInnEmpty: false,
                isTokenFalse: false
            },
            isRegistred: false
        }
    };

    componentDidMount = () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');
        let state = this.state;
        axios
            .post("http://react/api/register/verify/token", {token: token})
            .then((response) => {
                console.log(response)
                if (response.data.original.isTokenTrue) {
                    this.getStage();
                } else {
                    let state = this.state;
                    state.errors.isTokenFalse = true;
                    this.setState(state);
                }
            })
        axios
            .get("http://react/api/products")
            .then((response) => {
                if(response.data.auth) {
                    window.location = "http://react/products"
                }
            })
        axios
            .post("http://react/api/register/getData", {token: token})
            .then((response) => {
                console.log(123, response.data.original[0]);
                let data = response.data.original[0];
                state.carouselPage = data.stage;
                state.registryData.step_1.inn = data.inn;
                state.registryData.step_1.companyName = data.name;
                state.registryData.step_2.logo = "./storage/" + data.logo;
                console.log(state.registryData.step_2.logo)

                console.log(this.state)
                if (state.carouselPage === 3) {
                    state.isRegistred = true;
                }
                this.setState(state);
            })
    }

    getStage = () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token');
        let state = this.state;
        if (urlParams.get("stage")) {
            if(parseInt(urlParams.get("stage")) === 3) {
                window.location = "http://react/login"
            }
            state.carouselPage = parseInt(urlParams.get("stage"));
            this.setState(state);
        } else {
            let initialData = {
                token: urlParams.get('token'),
                stage: 1
            }
            /*state.carouselPage = 1
            this.setState(state);*/
            axios
                .post("http://react/api/register/verify", {token: token})
        }
        if (parseInt(urlParams.get("stage")) === 3) {
            state.isRegistred = true;
            this.setState(state);
        }
    }

    dadataCall = (e, query) => {
        let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        let dadataToken = "943977626eee933f01043ff46175bd0e3d4fd35c";
        let options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + dadataToken
            },
            body: JSON.stringify({query: query})
        }

        fetch(url, options)
            .then(response => response.json())
            .then(suggestions => this.setState(suggestions))
            .catch(error => console.log("error", error));
    };

    companySelectHandler = (e) => {
        let registryData = this.state.registryData;
        registryData.step_1.inn = e.currentTarget.getAttribute("inn");
        registryData.step_1.companyName = e.currentTarget.getAttribute("name");
        this.setState({registryData});
        this.state.suggestions = [];
        document.getElementById("inn").value = registryData.step_1.inn;
    };

    onChangeHandler = (e) => {
        if (this.state.carouselPage === 1) {
            let state = this.state;
            state.registryData.step_1[e.target.name] = e.target.value;
            this.setState(state);
        }
        if (this.state.carouselPage === 2) {
            let state = this.state;
            state.registryData.step_2[e.target.name] = e.target.value;
            this.setState(state);
        }
        if (this.state.carouselPage === 3) {
            let state = this.state;
            state.registryData.step_3[e.target.name] = e.target.value;
            this.setState(state);
        }
        if (e.target.id === "inn") {
            this.dadataCall(e, e.target.value)
        }
    };

    nextPage = (e) => {
        e.preventDefault();
        let state = this.state;
        if (state.carouselPage === 1) {
            if (this.validateData()) {
                state.carouselPage = state.carouselPage + 1;
                axios
                    .post("http://react/api/register/verify/1", this.state.registryData.step_1)
                    .then((response) => {
                        console.log(response)
                    })
                this.setState(state);
            }
        } else if (state.carouselPage === 2) {
            let data = new FormData();
            console.log(168, typeof this.state.registryData.step_2.logo)
            if (typeof this.state.registryData.step_2.logo === 'string') {
                state.carouselPage = state.carouselPage + 1;
                this.setState(state);
                return
            }
            data.append('logo', this.state.registryData.step_2.logo, this.state.registryData.step_2.logo.name)
            data.append('token', this.state.registryData.step_2.token)
            let headers = {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
            axios
                .post("http://react/api/register/verify/2", data, {
                    headers: headers
                })
                .then((response) => {
                    console.log(response)
                })
            state.carouselPage = state.carouselPage + 1;
            this.setState(state);
        } else {
            if (state.carouselPage === 3) {
                if (this.validateData()) {
                    axios
                        .post("http://react/api/register/verify/3", this.state.registryData.step_3)
                        .then((response) => {
                            if (response.status === 204 || response.status === 200) {
                                window.location = "http://react/products";
                            }
                        })
                }
            }
        }
    }

    previousPage = (e) => {
        e.preventDefault();
        let state = this.state;
        state.carouselPage = state.carouselPage - 1;
        this.setState(state)
    }
    //-------------------------------------------------------------------------------

    /*onClickHandler = (e) => {
        e.preventDefault();
        let state = this.state;
        const action = e.target.getAttribute("data-action");
        if (action === "true") {
            state.carouselPage = this.state.carouselPage + 1;
            this.setState(state)
        } else {
            state.carouselPage = this.state.carouselPage - 1;
            this.setState(state)
        }
        if (this.state.carouselPage === 1) {
            if (this.validateData()) {
                axios
                    .post("http://react/api/register/verify/1", this.state.registryData.step_1)
                    .then((response) => {
                        console.log(response)
                    })
            }
        }
        if (this.state.carouselPage === 2) {
            let data = new FormData();
            data.append('logo', this.state.registryData.step_2.logo, this.state.registryData.step_2.logo.name)
            data.append('token', this.state.registryData.step_2.token)
            let headers = {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            }
            axios
                .post("http://react/api/register/verify/2", data, {
                    headers: headers
                })
                .then((response) => {
                    console.log(response)
                })
        }
        if (this.state.carouselPage === 3) {
            if (this.validateData()) {
                axios
                    .post("http://react/api/register/verify/3", this.state.registryData.step_3)
                    .then((response) => {
                        if (response.status === 204 || response.status === 200) {
                            window.location = "http://react/products";
                        }
                    })
            }
        }
    };*/

    clearErrors = (state) => {
        state.errors.isPasswordConfirmEmpty = false;
        state.errors.isPasswordEmpty = false;
        state.errors.isPasswordIncorrect = false;
        state.errors.isPasswordsNotMatch = false;
        this.setState(state);
    }

    validateData = () => {
        let state = this.state;
        this.clearErrors(state);
        if (state.carouselPage === 1) {
            if (state.registryData.step_1.inn === "") {
                state.errors.isInnEmpty = true
                this.setState(state);
                return false
            } else {
                return true
            }
        }
        if (state.carouselPage === 3) {
            if (state.registryData.step_3.passwordConfirm !== "" && state.registryData.step_3.password !== "") {
                if (state.registryData.step_3.password.length > 8) {
                    if (state.registryData.step_3.passwordConfirm === state.registryData.step_3.password) {
                        this.setState(state);
                        return true
                    } else {
                        state.errors.isPasswordsNotMatch = true;
                        this.setState(state);
                        return false
                    }
                } else {
                    state.errors.isPasswordIncorrect = true;
                    this.setState(state);
                    return false
                }
            } else {
                if (state.registryData.step_3.passwordConfirm === "" || state.registryData.step_3.password === "") {
                    if (state.registryData.step_3.passwordConfirm === "") {
                        state.errors.isPasswordConfirmEmpty = true;
                    }
                    if (state.registryData.step_3.password === "") {
                        state.errors.isPasswordEmpty = true;
                    }
                    this.setState(state);
                    return false
                }
            }
        }
    }

    handleFile = (uploadedFile) => {
        let state = this.state;
        state.registryData.step_2.logo = uploadedFile;
        state.logo = uploadedFile;
        this.setState(state)
    };

    handleFIleToRender = (file) => {
        let state = this.state;
        state.logo = file;
        this.setState(state);
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        if (this.validateData) {
            axios
                .post("http://react/register/verify", this.state.registryData)
                .then((response) => {
                    console.log(response)
                    if (response.status === 204 || response.status === 200) {
                        window.location = "http://react/home";
                        this.setState({
                            email: "",
                            password: "",
                        })
                    }
                })
        }
    };

    render() {
        console.log(this.state.isRegistred)
        if (this.state.errors.isTokenFalse) {
            return (
                <NotFound/>
            )
        } else if (this.state.isRegistred) {
            window.location = "http://react/login"
            console.log(this.state.isRegistred)
        } else {
            return (
                <div className={S.container}>
                    <div className={S.registration}>
                        <div className={S.registrationForm}>
                            <div className={S.formHeader}>
                                <div className={S.headerText}>
                                    Регистрация
                                </div>
                                <div className={S.pageNumber}>
                                    {this.state.carouselPage} из 3
                                </div>
                            </div>
                            <div className={S.formBody}>
                                <form method="POST" onSubmit={this.onSubmitHandler}>
                                    <Carousel
                                        logo={this.state.registryData.step_2.logo}
                                        handleFIleToRender={this.handleFIleToRender}
                                        previousPage={this.previousPage}
                                        errors={this.state.errors}
                                        registryData={this.state.registryData}
                                        onChangeHandler={this.onChangeHandler}
                                        nextPage={this.nextPage}
                                        onClickHandler={this.onClickHandler}
                                        companyName={this.state.registryData.step_1.companyName}
                                        handleFile={this.handleFile}
                                        page={this.state.carouselPage}
                                        suggestions={this.state.suggestions}
                                        companySelectHandler={this.companySelectHandler}
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}
