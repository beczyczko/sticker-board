import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { StickerMovedEvent } from './Types/StickerMovedEvent';
import { StickerCreatedEvent } from './Types/StickerCreatedEvent';
import { StickerTextChangedEvent } from './Types/StickerTextChangedEvent';

export class BoardSignalRService {

    private baseUrl: string;
    private boardId: string = 'testId';
    private connectionIsEstablished = false;
    private hubConnection: HubConnection;

    private stickerMoved$ = new Subject<StickerMovedEvent>();
    private stickerTextChanged$ = new Subject<StickerTextChangedEvent>();
    private stickerCreated$ = new Subject<StickerCreatedEvent>();

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;

        this.hubConnection = this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    public stickerMoved(): Observable<StickerMovedEvent> {
        return this.stickerMoved$.asObservable();
    }

    public stickerTextChanged(): Observable<StickerTextChangedEvent> {
        return this.stickerTextChanged$.asObservable();
    }

    public stickerCreated(): Observable<StickerCreatedEvent> {
        return this.stickerCreated$.asObservable();
    }

    private createConnection(): HubConnection {
        return new HubConnectionBuilder()
            .withUrl(this.baseUrl + '/board')
            .build();
    }

    private startConnection(): void {
        this.hubConnection
            .start()
            .then(() => {
                this.connectionIsEstablished = true;
                console.debug('Hub connection started');

                this.hubConnection.send('JoinBoardGroup', this.boardId)
                    .then(() => console.debug(`Board: ${this.boardId} room joined`));
            })
            .catch(err => {
                console.debug('Error while establishing connection, retrying...');
                setTimeout(() => this.startConnection(), 5000);
            });
    }

    private registerOnServerEvents(): void {
        this.hubConnection.on(
            'StickerMoved',
            (data: StickerMovedEvent) => {
                this.stickerMoved$.next(data);
            });
        this.hubConnection.on(
            'StickerTextChanged',
            (data: StickerTextChangedEvent) => {
                this.stickerTextChanged$.next(data);
            });
        this.hubConnection.on(
            'StickerCreated',
            (data: StickerCreatedEvent) => {
                this.stickerCreated$.next(data);
            });
    }
}

