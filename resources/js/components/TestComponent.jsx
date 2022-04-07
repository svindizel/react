import React from "react";
import {useDispatch} from "react-redux";
import {getProducts} from "./reducers/productsReducer";
import {modalAddProduct} from "./reducers/modalReducer";

export default function TestComponent(props) {
    const dispatch = useDispatch();
    function onGetProductsHandler() {
        let products = {};
        axios
            .get("http://react/api/products/all")
            .then((response) => {
                products = response.data.original
                dispatch(getProducts(products));
            });
    }
    function onAddProductHandler() {
        dispatch(modalAddProduct("MODAL_ADD-PRODUCT"));
    }
    return (
        <>
            <div>
                <button onClick={()=>{onGetProductsHandler()}}>
                    click
                </button>
            </div>
            <div>
                <button onClick={()=>{onAddProductHandler()}}>
                    click
                </button>
            </div>
        </>


    );
};
