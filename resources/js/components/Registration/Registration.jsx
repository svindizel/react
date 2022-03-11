import React, {Component} from "react";
import S from "./Registration.module.css";
import Carousel from "./Carousel/Carousel";

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
                    _token: window.token
                },
                step_3: {
                    password: "",
                    token: token,
                    _token: window.token
                },
                /*companyName: "",
                inn: "",
                password: "",*/

            },
            carouselPage: 1,
            suggestions: []
        }
    };

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
        console.log(this.state);
    };

    companySelectHandler = (e) => {
        console.log(this.state.registryData)
        let registryData = this.state.registryData;
        console.log(registryData)
        registryData.step_1.inn = e.currentTarget.getAttribute("inn");
        registryData.step_1.companyName = e.currentTarget.getAttribute("name");
        this.setState({registryData});
        console.log(this.state);
        this.state.suggestions = [];
        document.getElementById("inn").value = registryData.step_1.inn;
    };

    onChangeHandler = (e) => {
        if(this.state.carouselPage === 1) {
            console.log(this.state.registryData)
            let registryData = this.state.registryData;
            registryData.step_1[e.target.name] = e.target.value;
            this.setState({registryData});
            console.log(this.state)
        }
        if(this.state.carouselPage === 2) {
            let registryData = this.state.registryData;
            registryData.step_2[e.target.name] = e.target.value;
            this.setState({registryData});
        }
        if(this.state.carouselPage === 3) {
            let registryData = this.state.registryData;
            registryData.step_3[e.target.name] = e.target.value;
            this.setState({registryData});
        }
        if(e.target.id === "inn") {
            this.dadataCall(e, e.target.value)
        }
    };

    onClickHandler = (e) => {
        e.preventDefault();
        const action = e.target.getAttribute("data-action");
        if (action === "true") {
            this.setState({
                carouselPage: this.state.carouselPage + 1
            });
        } else {
            this.setState({
                carouselPage: this.state.carouselPage - 1
            });
        }
        if(this.state.carouselPage === 1) {
            axios
                .post("http://react/api/register/verify/1", this.state.registryData.step_1)
                .then((response) => {
                    console.log(response)
                })
            console.log(this.state);
        }
        if(this.state.carouselPage === 2) {
            axios
                .post("http://react/api/register/verify/2", this.state.registryData.step_2)
                .then((response) => {
                    console.log(response)
                })
            console.log(this.state);
        }
        if(this.state.carouselPage === 3) {
            axios
                .post("http://react/api/register/verify/3", this.state.registryData.step_3)
                .then((response) => {
                    console.log(response)
                })
            console.log(this.state);
        }

    };

    handleFile = (uploadedFile) => {
        console.log(uploadedFile);
        const logo = this.state.registryData;
        let reader = new FileReader();
        reader.onloadend = () => {
            console.log(reader.result)
            logo.logo = reader.result;
        }
        reader.readAsDataURL(uploadedFile);
        let registryData = this.state.registryData;
        registryData.step_2.logo = uploadedFile;
        this.setState(registryData)
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
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
    };

    render() {
        console.log(this.state)
        return (
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
                        <form method="POST" enctype="multipart/form-data" onSubmit={this.onSubmitHandler}>
                            <Carousel
                                onChangeHandler={this.onChangeHandler}
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
        )
    }
}
