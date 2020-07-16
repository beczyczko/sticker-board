import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { BoardComponent } from './board/BoardComponent';
import Login from './authentication/Login';

function App() {
//todo db check if authorized
    return (
        <div className="App">
            <Router>
                <Route exact={true} path="/" component={BoardComponent}/>
            </Router>
            <Router>
                <Route path="/login" component={Login}/>
            </Router>
        </div>
    );
}

export default App;
