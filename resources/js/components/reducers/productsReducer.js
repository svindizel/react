import axios from "axios";

const GET_PRODUCTS = "GET_PRODUCTS";
const ADD_PRODUCT = "ADD_PRODUCT";
const GET_CATEGORY_PRODUCTS = "GET_CATEGORY_PRODUCTS";

const initialState = {
    products: [],
    items: [],
    test: 0
}

export default function productsReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PRODUCTS:
            return {
                ...state,
                products: action.payload
            }
        case ADD_PRODUCT:
            axios
                .post("http://react/api/addProduct", action.payload)
                .then((response) => {
                    return {
                        ...state,
                        products: response.data.original
                    }
                })
        case GET_CATEGORY_PRODUCTS:
            axios
                .post("http://react/api/products/all", {category_id:action.payload})
                .then((response) => {
                    return {
                        ...state,
                        products: response.data.original
                    }
                })
        default:
            return state
    }
}

export const getProductsActionCreator = (products) => ({type:GET_PRODUCTS, payload:products});
export const addProductActionCreator = (productData) => ({type:ADD_PRODUCT, payload:productData});
export const getCategoryProductsActionCreator = (category) => ({type:GET_CATEGORY_PRODUCTS, payload:category});
