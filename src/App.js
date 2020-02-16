import React, {useEffect, useState} from 'react';
import './App.css';

function App() {

    const [canvasLoaded, setCanvasLoaded] = useState(true);
    const [canvas, setCanvas] = useState(null);
    const [ctx, setCtx] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const [stickers, setStickers] = useState([
        {
            id: '1',
            text: 'long text try to wrap it with pretty way',
            x: 100,
            y: 40,
        },
        {
            id: '2',
            text: 'funny little sticker',
            x: 250,
            y: 80,
        },
    ]);

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
                if (idx === 1) {
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

    function redrawCanvas() {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stickers.forEach(s => {
                createSticker(ctx, s.text, s.x, s.y);
            })
        }
    }

    useEffect(() => {
        if (ctx) {
            redrawCanvas();
        }
    }, [stickers]);

    useEffect(() => {
        const canvas = document.getElementById('board-canvas');
        setCanvas(canvas);
        setCtx(canvas.getContext('2d'));
    }, [canvasLoaded])

    useEffect(() => {
        if (ctx) {
            redrawCanvas();
        }
    }, [ctx]);

    function onMouseDown(e) {
        console.log('mouseDown');
        setIsDragging(true);
        console.log(e);
    }

    function onMouseUp(e) {
        console.log('mouseUp');
        setIsDragging(false);
        console.log(e);
    }

    function onMouseMove(e) {
        if (isDragging) {
            stickers[0].x = e.pageX;
            stickers[0].y = e.pageY;
            redrawCanvas();
        }
    }

    return (
        <div className="App">
            <canvas id="board-canvas" width="800" height="600"
                    onMouseDown={e => onMouseDown(e)}
                    onMouseUp={e => onMouseUp(e)}
                    onMouseMove={e => onMouseMove(e)}>
                Your browser does not support the HTML5 canvas tag.
            </canvas>
            <div id="test-event-sticker" className="sticker">Event sticker</div>
        </div>
    );
}

export default App;
