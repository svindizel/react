import React, {Component} from "react";
import S from "./NotFound.module.css";

export default class NotFound extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className={S.container}>
                <div className={S.notFound}>
                    <div className={S.message}>
                        <div className={S.error}>
                            404&nbsp;
                        </div>
                        <div className={S.text}>
                            | Запрашиваемая страница не существует
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
