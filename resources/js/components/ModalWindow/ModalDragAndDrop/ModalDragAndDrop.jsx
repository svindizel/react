import React, {Component} from "react";
import S from "./ModalDragAndDrop.module.css";

export default class ModalDragAndDrop extends Component {
    constructor(props) {
        super(props);
    }



    dragStartHandler = (e, categoryItem) => {
        console.log("drag", categoryItem)
    }

    dragLeaveHandler = (e) => {

    }

    dragEndHandler = (e) => {

    }

    dragOverHandler = (e) => {
        e.preventDefault();
    }

    dropHandler = (e) => {
        e.preventDefault();
    }

    renderCategoryItems = () => {
        let categories = this.props.categories;
        return categories.map(categoryItem =>
            <div
                className={S.category}
                draggable={true}
                onDragStart={(e) => this.dragStartHandler(e, categoryItem)}
                onDragLeave={(e) => this.dragLeaveHandler(e, categoryItem)}
                onDragEnd={(e) => this.dragEndHandler(e, categoryItem)}
                onDragOver={(e) => this.dragOverHandler(e, categoryItem)}
                onDrop={(e) => this.dropHandler(e, categoryItem)}
                name={categoryItem.name}
                key={categoryItem.id}
            >
                {categoryItem.name}
            </div>
        )
    }

    render() {
        return (
            <div className={S.dragNdrop}>
                {this.renderCategoryItems()}
            </div>
        )
    }
}

class CategoryItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={S.category}>
                {this.props.name}
            </div>
        )
    }
}
