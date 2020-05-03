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

    addCursorMoveEventListeners();

    const moveBoard = (board: Board, event: any) => {
        const scrollSpeed = 1;
        const positionChange = {
            dx: -event.deltaX * scrollSpeed,
            dy: -event.deltaY * scrollSpeed
        };
        board.move(positionChange);
    };

    function navigateOnBoard(e) {
        if (e.ctrlKey) {
            e.preventDefault();
            zoom(board, -e.deltaY);
        } else {
            moveBoard(board, e);
        }
    }

    document.addEventListener("wheel", navigateOnBoard, { passive: false });

    // Before 2017, IE9, Chrome, Safari, Opera
    document.addEventListener('mousewheel', navigateOnBoard, { passive: false });

    // Old versions of Firefox
    document.addEventListener('DOMMouseScroll', navigateOnBoard, { passive: false });

    function keyZoom(e) {
        console.log(e);
        if (e.ctrlKey && e.code === 'Minus') {
            e.preventDefault();
            zoom(board, -100);
        } else if (e.ctrlKey && e.code === 'Equal') {
            e.preventDefault();
            zoom(board, 100);
            //todo db check with numpad
        } else if (e.ctrlKey && [48, 61, 96].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }

    document.addEventListener("keydown", keyZoom, { passive: false });

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

