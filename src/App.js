import React, {useEffect} from 'react';
import './App.css';

function App() {

    useEffect(() => {
        const c = document.getElementById('board-canvas');
        const ctx = c.getContext('2d');
        ctx.font = '30px Arial';
        ctx.fillText('Hello World', 50, 50);
    }, []);

    return (
        <div className="App">
            <canvas id="board-canvas" width="800" height="600">
                Your browser does not support the HTML5 canvas tag.
            </canvas>
        </div>
    );
}

export default App;
