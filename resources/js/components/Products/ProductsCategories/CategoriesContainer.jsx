import store from "../../store";
import {connect} from "react-redux";
import ProductsCategories from "./ProductsCategories";
import {
    editCategoryActionCreator,
    addCategoryActionCreator,
    switchCategoryActionCreator,
    deleteCategoryActionCreator,
    getCategoriesActionCreator
} from "../../reducers/categoriesReducer";
import {getCategoryProductsActionCreator} from "../../reducers/productsReducer";
import axios from "axios";

let mapStateToProps = (state) => {
    return {
        categories: state.categories
    }
}

let mapDispatchToProps = () => {
    return {
        editCategory: () => {
            store.dispatch(editCategoryActionCreator());
        },
        addCategory: () => {
            store.dispatch(addCategoryActionCreator());
        },
        switchCategory: () => {
            store.dispatch(switchCategoryActionCreator());
        },
        deleteCategory: () => {
            store.dispatch(deleteCategoryActionCreator());
        },
        getCategories: () => {
            axios
                .get("http://react/api/products/addictions")
                .then((response) => {
                    let categories = response.data.original.categories;
                    store.dispatch(getCategoriesActionCreator(categories));
                })

        },
        getCategoryProducts: (categoryId) => {
            store.dispatch(getCategoryProductsActionCreator(categoryId))
        }
    }
}

const CategoriesContainer = connect(mapStateToProps, mapDispatchToProps)(ProductsCategories);

export default CategoriesContainer;
