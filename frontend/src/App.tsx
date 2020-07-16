import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { BoardComponent } from './board/BoardComponent';
import Login from './authentication/Login';

function App() {
    return (
        <Router>
            <div className="App">
                <Route exact={true} path="/" component={BoardComponent}/>
                <Route path="/login" component={Login}/>
            </div>
        </Router>
    );
}

export default App;
