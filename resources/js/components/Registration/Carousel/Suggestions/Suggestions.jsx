import React, {Component} from "react";
import S from "./Suggestions.module.css";

export default class Suggestions extends Component {
    constructor(props) {
        super(props);

    }
    createList = () => {
        console.log("list")
        console.log(this.props)
        return (
            this.props.suggestions.map(suggestionsListItem =>
                <SuggestionsItem
                    onClick={this.props.companySelectHandler}
                    classname={S.suggestionItem}
                    key={suggestionsListItem.data.inn}
                    name={suggestionsListItem.data.name.short}
                    inn={suggestionsListItem.data.inn}
                />
            )
        )
    }
    render() {
        if(this.props.suggestions.length === 0) {
            return(<></>)
        }
        return (
            <div className={S.suggestions}>
                { this.createList() }
            </div>
        )
    }
}

class SuggestionsItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                onClick={this.props.onClick}
                className={S.suggestionItem}
                name={this.props.name}
                inn={this.props.inn}
            >
                <div>{this.props.name}</div>
                <div>{this.props.inn}</div>
            </div>
        )
    }
}
