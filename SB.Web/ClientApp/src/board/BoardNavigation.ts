import * as PIXI from 'pixi.js';
import { MouseButton } from './MouseButton';
import Board from './Board';

const permittedScaleRange = { min: 0.2, max: 2 };
let dragData: any;
let lastClickStagePosition: { x: number, y: number } = { x: 0, y: 0 };
let boardDragStartPosition: { x: number, y: number } = { x: 0, y: 0 };

export function subscribeToScrollEvents(board: Board) {

    const boardContainer = board.container;
    // todo db don't work with mouse scroll
    let ctrlKeyPressed = false;

    registerMouseEventHandlers(boardContainer);

    const moveBoard = (stage: PIXI.Container, event: any) => {
        const scrollSpeed = 1;
        stage.position.x -= event.deltaX * scrollSpeed;
        stage.position.y -= event.deltaY * scrollSpeed;
    };

    // 2017 recommended event
    document.body.addEventListener('wheel', function (event: WheelEvent) {
        if (ctrlKeyPressed) {
            zoom(boardContainer, event.deltaY);
        } else {
            moveBoard(boardContainer, event);
        }
    }, false);

    // Before 2017, IE9, Chrome, Safari, Opera
    document.body.addEventListener('mousewheel', function (event) {
        moveBoard(boardContainer, event); // not tested this case
    }, false);

    // Old versions of Firefox
    document.body.addEventListener('DOMMouseScroll', function (event) {
        moveBoard(boardContainer, event); // not tested this case
    }, false);

    document.body.addEventListener('keydown', function (event: KeyboardEvent) {
        ctrlKeyPressed = event.ctrlKey;
    }, false);

    document.body.addEventListener('keyup', function (event: KeyboardEvent) {
        ctrlKeyPressed = false;
    }, false);

    const zoom = (stage: PIXI.Container, zoomDirection: number) => {
        const boardScale = stage.scale;
        const actualScale = boardScale.x;

        zoomDirection = Math.cbrt(zoomDirection);
        const newScale = actualScale * (1 + zoomDirection * 0.02);

        if (newScale < permittedScaleRange.min) {
            boardScale.set(permittedScaleRange.min);
        } else if (newScale > permittedScaleRange.max) {
            boardScale.set(permittedScaleRange.max);
        } else {
            boardScale.set(newScale);
        }
    };

    function onClick(event) {
        lastClickStagePosition = event.data.getLocalPosition(boardContainer.parent);

        if (event.data.button === MouseButton.middle) {
            onDragStart(event);
        }
    }

    function onDragStart(event) {
        boardDragStartPosition = {
            x: boardContainer.position.x,
            y: boardContainer.position.y
        };
        dragData = event.data;
        boardContainer.cursor = 'all-scroll';
    }

    function onDragEnd() {
        boardContainer.buttonMode = false;
        dragData = null;
        boardContainer.cursor = 'default';
    }

    function onDragMove() {
        if (dragData) {
            const newPosition = dragData.getLocalPosition(boardContainer.parent);
            const mouseMove = {
                x: newPosition.x - lastClickStagePosition.x,
                y: newPosition.y - lastClickStagePosition.y
            };
            boardContainer.position.x = boardDragStartPosition.x + mouseMove.x;
            boardContainer.position.y = boardDragStartPosition.y + mouseMove.y;
        }
    }

    function registerMouseEventHandlers(board: PIXI.Container) {
        board
            .on('mousedown', e => onClick(e))
            .on('touchstart', e => onDragStart(e))
            // events for drag end
            .on('mouseup', () => onDragEnd())
            .on('mouseupoutside', () => onDragEnd())
            .on('touchend', () => onDragEnd())
            .on('touchendoutside', () => onDragEnd())
            // events for drag move
            .on('mousemove', () => onDragMove())
            .on('touchmove', () => onDragMove());
    }
}

