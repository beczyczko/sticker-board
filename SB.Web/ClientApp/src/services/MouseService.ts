import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Position } from '../board/Position';

const _cursorPosition = new BehaviorSubject({ x: 0, y: 0 } as Position);
const _mouseUp = new Subject<Event>();

window.addEventListener('mousemove', (e) => {
    _cursorPosition.next({ x: e.clientX, y: e.clientY });
});
window.addEventListener('touchmove', (e: TouchEvent) => {
    const firstTouch = e.changedTouches[0];
    _cursorPosition.next({ x: firstTouch.clientX, y: firstTouch.clientY });
});

window.addEventListener('mouseup', (e) => _mouseUp.next(e));
window.addEventListener('mouseupoutside', (e) => _mouseUp.next(e));
window.addEventListener('touchend', (e) => _mouseUp.next(e));
window.addEventListener('touchendoutside', (e) => _mouseUp.next(e));

export const cursorPosition: () => Observable<Position> = () => {
    return _cursorPosition.asObservable();
};

export const cursorPositionValue: () => Position = () => {
    return _cursorPosition.value;
};

export const mouseUp: () => Observable<Event> = () => {
    return _mouseUp.asObservable();
};
