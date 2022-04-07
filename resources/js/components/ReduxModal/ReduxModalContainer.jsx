import store from "../store";
import {connect, useDispatch} from "react-redux";
import ReduxModal from "./ReduxModal";
import {modalClose} from "../reducers/modalReducer";

let mapStateToProps = (state) => {
    return {
        modal: state.modal
    }
}

let mapDispatchToProps = () => {
    return {
        modalClose: () => {
            let action = modalClose();
            store.dispatch(action);
        }
    }
}

const ReduxModalContainer = connect(mapStateToProps, mapDispatchToProps)(ReduxModal);

export default ReduxModalContainer;
