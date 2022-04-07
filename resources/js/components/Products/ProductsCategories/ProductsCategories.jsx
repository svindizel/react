import React, {Component} from "react";
import S from "../Products.module.css";
import {useDispatch} from "react-redux";
import store from "../../store";

export default function ProductsCategories(props) {
    const dispatch = useDispatch();
    const state = store.getState();
    const categories = state.categories;

    if(!categories.categories.length > 0) {
        props.getCategories();
    }

    let categoryItems = () => {
        return state.categories.categories.map(categoryItem =>
            <div key={categoryItem.id} className={S.categoryItem} onClick={() => {props.getCategoryProducts(categoryItem.id)}}>
                {categoryItem.name}
            </div>
        )
    }



    return (
        <>
            <div className={S.productsCategories}>
                {categoryItems()}
                <div className={S.button}>Добавить категорию</div>
            </div>
        </>
    )
    /*renderCategoryItems = () => {
        let categories = this.props.categories;
        return categories.map(categoryItem =>
            <CategoryItem
                editCategory={this.props.editCategory}
                deleteCategory={this.props.deleteCategory}
                changeCategory={this.props.changeCategory}
                name={categoryItem.name}
                key={categoryItem.name}
                id={categoryItem.id}
            />
        )
    }

    componentDidMount() {
        axios
            .get("http://react/api/products/addictions")
            .then((response) => {
                let state = this.state;
                state.categories = this.props.categories;
                state.isStateReady = true;
                this.setState(state);
            })

    }

    render() {
        if (this.state.isStateReady) {
            return (
                <>
                    <div className={S.productsCategories}>
                        {this.renderCategoryItems()}
                        <div className={S.button} onClick={this.props.addCategory}>Добавить категорию</div>
                    </div>

                </>
            )
        } else {
            return (
                <>
                    <div className={S.productsCategories}>

                    </div>
                </>
            )
        }

    }*/
}

/*class CategoryItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div className={S.categoryItem} onClick={this.props.changeCategory}>
                    {this.props.name}
                </div>
            </>

        )
    }
}*/
