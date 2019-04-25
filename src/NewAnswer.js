import React, {Component} from 'react';


class NewAnswer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            input: []
        };
    }

    addAnswer = (e) => {
        e.preventDefault();

        this.setState({
            input: {
                ref_id: this.props.id,
                author: this.refs.author.value,
                content: this.refs.content.value,
                likes: 0}
        }, function () {
            console.log({...this.state.input});
            this.props.addAnswerData(this.state.input);
        });


        // nullyfying value after submitting
        this.refs.author.value = null;
        this.refs.content.value = null;
    };

    render() {

        return(
            <div className="answer_form">
                <form onSubmit={this.addAnswer}>
                        <p>Your answer</p>

                        <input ref='author' type='text' placeholder='Write your name'/>
                        <textarea ref='content' id='input_question' placeholder='Write your answer'/>

                        <button className="button" type='submit'>Add new answer</button>
                </form>
            </div>
        )
    }
}

export default NewAnswer;