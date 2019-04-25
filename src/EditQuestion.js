import React, {Component} from 'react';
import {Link} from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faHome);
library.add(faArrowLeft);

class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: []
        };
    }

    editQuestion = (e) => {
        e.preventDefault();
        let question = this.props.question;
        this.setState({
            input: {
                _id: question._id,
                title: this.refs.title.value ? this.refs.title.value : question.title,
                description: this.refs.description.value ? this.refs.description.value : question.description,
                tags: this.refs.tags.value ? this.refs.tags.value.split(", ") : question.tags}
        }, function () {
            console.log({...this.state.input});
            this.props.editData(this.state.input);
        });


        // nullyfying value after submitting
        this.refs.title.value = null;
        this.refs.description.value = null;
        this.refs.tags.value = null;
    };

    render() {

        let question = this.props.question;

        return(
            <div>
                <form onSubmit={this.editQuestion}>
                    <fieldset>
                        <legend>Edit question</legend>

                        <input ref='title' placeholder={question.title}/>
                        <textarea ref='description' placeholder={question.description}/>
                        <input ref='tags' placeholder={question.tags} onChange={this.onChange}/>

                        <button className="button" type='submit'>Send update</button>
                    </fieldset>
                </form>
                <div id='navigation'>
                    <Link className="back" to={`/questions/${question._id}`}><FontAwesomeIcon icon="arrow-left" /></Link>
                    <Link className="back" to='/'><FontAwesomeIcon icon="home" /></Link>
                </div>
            </div>
        )
    }
}

export default EditQuestion;