import React from "react";
//import S from "./ModalWindow.module.css";
import S from "../ModalWindow/ModalWindow.module.css";
import axios from "axios";
//import ModalWindowDropdown from "./ModalWindowDropdown/ModalWindowDropdown";
//import ModalDragAndDrop from "./ModalDragAndDrop/ModalDragAndDrop";
import store from "../store";

const MODAL_ADD_PRODUCT = "MODAL_ADD-PRODUCT";
const EDIT_PRODUCT = "EDIT-PRODUCT";
const EDIT_CATEGORIES = "EDIT-CATEGORIES";
const EDIT_CATEGORY = "EDIT-CATEGORY";
const ADD_CATEGORY = "ADD-CATEGORY";

const ReduxModal = (props) => {
    let state = store.getState();
    let modal = state.modal;
    console.log(15, state)
    console.log("props=", props)
    switch (modal.action) {
        case MODAL_ADD_PRODUCT: {
            return (
                <div className={S.modal}>
                    <div className={S.modalContent}>
                        <div className={S.modalHeader}>
                            <div className={S.headerText}>
                                Новый товар
                            </div>
                            <div className={S.modalClose} onClick={() => (props.modalClose())}>x</div>
                        </div>
                        <div className={S.modalBody}>
                            <form method="POST">
                                <input
                                    name="name" type="text"
                                    placeholder="Название товара"/>
                                <input
                                    name="art" type="text" placeholder="Артикул"/>

                                <input
                                    name="price" type="text" placeholder="Цена"/>

                                <input className={S.input} name="description"
                                       type="text" placeholder="Описание"/>
                                <button className={S.button} type="submit">Добавить</button>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
        default:
            return <></>
    }
}

export default ReduxModal;
