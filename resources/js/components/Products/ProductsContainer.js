import store from "../store";
import {connect} from "react-redux";
import Products from "./Products";

let mapStateToProps = (state) => {
    return {
        products: state.products
    }
};

const ProductsContainer = connect(mapStateToProps)(Products);

export default ProductsContainer;



