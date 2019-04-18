import React, {Component} from 'react';
import {Link} from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';


library.add(faEdit);
library.add(faHome);

class Question extends Component {

    render() {
        let question = this.props.question;
        let list = [];

        question.tags.forEach((elm) => {
            list.push(<li key={elm}>
                <Link className="tag" to={`/questions/with/${elm}`}>{elm}</Link>
            </li>)
        });

        // let difficulty = 'easy';
        // if (recipe.prep_time > 20) {
        //     difficulty = 'hard';
        // }

        return (
            <div>
                <div id="description">
                    <div id='question_header'>
                        <h3 id="title">{question.title}</h3>
                        <Link className="edit" to={`/questions/edit/${question._id}`}><FontAwesomeIcon icon="edit" /></Link>
                    </div>
                    <p>{question.description}</p>
                    {/*<p><span>Difficulty:</span> {difficulty}</p>*/}
                </div>

                <p className="likes">Tags</p>
                <ul className="tag-list">
                    {list}
                </ul>

                <div id='navigation'>
                <Link className="back" to='/'><FontAwesomeIcon icon="home" /></Link>
                </div>
            </div>
        );
    }
}

export default Question;
