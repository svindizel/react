import React, {Component} from "react";
import S from "./ModalWindow.module.css";
import axios from "axios";

export default class ModalWindow extends Component {
    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;

        super(props);
        this.state = {
            action: "",
            submitData: {
                _token: window.token,
                name: "",
                category: "",
                price: "",
                description: ""
            }
        }
    }

    onChangeHandler = (e) => {
        const {submitData} = this.state;
        submitData[e.target.name] = e.target.value;
        this.setState({submitData});
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        axios
            .post("http://react/api/addProduct", this.state.submitData)
            .then((response) => {
                console.log(response)
            })
    }

    addProductSubmit = (e) => {
        e.preventDefault();
        axios
            .post("http://react/api/addProduct", this.state.submitData)
            .then((response) => {
                console.log(response)
            })
        this.props.modalClose();
    }

    editProductSubmit = (event) => {
        console.log(event)
        console.log(event.target.elements)
        let name = event.target.elements.name.value;
        let category = event.target.elements.category.value;
        let art = event.target.elements.art.value;
        let description = event.target.elements.description.value;
        let price = event.target.elements.price.value;
        let id = this.props.editProductData.id;
        let submitData = {
            name: name,
            category: category,
            art: art,
            description: description,
            price: price,
            id: id
        }
        event.preventDefault();
        axios
            .post("http://react/api/editProduct", submitData)
            .then((response) => {
                console.log(response)
            })
        this.props.modalClose();
    }

    render() {
        const ADD_PRODUCT = "ADD-PRODUCT";
        const EDIT_PRODUCT = "EDIT-PRODUCT";
        const DELETE_PRODUCT = "DELETE-PRODUCT";
        switch (this.props.action) {
            case ADD_PRODUCT: {
                return(
                    <div className={S.modal}>
                        <div className={S.modalContent}>
                            <div className={S.modalHeader}>
                                <div className={S.headerText}>
                                    Новый товар
                                </div>
                                <div className={S.modalClose} onClick={this.props.modalClose}>x</div>
                            </div>
                            <div className={S.modalBody}>
                                <form method="POST" onSubmit={this.addProductSubmit}>
                                    <input onChange={this.onChangeHandler} name="name" type="text" placeholder="Название товара"/>
                                    <input onChange={this.onChangeHandler} name="art" type="text" placeholder="Артикул"/>
                                    <input onChange={this.onChangeHandler} name="category" type="text" placeholder="Категория"/>
                                    <input onChange={this.onChangeHandler} name="price" type="text" placeholder="Цена"/>
                                    <input onChange={this.onChangeHandler} name="description" type="text" placeholder="Описание"/>
                                    <button className={S.button} type="submit">Добавить</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
            case EDIT_PRODUCT: {
                let editProductData = this.props.editProductData;
                return(
                    <div className={S.modal}>
                        <div className={S.modalContent}>
                            <div className={S.modalHeader}>
                                <div className={S.headerText}>
                                    Новый товар
                                </div>
                                <div className={S.modalClose} onClick={this.props.modalClose}>x</div>
                            </div>
                            <div className={S.modalBody}>
                                <form method="POST" onSubmit={this.editProductSubmit}>
                                    <input onChange={this.onChangeHandler} value={editProductData.name} name="name" type="text" placeholder="Название товара"/>
                                    <input onChange={this.onChangeHandler} value={editProductData.art} name="art" type="text" placeholder="Артикул"/>
                                    <input onChange={this.onChangeHandler} value={this.props.currentCategory} name="category" type="text" placeholder="Категория"/>
                                    <input onChange={this.onChangeHandler} value={editProductData.price} name="price" type="text" placeholder="Цена"/>
                                    <input onChange={this.onChangeHandler} value={editProductData.description} name="description" type="text" placeholder="Описание"/>
                                    <button className={S.button} type="submit">Изменить</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
            default: return <></>
        }
    }
}
