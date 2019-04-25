import React, {Component} from 'react';
import {Link} from "react-router-dom";

import NewAnswer from './NewAnswer';
import Vote from './Vote';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';


library.add(faEdit);
library.add(faHome);

class Question extends Component {

    render() {
        let question = this.props.question;
        let tag_list = [];
        let answer_list = [];

        if (question.tags !== undefined) {
            question.tags.forEach((elm) => {
                tag_list.push(<li key={elm}>
                    <Link className="tag" to={`/questions/with/${elm}`}>{elm}</Link>
                </li>)
        })};


        if (question.answers !== undefined) {
            if (question.answers.length >= 1) {
                question.answers.forEach((elm) => {
                    answer_list.push(
                        <div className="answer" key={elm}>
                            <div>
                                <p>{elm.content}</p>
                                <div className="answer_footer">
                                    <span>Author: {elm.author}</span>
                                    <span>Likes: {elm.likes}</span>
                                </div>
                            </div>
                            <Vote likes={elm.likes} id={question._id} addVote={this.props.addVote}/>
                        </div>
                    )
        })}};

        return (
            <div>
                <div id="description">
                    <div id='question_header'>
                        <h3 id="title">{question.title}</h3>
                        <Link className="edit" to={`/questions/edit/${question._id}`}><FontAwesomeIcon icon="edit" /></Link>
                    </div>
                    <p>{question.description}</p>
                </div>

                {answer_list}

                <p className="likes">Tags</p>
                <ul className="tag-list">
                    {tag_list}
                </ul>

                <NewAnswer addAnswerData={this.props.addAnswerData} id={question._id}/>

                <div id='navigation'>
                <Link className="back" to='/'><FontAwesomeIcon icon="home" /></Link>
                </div>
            </div>
        );
    }
}

export default Question;
