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

    const moveBoard = (board: PIXI.Container, event: any) => {
        const scrollSpeed = 1;
        board.position.x -= event.deltaX * scrollSpeed;
        board.position.y -= event.deltaY * scrollSpeed;
    };

    // 2017 recommended event
    document.body.addEventListener('wheel', function (event: WheelEvent) {
        if (ctrlKeyPressed) {
            event.preventDefault();
            zoom(boardContainer, -event.deltaY);
        } else {
            moveBoard(boardContainer, event);
        }
    }, { passive: false } as AddEventListenerOptions);

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

    const zoom = (board: PIXI.Container, zoomDirection: number) => {
        const cursorPositionBeforeZoom = cursorMoveData.getLocalPosition(boardContainer);

        const boardScale = board.scale;
        const actualScale = boardScale.x;

        zoomDirection = Math.cbrt(zoomDirection);
        const newScale = actualScale * (1 + zoomDirection * 0.05);

        if (newScale < permittedScaleRange.min) {
            boardScale.set(permittedScaleRange.min);
        } else if (newScale > permittedScaleRange.max) {
            boardScale.set(permittedScaleRange.max);
        } else {
            boardScale.set(newScale);
        }
        boardContainer.updateTransform();

        const cursorPositionAfterZoom = cursorMoveData.getLocalPosition(boardContainer);
        const cursorPositionChange = {
            x: cursorPositionAfterZoom.x - cursorPositionBeforeZoom.x,
            y: cursorPositionAfterZoom.y - cursorPositionBeforeZoom.y
        };

        boardContainer.position.set(
            boardContainer.position.x + cursorPositionChange.x * boardContainer.scale.x,
            boardContainer.position.y + cursorPositionChange.y * boardContainer.scale.y,
        );
        boardContainer.updateTransform();
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
            boardContainer.position.x = boardDragStartPositionOnStage.x + mouseMove.x;
            boardContainer.position.y = boardDragStartPositionOnStage.y + mouseMove.y;
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

