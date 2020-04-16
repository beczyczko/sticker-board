import Board from './Board';
import { cursorPosition, cursorPositionValue, mouseUp } from '../services/MouseService';
import { Subscription } from 'rxjs';
import { Position } from './Position';
import { setBoardScale } from './BoardScaleService';

const permittedScaleRange = { min: 0.05, max: 2 };
let isDragging: boolean;
let lastClickPosition: Position = { x: 0, y: 0 };
let boardDragStartPositionOnStage: Position = { x: 0, y: 0 };

export function subscribeToScrollEvents(board: Board) {

    let cursorSubscriptions = new Array<Subscription>();

    const boardHtmlLayer = board.boardHtmlLayer;
    let ctrlKeyPressed = false;

    addCursorMoveEventListeners();

    const moveBoard = (board: Board, event: any) => {
        const scrollSpeed = 1;
        const positionChange = {
            dx: -event.deltaX * scrollSpeed,
            dy: -event.deltaY * scrollSpeed
        };
        board.move(positionChange);
    };

    // 2017 recommended event
    boardHtmlLayer?.addEventListener('wheel', function (event: WheelEvent) {
        if (ctrlKeyPressed) {
            event.preventDefault();
            zoom(board, -event.deltaY);
        } else {
            moveBoard(board, event);
        }
    }, { passive: false } as AddEventListenerOptions);

    // Before 2017, IE9, Chrome, Safari, Opera
    boardHtmlLayer?.addEventListener('mousewheel', function (event) {
        moveBoard(board, event); // not tested this case
    }, false);

    // Old versions of Firefox
    boardHtmlLayer?.addEventListener('DOMMouseScroll', function (event) {
        moveBoard(board, event); // not tested this case
    }, false);

    document.body.addEventListener('keydown', function (event: KeyboardEvent) {
        ctrlKeyPressed = event.ctrlKey;
    }, false);

    document.body.addEventListener('keyup', function (event: KeyboardEvent) {
        ctrlKeyPressed = false;
    }, false);

    const zoom = (board: Board, zoomDirection: number) => {
        const cursorPositionOnBoardBeforeZoom = cursorBoardPosition();

        const actualScale = board.scale;

        zoomDirection = Math.cbrt(zoomDirection);
        const newScale = actualScale * (1 + zoomDirection * 0.05);

        if (newScale < permittedScaleRange.min) {
            board.setScale(permittedScaleRange.min);
        } else if (newScale > permittedScaleRange.max) {
            board.setScale(permittedScaleRange.max);
        } else {
            board.setScale(newScale);
        }

        setBoardScale(board.scale);

        const cursorPositionOnBoardAfterZoom = cursorBoardPosition();

        const cursorPositionChange = {
            dx: (cursorPositionOnBoardAfterZoom.x - cursorPositionOnBoardBeforeZoom.x) * board.scale,
            dy: (cursorPositionOnBoardAfterZoom.y - cursorPositionOnBoardBeforeZoom.y) * board.scale
        };

        board.move(cursorPositionChange);
    };

    function cursorBoardPosition(): Position {
        const cursorPosition = cursorPositionValue();
        return board.positionOnBoard(cursorPosition);
    }

    board.middleButtonClicked$.subscribe(() => {
        lastClickPosition = cursorPositionValue();
        onDragStart();
    });

    function addCursorMoveEventListeners(): void {
        cursorSubscriptions.push(cursorPosition().subscribe(position => onDragMove(position)));
        cursorSubscriptions.push(mouseUp().subscribe(() => onDragEnd()));
    }

    function onDragStart() {
        if (boardHtmlLayer) {
            isDragging = true;
            boardHtmlLayer.style.cursor = 'all-scroll';

            boardDragStartPositionOnStage = {
                x: board.position.x,
                y: board.position.y
            } as Position;
        }
    }

    function onDragEnd() {
        isDragging = false;
        if (boardHtmlLayer) {
            boardHtmlLayer.style.cursor = 'default';
        }
    }

    function onDragMove(position: Position) {
        if (isDragging) {
            const mouseMove = {
                x: position.x - lastClickPosition.x,
                y: position.y - lastClickPosition.y
            };
            board.moveToPosition({
                x: boardDragStartPositionOnStage.x + mouseMove.x,
                y: boardDragStartPositionOnStage.y + mouseMove.y
            });
        }
    }
}

