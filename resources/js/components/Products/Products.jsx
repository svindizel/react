import React, {Component} from "react";
import S from "./Products.module.css";
import Header from "../Header/Header";
import axios from "axios";

export default class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: false
        }
    };

    componentDidMount = () => {
        axios
            .get("http://react/api/products")
            .then((response) => {
                if(!response.data.auth) {
                    let state = this.state;
                    state.isAuth = false;
                    this.setState(state);
                    window.location = "http://react/login"
                } else {
                    let state = this.state;
                    state.isAuth = true;
                    this.setState(state);
                }

            })
    }

    render() {
        if(this.state.isAuth) {
            return (
                <div>
                    <Header/>
                    <div className={S.container}>
                        <div className={S.products}>
                            <div className={S.productsHeader}>
                                <div className={S.headerText}>Товары</div>
                                <div className={S.headerSearch}>
                                    <input type="text" placeholder="Поиск"/>
                                </div>
                            </div>
                            <div className={S.productsBody}>
                                <div className={S.productsCategories}>
                                    <div className={S.productsCategory}>
                                        Пицца
                                    </div>
                                </div>
                                <div className={S.bodyContent}>
                                    <div className={S.bodyHeader}>
                                        <div className={S.bodyHeaderText}>
                                            Пицца
                                        </div>
                                        <div className={S.button}>
                                            Новый товар
                                        </div>
                                    </div>
                                    <div className={S.productsTable}>
                                        <div className={S.tableHeader}>
                                            <div className={S.productName}>Название</div>
                                            <div className={S.productPrice}>Цена</div>
                                            <div className={S.productMeasureItems}>Ед.</div>
                                            <div className={S.productArticul}>Арт.</div>
                                            <div className={S.productSale}>Скидка</div>
                                            <div className={S.productSale}>Состав</div>
                                            <div className={S.productIngredients}>Стоп-лист</div>
                                        </div>
                                        <div className={S.tableBody}>
                                            <div className={S.tableRow}>
                                                <div className={S.productName}>Канада ролл</div>
                                                <div className={S.productPrice}>240</div>
                                                <div className={S.productMeasureItems}>шт.</div>
                                                <div className={S.productArticul}>123</div>
                                                <div className={S.productSale}>Да</div>
                                                <div className={S.productIngredients}>
                                                    угорь копченый, лосось, сыр филадельфия,
                                                    авокадо, рис, водоросли нори
                                                </div>
                                                <div className={S.productStop}>
                                                    <input type="checkbox"/>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return(
                <></>
            )
        }
    }
}
