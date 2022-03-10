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
            carouselPage: 1
        }
    };

    onChangeHandler = (e) => {
        const {registryData} = this.state;
        console.log(registryData);
        registryData[e.target.name] = e.target.value;
        this.setState({registryData});
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
        console.log(this.state)
    };

    handleFile = (uploadedFile) => {
        console.log(uploadedFile);
        const logo = this.state.registryData;
        let reader = new FileReader();
        reader.onloadend = function() {
            console.log('RESULT', reader.result)
            logo.logo = reader.result;
        }
        reader.readAsDataURL(uploadedFile);

        console.log(logo)
        this.setState(logo)
        /*this.setState({registryData:[...this.state.registryData, [uploadedFile]]});*/
        //console.log(this.state);
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.setState({isLoading: true});
        axios
            .post("http://react/api/register/verify", this.state.registryData)
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
                            />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
