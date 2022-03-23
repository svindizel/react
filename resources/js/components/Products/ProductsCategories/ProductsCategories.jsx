import React, {Component} from "react";
import S from "../Products.module.css";

export default class ProductsCategories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStateReady: false,
        }
    }

    renderCategoryItems = () => {
        let categories = this.state.categories;
        return categories.map(categoryItem =>
            <CategoryItem
                changeCategory={this.props.changeCategory}
                name={categoryItem.name}
                key={categoryItem.id}
            />
        )
    }

    componentDidMount() {
        axios
            .get("http://react/api/products/addictions")
            .then((response) => {
                let state = this.state;
                state.categories = response.data.original.categories;
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

    }
}

class CategoryItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let name = this.props.name
        return (
            <div onClick={this.props.changeCategory}>
                {this.props.name}
            </div>
        )
    }
}
