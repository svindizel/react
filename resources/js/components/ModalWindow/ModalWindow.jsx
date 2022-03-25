import React, {Component} from "react";
import S from "./ModalWindow.module.css";
import axios from "axios";
import ModalWindowDropdown from "./ModalWindowDropdown/ModalWindowDropdown";

export default class ModalWindow extends Component {
    constructor(props) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = window.token;
        super(props);
        console.log(10, props)
        this.state = {
            action: "",
            submitData: {
                _token: window.token,
                name: "",
                category: this.props.currentCategory,
                category_id: this.props.currentCategoryId,
                price: "",
                description: "",
                unit: this.props.currentUnit,
                unit_id: this.props.currentUnitId,
                art: ""
            },
            isValueEdited: false,
        }
    }

    /*componentDidMount() {
        let state = this.state;
        console.log(this.props)
        state.submitData.unit = this.props.units[0].name;
        state.submitData.unit_id = this.props.units[0].id;
        this.setState(state);
        if(this.props.action == "EDIT-PRODUCT") {

            state.submitData = this.props.editProductData;
            this.setState(state);
            console.log(111)
        }
    }*/

    onAddChangeHandler = (e) => {
        let submitData = {...this.state.submitData};
        submitData[e.target.name] = e.target.value;
        this.setState({submitData});
    }

    onEditChangeHandler = (e) => {
        let submitData = {...this.state.submitData};
        if(this.state.isValueEdited) {
            submitData[e.target.name] = e.target.value;
            this.setState({submitData});
            console.log(50, submitData)
        } else {
            submitData = this.props.editProductData;
            this.state.isValueEdited = true;
            this.setState({submitData});
        }
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        axios
            .post("http://react/api/addProduct", this.state.submitData)
            .then((response) => {
                console.log(response)
            })
    }

    editProductSubmit = (event) => {
        event.preventDefault();
        let name = event.target.elements.name.value;
        let category_id = this.state.submitData.category_id;
        let art = event.target.elements.art.value;
        let description = event.target.elements.description.value;
        let price = event.target.elements.price.value;
        let unit = this.state.submitData.unit;
        let unit_id = this.state.submitData.unit_id;
        let id = this.props.editProductData.id;
        let submitData = {
            name: name,
            category_id: category_id,
            art: art,
            description: description,
            price: price,
            id: id,
            unit: unit,
            unit_id: unit_id
        }
        this.props.editProductSubmit(event, submitData)
    }

    addProductSubmit = (e) => {
        console.log("addproduct")
        e.preventDefault();
        this.props.addProductSubmit(e, this.state.submitData);
        state.submitData.name = "";
        state.submitData.price = "";
        state.submitData.art = "";
    }

    chooseCategory = (category, id) => {
        let state = this.state;
        state.submitData.category = category;
        state.submitData.category_id = id;
        this.setState(state);
    }

    chooseUnit = (unit, id) => {
        let state = this.state;
        state.submitData.unit_id = id;
        state.submitData.unit = unit;
        this.setState(state);
    }



    render() {
        console.log(this.props.units)
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
                                    <input className={`${this.props.errors.isNameEmpty ? S.error : S.input}`} onChange={this.onAddChangeHandler} name="name" type="text" placeholder="Название товара"/>
                                    {this.props.errors.isNameEmpty ?
                                        <div className={S.errorText}>Заполните это поле</div> : null}
                                    <input className={`${this.props.errors.isArtEmpty ? S.error : S.input}`} onChange={this.onAddChangeHandler} name="art" type="text" placeholder="Артикул"/>
                                    {this.props.errors.isArtEmpty ?
                                        <div className={S.errorText}>Заполните это поле</div> : null}
                                    <ModalWindowDropdown isCategory={true} chooseCategory={this.chooseCategory} currentCategory={this.props.currentCategory} categories={this.props.categories}/>
                                    <ModalWindowDropdown isCategory={false} chooseUnit={this.chooseUnit} units={this.props.units} currentUnit={this.props.units[0].name}/>
                                    <input className={`${this.props.errors.isPriceEmpty || this.props.errors.isPriceIncorrect ? S.error : S.input}`} onChange={this.onAddChangeHandler} name="price" type="text" placeholder="Цена"/>
                                    {this.props.errors.isPriceEmpty ?
                                        <div className={S.errorText}>Заполните это поле</div> : null}
                                    {this.props.errors.isPriceIncorrect ?
                                        <div className={S.errorText}>Введите корректное значение</div> : null}
                                    <input className={S.input} onChange={this.onAddChangeHandler} name="description" type="text" placeholder="Описание"/>
                                    <button className={S.button} type="submit">Добавить</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
            case EDIT_PRODUCT: {
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
                                    <input
                                        className={S.input}
                                        onChange={this.onEditChangeHandler}
                                        value={this.state.isValueEdited ? this.state.submitData.name : this.props.editProductData.name}
                                        name="name"
                                        type="text"
                                        placeholder="Название товара"
                                    />
                                    <input
                                        className={S.input}
                                        onChange={this.onEditChangeHandler}
                                        value={this.state.isValueEdited ? this.state.submitData.art : this.props.editProductData.art}
                                        name="art"
                                        type="text"
                                        placeholder="Артикул"
                                    />
                                    <ModalWindowDropdown
                                        isCategory={true}
                                        chooseCategory={this.chooseCategory}
                                        currentCategory={this.props.currentCategory}
                                        categories={this.props.categories}
                                    />
                                    <ModalWindowDropdown
                                        isCategory={false}
                                        currentUnit={this.props.editProductData.unit}
                                        chooseUnit={this.chooseUnit}
                                        units={this.props.units}
                                    />
                                    <input
                                        className={S.input}
                                        onChange={this.onEditChangeHandler}
                                        value={this.state.isValueEdited ? this.state.submitData.price : this.props.editProductData.price}
                                        name="price"
                                        type="text"
                                        placeholder="Цена"
                                    />
                                    <input
                                        className={S.input}
                                        onChange={this.onEditChangeHandler}
                                        value={this.state.isValueEdited ? this.state.submitData.description : this.props.editProductData.description}
                                        name="description"
                                        type="text"
                                        placeholder="Описание"
                                    />
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
