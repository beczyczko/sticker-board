import { BehaviorSubject, Observable } from 'rxjs';

const _boardScale = new BehaviorSubject<number>(1);

export const boardScale: () => Observable<number> = () => {
    return _boardScale.asObservable();
};

export const boardScaleValue: () => number = () => {
    return _boardScale.value;
};

export const setBoardScale: (scale: number) => void = (scale: number) => {
    _boardScale.next(scale);
};
