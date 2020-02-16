import React, {useEffect, useState} from 'react';
import './App.css';

function App() {

    const [canvasLoaded] = useState(true);
    const [canvas, setCanvas] = useState(null);
    const [ctx, setCtx] = useState(null);
    const [selectedSticker, setSelectedSticker] = useState(null);
    const [dragItemOffsetPosition, setDragItemOffsetPosition] = useState(null);

    //todo db split this file, it's POC mess
    const [stickers, setStickers] = useState([
        {
            id: '1',
            text: 'long text try to wrap it with pretty way',
            x: 100,
            y: 40,
            width: 120,
            height: 120,
        },
        {
            id: '2',
            text: 'funny little sticker',
            x: 250,
            y: 80,
            width: 120,
            height: 120,
        },
        {
            id: '3',
            text: 'long German word rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz',
            x: 450,
            y: 20,
            width: 240,
            height: 120,
        },
    ]);

    function printStickerText(context, text, x, y, lineHeight, fitWidth) {
        //todo db handle long words
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

    function createSticker(context, text, x, y, width, height) {
        context.fillStyle = '#fbfb57';
        context.fillRect(x, y, width, height);

        printStickerText(context, text, x + 10, y + 22, 20, 80);
    }

    function redrawCanvas() {
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stickers.forEach(s => {
                createSticker(ctx, s.text, s.x, s.y, s.width, s.height);
            })
        }
    }

    useEffect(() => {
        redrawCanvas();
    }, [stickers]);

    useEffect(() => {
        const canvas = document.getElementById('board-canvas');
        setCanvas(canvas);
        setCtx(canvas.getContext('2d'));
    }, [canvasLoaded])

    useEffect(() => {
        redrawCanvas();
    }, [ctx]);

    function selectElementOnPosition(x, y) {
        //todo db should find sticker that is on top
        const sticker = stickers.find(s =>
            (s.x <= x && (s.x + s.width) >= x)
            && (s.y <= y && (s.y + s.height) >= y));
        setSelectedSticker(sticker);

        if (sticker) {
            setDragItemOffsetPosition({
                x: x - sticker.x,
                y: y - sticker.y,
            });
        }
    }

    function onMouseDown(e) {
        selectElementOnPosition(e.nativeEvent.x, e.nativeEvent.y);
    }

    function onMouseUp(e) {
        setSelectedSticker(null);
        setDragItemOffsetPosition(null);
    }

    function onMouseMove(e) {
        if (selectedSticker) {
            selectedSticker.x = e.pageX - dragItemOffsetPosition.x;
            selectedSticker.y = e.pageY - dragItemOffsetPosition.y;
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
