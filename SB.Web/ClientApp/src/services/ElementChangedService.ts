import { Observable, Subject } from 'rxjs';
import Sticker from '../board/Sticker';

export class ElementChangedService {
    private static _elementChanged$ = new Subject<Sticker>();

    public static get elementChanged$(): Observable<Sticker> {
        return this._elementChanged$.asObservable();
    }

    public static emitElementChanged$(element: Sticker) {
        this._elementChanged$.next(element);
    }
}

