import { Position } from '../board/Sticker';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const _cursorPosition = new BehaviorSubject({ x: 0, y: 0 } as Position);
const _mouseUp = new Subject<void>();

window.addEventListener('mousemove', (e) => {
    _cursorPosition.next({ x: e.clientX, y: e.clientY });
});
window.addEventListener('touchmove', (e: TouchEvent) => {
    const firstTouch = e.changedTouches[0];
    _cursorPosition.next({ x: firstTouch.clientX, y: firstTouch.clientY });
});

window.addEventListener('mouseup', () => _mouseUp.next());
window.addEventListener('mouseupoutside', () => _mouseUp.next());
window.addEventListener('touchend', () => _mouseUp.next());
window.addEventListener('touchendoutside', () => _mouseUp.next());

export const cursorPosition: () => Observable<Position> = () => {
    return _cursorPosition.asObservable();
};

export const cursorPositionValue: () => Position = () => {
    return _cursorPosition.value;
};

export const mouseUp: () => Observable<void> = () => {
    return _mouseUp.asObservable();
};
