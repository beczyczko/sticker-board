import * as PIXI from 'pixi.js';
import { MouseButton } from './MouseButton';
import Board from './Board';

const permittedScaleRange = { min: 0.05, max: 2 };
let dragData: any;
let cursorMoveData: any;
let lastClickPositionOnStage: { x: number, y: number } = { x: 0, y: 0 };
let boardDragStartPositionOnStage: { x: number, y: number } = { x: 0, y: 0 };

export function subscribeToScrollEvents(board: Board) {
    const boardContainer = board.container;
    let ctrlKeyPressed = false;

    registerMouseEventHandlers(boardContainer);

    const moveBoard = (board: Board, event: any) => {
        const scrollSpeed = 1;
        const positionChange = {
            dx: -event.deltaX * scrollSpeed,
            dy: -event.deltaY * scrollSpeed
        };
        board.move(positionChange);
    };

    // 2017 recommended event
    document.body.addEventListener('wheel', function (event: WheelEvent) {
        if (ctrlKeyPressed) {
            event.preventDefault();
            zoom(board, -event.deltaY);
        } else {
            moveBoard(board, event);
        }
    }, { passive: false } as AddEventListenerOptions);

    // Before 2017, IE9, Chrome, Safari, Opera
    document.body.addEventListener('mousewheel', function (event) {
        moveBoard(board, event); // not tested this case
    }, false);

    // Old versions of Firefox
    document.body.addEventListener('DOMMouseScroll', function (event) {
        moveBoard(board, event); // not tested this case
    }, false);

    document.body.addEventListener('keydown', function (event: KeyboardEvent) {
        ctrlKeyPressed = event.ctrlKey;
    }, false);

    document.body.addEventListener('keyup', function (event: KeyboardEvent) {
        ctrlKeyPressed = false;
    }, false);

    const zoom = (board: Board, zoomDirection: number) => {
        const boardContainer = board.container;

        const cursorPositionBeforeZoom = cursorMoveData.getLocalPosition(boardContainer);

        const actualScale = boardContainer.scale.x;

        zoomDirection = Math.cbrt(zoomDirection);
        const newScale = actualScale * (1 + zoomDirection * 0.05);

        if (newScale < permittedScaleRange.min) {
            board.setScale(permittedScaleRange.min);
        } else if (newScale > permittedScaleRange.max) {
            board.setScale(permittedScaleRange.max);
        } else {
            board.setScale(newScale);
        }

        const cursorPositionAfterZoom = cursorMoveData.getLocalPosition(boardContainer);
        const cursorPositionChange = {
            dx: (cursorPositionAfterZoom.x - cursorPositionBeforeZoom.x) * board.container.scale.x,
            dy: (cursorPositionAfterZoom.y - cursorPositionBeforeZoom.y) * board.container.scale.y
        };

        board.move(cursorPositionChange);
    };

    function onClick(event) {
        lastClickPositionOnStage = event.data.getLocalPosition(boardContainer.parent);

        if (event.data.button === MouseButton.middle) {
            onDragStart(event);
        }
    }

    function onDragStart(event) {
        boardDragStartPositionOnStage = {
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

    function onDragMove(event) {
        cursorMoveData = event.data;

        if (dragData) {
            const newPosition = dragData.getLocalPosition(boardContainer.parent);
            const mouseMove = {
                x: newPosition.x - lastClickPositionOnStage.x,
                y: newPosition.y - lastClickPositionOnStage.y
            };
            board.moveToPosition({
                x: boardDragStartPositionOnStage.x + mouseMove.x,
                y: boardDragStartPositionOnStage.y + mouseMove.y
            });
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
            .on('mousemove', e => onDragMove(e))
            .on('touchmove', e => onDragMove(e));
    }
}

