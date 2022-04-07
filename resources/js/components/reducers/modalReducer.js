const MODAL_ADD_PRODUCT = "MODAL_ADD-PRODUCT";
const MODAL_CLOSE = "MODAL_CLOSE";

let initialState = {
    action: null,
    items: []
};

export default function modalReducer(state = initialState, action) {
    switch (action.type) {
        case MODAL_ADD_PRODUCT:
            return {
                ...state,
                action: action.payload
            }
        case MODAL_CLOSE:
            return {
                ...state,
                action: null
            }
        default:
            return state
    }
}

export const modalAddProduct = (action) => ({type: MODAL_ADD_PRODUCT, payload: action});
export const modalClose = () => ({type: MODAL_CLOSE});


