import React, {Component} from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp} from '@fortawesome/free-solid-svg-icons';

library.add(faThumbsUp);

class Vote extends Component {
    constructor(props) {
        super(props);

        this.state = { input: [] };
    }

    vote = (e) => {
        e.preventDefault();

        this.setState({
            input: {
                ref_id: this.props.id,
                likes: this.props.likes + 1
            }
        }, function () {
            console.log({...this.state.likes});
            this.props.addVote(this.state.input);
        });
    };

    render() {
        return(
        <div>
            <button onClick={this.vote}><FontAwesomeIcon className="like" icon="thumbs-up" /></button>
        </div>
        )
    }
}

export default Vote;
