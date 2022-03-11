import React, {Component} from "react";
import S from "./Registration.module.css";
import Carousel from "./Carousel/Carousel";

export default class Registration extends Component {

    constructor(props) {
        super(props);
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const email = urlParams.get('email');
        console.log(email);
        this.state = {
            registryData: {
                companyName: "",
                inn: "",
                password: "",
                email: email,
                _token: window.token
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
        const registryData = {...this.state.registryData};
        registryData.inn = e.currentTarget.getAttribute("inn");
        registryData.companyName = e.currentTarget.getAttribute("name");
        this.setState({registryData: registryData});
        console.log(this.state);
        this.state.suggestions = [];
        document.getElementById("inn").value = registryData.inn;
    }

    onChangeHandler = (e) => {
        const {registryData} = this.state;
        registryData[e.target.name] = e.target.value;
        this.setState({registryData});

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
        axios
            .post("http://react/api/register/verify/1", this.state.registryData)
            .then((response) => {
                console.log(response)
            })
        console.log(this.state);
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
        //console.log(logo)
        this.setState(logo)
        /*this.setState({registryData:[...this.state.registryData, [uploadedFile]]});*/
        //console.log(this.state);
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        axios
            .post("http://react/api/register/verify/3", this.state.registryData)
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
                        <form method="POST" onSubmit={this.onSubmitHandler}>
                            <Carousel
                                onChangeHandler={this.onChangeHandler}
                                onClickHandler={this.onClickHandler}
                                companyName={this.state.registryData.companyName}
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
