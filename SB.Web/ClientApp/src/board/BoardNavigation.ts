import Board from './board';

export function subscribeToScrollEvents(board: Board) {
    const moveBoard = (board: Board, event: any) => {
        const scrollSpeed = 2;
        board.container.position.x -= event.deltaX * scrollSpeed;
        board.container.position.y -= event.deltaY * scrollSpeed;
    };

    // 2017 recommended event
    document.body.addEventListener('wheel', function (event) {
        moveBoard(board, event);
    }, false);

    // Before 2017, IE9, Chrome, Safari, Opera
    document.body.addEventListener('mousewheel', function (event) {
        moveBoard(board, event); // not tested this case
    }, false);

    // Old versions of Firefox
    document.body.addEventListener('DOMMouseScroll', function (event) {
        moveBoard(board, event); // not tested this case
    }, false);
}
