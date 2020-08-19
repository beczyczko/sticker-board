import { Observable, Subject } from 'rxjs';

const _deletePressed = new Subject<KeyboardEvent>();

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Delete') {
        _deletePressed.next(e);
        return;
    }
});

export const deletePressed: () => Observable<KeyboardEvent> = () => {
    return _deletePressed.asObservable();
};
