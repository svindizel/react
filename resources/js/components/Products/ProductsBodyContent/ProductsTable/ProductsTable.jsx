import React, {Component} from "react";
import S from "../../Products.module.css";
import TableRow from "./TableRow/TableRow";

export default class ProductsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCategoryEmpty: false
        }
    }
    componentDidMount() {
        axios
            .get("http://react/api/products/all")
            .then((response) => {
                let products = response.data.original;
                this.setState({products: products});
            })
        /*axios
            .get("http://react/api/products/addictions")
            .then((response) => {

            })*/
    }
    renderProducts = (currentCategory) => {
        if(this.props.currentCategory !== "") {
            let products = this.props.products;
            console.log(this.props)
            let currentProducts = products.filter(productsItem => {
                return productsItem.category === currentCategory
            })
            console.log(currentProducts)
            return currentProducts.map(productsItem =>
                <TableRow
                    isOver={productsItem.isOver}
                    editProduct={this.props.editProduct}
                    deleteProduct={this.props.deleteProduct}
                    key={productsItem.id}
                    id={productsItem.id}
                    art={productsItem.art}
                    description={productsItem.description}
                    name={productsItem.name}
                    price={productsItem.price}
                    unit={productsItem.unit}
                    unit_id={productsItem.unit_id}
                    description={productsItem.description}
                    category={productsItem.category}
                    category_id={productsItem.category_id}
                />
            )
        } else {
            return
        }
    }
    render() {
        if(this.props.products.length > 0) {
            return(
                <>
                    <div className={S.productsTable}>
                        <div className={S.tableHeader}>
                            <div className={S.productName}>????????????????</div>
                            <div className={S.productPrice}>????????</div>
                            <div className={S.productMeasureItems}>????.</div>
                            <div className={S.productArticul}>??????.</div>
                            <div className={S.productSale}>????????????</div>
                            <div className={S.productIngredients}>????????????</div>
                        </div>
                        {this.renderProducts(this.props.currentCategory)}
                    </div>
                </>
            )
        } else {
            //if(this.props.products.map(product => product.category) !== this.props.currentCategory) {
                return (
                    <>
                        <div className={S.productsTable}>
                            ?? ???????????? ?????????????????? ???????? ?????? ??????????????
                        </div>
                    </>
                )
            //}

        }

    }
}
