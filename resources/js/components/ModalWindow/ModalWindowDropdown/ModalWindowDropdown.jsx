import React, {Component} from "react";
import S from "./ModalWindowDropdown.module.css";

export default class ModalWindowDropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDropdownActive: false,
            isCategoryChanged: false,
            isUnitChanged: false,
            newUnit: null,
            newCategory: null,
        }
    }

    showDropdown = () => {
        let state = this.state;
        if (state.isDropdownActive) {
            state.isDropdownActive = false;
        } else {
            state.isDropdownActive = true;
        }
        this.setState(state);
    }

    changeUnit = (unit) => {
        let state = this.state;
        state.isUnitChanged = true;
        state.newUnit = unit;
        this.setState(state);
    }

    renderUnitList = () => {
        console.log(this.props.units)
        let units = this.props.units.map(unit =>
            <UnitsItem
                showDropdown={this.showDropdown}
                changeUnit={this.changeUnit}
                chooseUnit={this.props.chooseUnit}
                name={unit.name}
                id={unit.id}
                key={unit.id}
            />
        )
        return units
    }

    changeCategory = (category) => {
        let state = this.state;
        state.isCategoryChanged = true;
        state.newCategory = category;
        this.setState(state)
    }

    renderCategoryList = () => {
        let categories = this.props.categories.map(category =>
            <CategoryItem
                showDropdown={this.showDropdown}
                changeCategory={this.changeCategory}
                chooseCategory={this.props.chooseCategory}
                name={category.name}
                id={category.id}
                key={category.id}
            />
        )
        return categories
    }

    render() {
        console.log(this.props)
        if (this.props.isCategory) {
            return (
                <>
                    <div className={S.input}>
                        <div>{this.state.isCategoryChanged ? this.state.newCategory : this.props.currentCategory}</div>
                        <div onClick={this.showDropdown}>-></div>
                    </div>
                    <div className={this.state.isDropdownActive ? S.categoryList : S.hidden}>
                        {this.renderCategoryList()}
                    </div>
                </>
            )
        } else {
            return (
                <>
                    <div className={S.input}>
                        <div>{this.state.isUnitChanged ? this.state.newUnit : this.props.currentUnit}</div>
                        <div onClick={this.showDropdown}>-></div>
                    </div>
                    <div className={this.state.isDropdownActive ? S.categoryList : S.hidden}>
                        {this.renderUnitList()}
                    </div>
                </>
            )
        }
    }
}

class CategoryItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                onClick={() => {
                    this.props.chooseCategory(this.props.name, this.props.id);
                    this.props.showDropdown();
                    this.props.changeCategory(this.props.name)
                }}>
                {this.props.name}
            </div>
        )
    }
}

class UnitsItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                category_id={this.props.id}
                onClick={() => {
                    this.props.chooseUnit(this.props.name, this.props.id);
                    this.props.showDropdown();
                    this.props.changeUnit(this.props.name);
                }}
            >
                {this.props.name}
            </div>
        )
    }
}
