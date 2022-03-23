import React, {Component} from "react";
import S from "../../../Products.module.css";

export default class TableRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={S.tableBody}>
                <div className={S.tableRow}>
                    <div className={S.productName}>{this.props.name}</div>
                    <div className={S.productPrice}>{this.props.price}</div>
                    <div className={S.productMeasureItems}>{this.props.unit}</div>
                    <div className={S.productArticul}>{this.props.art}</div>
                    <div className={S.productSale}></div>
                    <div className={S.productIngredients}>{this.props.description}</div>
                    <div className={S.productStop}>
                        <input type="checkbox"/>
                        <div onClick={() => this.props.editProduct(this.props)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                <path
                                    d="M19.045 7.401c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.88-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"
                                />
                            </svg>
                        </div>
                        <div onClick={() => this.props.deleteProduct(this.props.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                <path
                                    d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"
                                />
                                <path d="M9 10h2v8H9zm4 0h2v8h-2z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
