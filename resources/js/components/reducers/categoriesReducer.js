import axios from "axios";

const EDIT_CATEGORY = "EDIT_CATEGORY";
const ADD_CATEGORY = "ADD_CATEGORY";
const DELETE_CATEGORY = "DELETE_CATEGORY";
const SWITCH_CATEGORY = "SWITCH_CATEGORY";
const GET_CATEGORIES = "GET_CATEGORIES";

let initialState = {
    categories: [],
    currentCategory: ''
}

export default function categoriesReducer(state = initialState, action) {
    switch (action.type) {
        case EDIT_CATEGORY:
            axios
                .post("http://react/api/editCategory", action.payload)
                .then((response) => {
                    return {
                        ...state,
                        categories: response.data.original
                    }
                })
        case ADD_CATEGORY:
            axios
                .post("http://react/api/addCategory", action.payload)
                .then((response) => {
                    return {
                        ...state,
                        categories: response.data.original
                    }
                })
        case DELETE_CATEGORY:
            axios
                .post("http://react/api/deleteCategory", action.payload)
                .then((response) => {
                    return {
                        ...state,
                        categories: response.data.original
                    }
                })
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
                currentCategory: action.payload[0].name
            }
        default:
            return state
    }
}

export const editCategoryActionCreator = (data) => ({type:EDIT_CATEGORY, payload:data});
export const addCategoryActionCreator = (data) => ({type:ADD_CATEGORY, payload:data});
export const switchCategoryActionCreator = (data) => ({type:SWITCH_CATEGORY, payload:data});
export const deleteCategoryActionCreator = (data) => ({type:DELETE_CATEGORY, payload:data});
export const getCategoriesActionCreator = (data) => ({type:GET_CATEGORIES, payload:data});
