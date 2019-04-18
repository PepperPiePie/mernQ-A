import React, {Component} from 'react';
import { Link } from "react-router-dom";

class QuestionList extends Component {

    render() {
        let list = [];

        this.props.questions.forEach((elm) => {
            list.push(<li key={elm.title}>
                <Link className="link" to={`/questions/${elm._id}`}>{elm.title}</Link>
            </li>)
        });

        return (
            <div>
                <h3 className="header text">{this.props.header}</h3>
                <ul className="question-list">
                    {list}
                </ul>
                <Link className="button" id="add" to={'/questions/add'}>Add new question</Link>
            </div>
        );
    }
}

export default QuestionList;
