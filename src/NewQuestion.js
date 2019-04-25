import React, {Component} from 'react';
import {Link} from "react-router-dom";

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';


library.add(faHome);

class NewQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: []
        };
    }

    addQuestion = (e) => {
        e.preventDefault();

        this.setState({
            input: {
                title: this.refs.title.value,
                description: this.refs.description.value,
                tags: this.refs.tags.value.split(", "),
                answers: []}
        }, function () {
            console.log({...this.state.input});
            this.props.addData(this.state.input);
        });


        // nullyfying value after submitting
        this.refs.title.value = null;
        this.refs.description.value = null;
        this.refs.tags.value = null;
    };

    render() {

        return(
            <div>
                <form onSubmit={this.addQuestion}>
                    <fieldset>
                        <legend>New question</legend>

                        <input ref='title' type='text' placeholder='Title for your question'/>
                        <textarea ref='description' id='input_question' placeholder='What is your question'/>
                        <input ref='tags' type='text' placeholder='List of tags' onChange={this.onChange}/>

                        <button className="button" type='submit'>Add new question</button>
                    </fieldset>
                </form>

                <div id='navigation'>
                    <Link className="back" to='/'><FontAwesomeIcon icon="home" /></Link>
                </div>
            </div>
        )
    }
}

export default NewQuestion;