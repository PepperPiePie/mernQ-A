import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles/style.css';
// import logo from './logo.svg';

import QuestionList from "./QuestionList";
import Question from "./Question";
import NewQuestion from "./NewQuestion";
import EditQuestion from "./EditQuestion";
import NotFound from "./NotFound";

class App extends Component {

    constructor(props) {
        super(props);

        // TODO: Move this data to the server
        this.state = {
            questions: []
        }
    }

    componentDidMount() {
        console.log("App component has mounted");
        this.getData();
    }

    getData() {
        fetch('http://localhost:8080/questions')
            .then(response => response.json()) // Turn into JSON     )
            .then(questions => this.setState({ questions: questions }))

    }

    addQuestionData(text) {
        fetch('http://localhost:8080/questions', {
            method: 'POST',
            body: JSON.stringify({
                title: text.title,
                description: text.description,
                tags: text.tags
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting a new question:");
                console.log(json);
            });
    }

    addAnswerData(text) {
        fetch('http://localhost:8080/questions/'+ text.ref_id +'/answer', {
            method: 'PUT',
            body: JSON.stringify({
                    author: text.author,
                    content: text.content,
                    likes: text.likes
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of posting a new answer:");
                console.log(json);
            });
    }

    addVote(text) {
        fetch('http://localhost:8080/questions/'+ text.ref_id +'/answer/like', {
            method: 'PUT',
            body: JSON.stringify({
                id: text.id,
                likes: text.likes
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of voting:");
                console.log(json);
            });
    }

    editData(text) {
        fetch('http://localhost:8080/questions/'+ text._id, {
            method: 'PUT',
            body: JSON.stringify({
                title: text.title,
                description: text.description,
                tags: text.tags
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.json())
            .then(json => {
                console.log("Result of editing the question:");
                console.log(json);
            });
    }


    getQuestionFromId(id) {
        return this.state.questions.find((elm) => elm._id === id);
    }
    filterByTag(tag) {
        return this.state.questions.filter((elm) => elm.tags.includes(tag))
    }

    render() {
        return (
            <Router>
                <div className="container">
                    {/*<img src={logo} className="logo" alt="logo" />*/}
                    <h1 className="text">Q & A</h1>

                    <Switch>
                        <Route exact path={'/'}
                               render={(props) =>
                                   <QuestionList {...props}
                                         questions={this.state.questions}
                                         header={'All questions'}/>}
                        />

                        <Route exact path={'/questions/add'}
                               render={(props) => <NewQuestion {...props}
                                         addQuestionData={this.addQuestionData}/>}
                        />

                        <Route exact path={'/questions/:id'}
                               render={(props) => <Question {...props}
                                        question={this.getQuestionFromId(props.match.params.id)}
                                        addAnswerData={this.addAnswerData}
                                        addVote={this.addVote}/>}
                        />

                        <Route exact path={'/questions/edit/:id'}
                               render={(props) => <EditQuestion {...props}
                                        question={this.getQuestionFromId(props.match.params.id)}
                                        editData={this.editData}/>}
                        />

                        <Route exact path={'/questions/with/:tag'}
                               render={(props) => <QuestionList {...props}
                                        questions={this.filterByTag(props.match.params.tag)}
                                        header={`Question with ${props.match.params.tag}`}/>}
                        />

                        <Route component={NotFound} />
                    </Switch>

                </div>
            </Router>
        );
    }
}

export default App;
