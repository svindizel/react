import React, {Component} from "react";
import S from "./Products.module.css";
import Header from "../Header/Header";
import ProductsCategories from "./ProductsCategories/ProductsCategories";
import CategoriesContainer from "./ProductsCategories/CategoriesContainer";
import ProductsBodyContent from "./ProductsBodyContent/ProductsBodyContent";
import ModalWindow from "../ModalWindow/ModalWindow";
import axios from "axios";

export default class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            modalAction: null,
            products: {},
            categories: {},
            units: {},
            currentCategory: "",
            currentCategoryId: "",
            currentUnit: "",
            currentUnitId: "",
            editProductData: null,
            editCategoryData: null,
            errors: {
                isNameEmpty: false,
                isArtEmpty: false,
                isPriceEmpty: false,
                isArtIncorrect: false,
                isPriceIncorrect: false
            }
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
                this.setState(state);
            })
        axios
            .get("http://react/api/products/addictions")
            .then((response) => {
                state.categories = response.data.original.categories;
                state.currentCategory = response.data.original.categories[0].name;
                state.currentCategoryId = response.data.original.categories[0].id;
                state.units = response.data.original.units;
                state.currentUnit = response.data.original.units[0].name;
                state.currentUnitId = response.data.original.units[0].id;
                this.setState(state)
            })
        console.log(this.state)
    }

    changeCategory = (e) => {
        let newCategory = e.target.innerHTML;
        let state = this.state;
        if (newCategory === state.currentCategory) {
            return
        } else {
            state.currentCategory = newCategory;
            this.setState(state);
        }

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

    editCategories = () => {
        let state = this.state;
        state.modalAction = "EDIT-CATEGORIES";
        this.setState(state);
    }

    editCategory = (id, name) => {
        let state = this.state;
        console.log("id:"+id);
        state.editCategoryData = {id: id, name: name};
        state.modalAction = "EDIT-CATEGORY";
        this.setState(state);
    }

    addCategory = () => {
        let state = this.state;
        state.modalAction = "ADD-CATEGORY";
        this.setState(state);
    }

    deleteCategory = (id) => {
        axios
            .post("http://react/api/deleteCategory", {id: id})
            .then((response) => {
                console.log("category delete", response)
                let state = this.state;
                state.categories = response.data.original;
                this.setState(state);
            })
    }

    deleteProduct = (id) => {
        axios
            .post("http://react/api/deleteProduct", {id: id})
            .then((response) => {
                console.log(95, response)
                let state = this.state;
                state.products = response.data.original;
                this.setState(state);
            })
    }

    modalClose = () => {
        let state = this.state;
        state.modalAction = null;
        this.setState(state);
    }

    validateData = (data, action) => {
        let state = this.state;
        this.clearErrors(state);
        const addProduct = "add";
        const editProduct = "edit";
        let numbers = /^[0-9]+$/;
        if (action === addProduct) {
            if (data.name === "" || data.art === "" || data.price === "") {
                if (data.name === "") {
                    state.errors.isNameEmpty = true
                }
                if (data.art === "") {
                    state.errors.isArtEmpty = true
                }
                if (data.price === "") {
                    state.errors.isPriceEmpty = true
                }
                this.setState(state);
                return false
            } else if (!data.price.match(numbers)) {
                state.errors.isPriceIncorrect = true;
                this.setState(state);
                return false
            } else {
                return true
            }

        }
    }

    clearErrors = (state) => {
        state.errors.isNameEmpty = false;
        state.errors.isArtEmpty = false;
        state.errors.isPriceEmpty = false;
        state.errors.isArtIncorrect = false;
        state.errors.isPriceIncorrect = false;
        this.setState(state);
    }

    addProductSubmit = (e, data) => {
        e.preventDefault();
        let state = this.state;
        if (this.validateData(data, "add")) {
            axios
                .post("http://react/api/addProduct", data)
                .then((response) => {
                    console.log(response)
                    state.products = response.data.original;
                    this.setState(state);
                })
            this.modalClose();
        } else return false
    }

    editProductSubmit = (event, submitData) => {
        event.preventDefault();
        let state = this.state;
        axios
            .post("http://react/api/editProduct", submitData)
            .then((response) => {
                state.products = response.data.original;
                this.setState(state);
            })
        this.modalClose();
    }

    editCategorySubmit = (e, submitData) => {
        e.preventDefault();
        axios
            .post("http://react/api/editCategory", submitData)
            .then((response) => {
                let state = this.state;
                state.categories = response.data.original;
                state.currentCategory = response.data.original[state.currentCategoryId].name;
                this.setState(state)
            })
        this.modalClose();
    }

    addCategorySubmit = (e, submitData) => {
        e.preventDefault();
        axios
            .post("http://react/api/addCategory", {name: submitData})
            .then((response) => {
                let state = this.state;
                state.categories = response.data.original;
                state.currentCategory = response.data.original[state.currentCategoryId].name;
                this.setState(state)
            })
        this.modalClose();
    }

    render() {
        console.log(this.state.units)
        if (this.state.isAuth) {
            return (
                <>
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
                                {/*<ProductsCategories
                                    changeCategory={this.changeCategory}
                                    currentCategory={this.state.currentCategory}
                                    categories={this.state.categories}
                                    editCategories={this.editCategories}
                                    editCategory={this.editCategory}
                                    addCategory={this.addCategory}
                                    deleteCategory={this.deleteCategory}
                                />*/}
                                <CategoriesContainer />
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

                    <ModalWindow
                        errors={this.state.errors}
                        addCategory={this.addCategory}
                        addCategorySubmit={this.addCategorySubmit}
                        addProductSubmit={this.addProductSubmit}
                        editProductSubmit={this.editProductSubmit}
                        editCategoryData={this.state.editCategoryData}
                        editCategorySubmit={this.editCategorySubmit}
                        deleteCategory={this.deleteCategory}
                        modalClose={this.modalClose}
                        action={this.state.modalAction}
                        editProductData={this.state.editProductData}
                        currentCategory={this.state.currentCategory}
                        currentCategoryId={this.state.currentCategoryId}
                        currentUnit={this.state.currentUnit}
                        currentUnitId={this.state.currentUnitId}
                        categories={this.state.categories}
                        units={this.state.units}
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
