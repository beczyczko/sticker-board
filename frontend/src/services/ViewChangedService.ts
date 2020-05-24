import { Observable, Subject } from 'rxjs';

export class ViewChangedService {
    private _viewChanged$ = new Subject<void>();

    public get viewChanged$(): Observable<void> {
        return this._viewChanged$.asObservable();
    }

    public emitViewChanged$() {
        this._viewChanged$.next();
    }
}
