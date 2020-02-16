import React, {useEffect} from 'react';
import './App.css';

function App() {

    function printStickerText(context, text, x, y, lineHeight, fitWidth) {
        //coppied from https://stackoverflow.com/questions/5026961/html5-canvas-ctx-filltext-wont-do-line-breaks
        context.fillStyle = 'black';
        context.font = '16px Arial';

        fitWidth = fitWidth || 0;

        if (fitWidth <= 0) {
            context.fillText(text, x, y);
            return;
        }

        let words = text.split(' ');
        let currentLine = 0;
        let idx = 1;
        while (words.length > 0 && idx <= words.length) {
            const str = words.slice(0, idx).join(' ');
            const w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
                currentLine++;
                words = words.splice(idx - 1);
                idx = 1;
            } else {
                idx++;
            }
        }
        if (idx > 0)
            context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
    }

    function createSticker(context, text, x, y) {
        const width = 100;
        const height = 100;
        context.fillStyle = '#fbfb57';
        context.fillRect(x, y, width, height);

        printStickerText(context, text, x + 10, y + 22, 20, 80);
    }

    useEffect(() => {
        const c = document.getElementById('board-canvas');
        const context = c.getContext('2d');
        createSticker(context,'long text try to wrap it with pretty way', 100, 40);
    }, []);

    return (
        <div className="App">
            <canvas id="board-canvas" width="800" height="600">
                Your browser does not support the HTML5 canvas tag.
            </canvas>
            <div id="test-event-sticker" className="sticker">Event sticker</div>
        </div>
    );
}

export default App;
