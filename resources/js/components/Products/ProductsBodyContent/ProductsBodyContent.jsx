import React, {Component} from "react";
import S from "../Products.module.css";
import ProductsTable from "./ProductsTable/ProductsTable";

export default class ProductsBodyContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className={S.bodyContent}>
                    <div className={S.bodyHeader}>
                        <div className={S.bodyHeaderText}>
                            {this.props.currentCategory}
                        </div>
                        <div className={S.button} onClick={this.props.addProduct}>
                            Новый товар
                        </div>
                    </div>
                    <ProductsTable
                        editProduct={this.props.editProduct}
                        deleteProduct={this.props.deleteProduct}
                        currentCategory={this.props.currentCategory}
                        products={this.props.products}
                    />
                </div>
            </>
        )
    }
}

class ContentHeader extends Component{
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <>
            </>
        )
    }

}
