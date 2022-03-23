import React, {Component} from "react";
import S from "./Products.module.css";
import Header from "../Header/Header";
import ProductsCategories from "./ProductsCategories/ProductsCategories";
import ProductsBodyContent from "./ProductsBodyContent/ProductsBodyContent";
import ModalWindow from "../ModalWindow/ModalWindow";

export default class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            modalAction: null,
            products: {
            },
            categories: {
            },
            currentCategory: "",
            editProductData: null
        }
    };
    componentDidMount = () => {
        let state = this.state;
        axios
            .get("http://react/api/products")
            .then((response) => {
                if (!response.data.auth) {
                    window.location = "http://react/login"
                } else {
                    state.isAuth = true;
                    this.setState(state)
                }
            })
        axios
            .get("http://react/api/products/all")
            .then((response) => {
                state.products = response.data.original;
                console.log(response);
                this.setState(state);
            })
        axios
            .get("http://react/api/products/addictions")
            .then((response) => {
                state.categories = response.data.original.categories;
                state.currentCategory = response.data.original.categories[0].name;
                this.setState(state)
            })
    }

    changeCategory = (e) => {
        let newCategory = e.target.innerHTML;
        let state = this.state;
        if(newCategory === state.currentCategory) {
            return
        }
        state.currentCategory = newCategory;
        this.setState(state);
    }

    addProduct = () => {
        let state = this.state;
        state.modalAction = "ADD-PRODUCT";
        this.setState(state);
    }

    editProduct = (data) => {
        let state = this.state;
        state.modalAction = "EDIT-PRODUCT";
        state.editProductData = data;
        this.setState(state);
        console.log(data)
    }

    deleteProduct = (id) => {
        axios
            .post("http://react/api/deleteProduct", {id: id})
            .then((response) => {
                console.log(response)
            })
        console.log(data)
    }

    modalClose = () => {
        let state = this.state;
        state.modalAction = null;
        this.setState(state);
    }

    render() {
        if (this.state.isAuth) {
            return (
                <>
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
                                    <ProductsCategories
                                        changeCategory={this.changeCategory}
                                        currentCategory={this.state.currentCategory}
                                        categories={this.state.categories}
                                    />
                                    <ProductsBodyContent
                                        currentCategory={this.state.currentCategory}
                                        products={this.state.products}
                                        addProduct={this.addProduct}
                                        editProduct={this.editProduct}
                                        deleteProduct={this.deleteProduct}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalWindow
                        modalClose={this.modalClose}
                        action={this.state.modalAction}
                        editProductData={this.state.editProductData}
                        currentCategory={this.state.currentCategory}
                    />
                </>
            )
        } else {
            return (
                <></>
            )
        }
    }
}
