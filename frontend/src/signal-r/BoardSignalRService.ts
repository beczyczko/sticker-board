import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { StickerMovedEvent } from './Types/StickerMovedEvent';
import { StickerCreatedEvent } from './Types/StickerCreatedEvent';
import { StickerTextChangedEvent } from './Types/StickerTextChangedEvent';
import { StickerColorChangedEvent } from './Types/StickerColorChangedEvent';
import { StickerRemovedEvent } from './Types/StickerRemovedEvent';

export class BoardSignalRService {

    private baseUrl: string;
    private boardId: string = 'testId';
    private connectionIsEstablished = false;
    private hubConnection: HubConnection;

    private stickerMoved$ = new Subject<StickerMovedEvent>();
    private stickerTextChanged$ = new Subject<StickerTextChangedEvent>();
    private stickerColorChanged$ = new Subject<StickerColorChangedEvent>();
    private stickerCreated$ = new Subject<StickerCreatedEvent>();
    private stickerRemoved$ = new Subject<StickerRemovedEvent>();

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

    public stickerColorChanged(): Observable<StickerColorChangedEvent> {
        return this.stickerColorChanged$.asObservable();
    }

    public stickerCreated(): Observable<StickerCreatedEvent> {
        return this.stickerCreated$.asObservable();
    }

    public stickerRemoved(): Observable<StickerRemovedEvent> {
        return this.stickerRemoved$.asObservable();
    }

    private createConnection(): HubConnection {
        const api_access_token = localStorage.getItem('api_access_token') ?? '';
        return new HubConnectionBuilder()
            .withUrl(this.baseUrl + '/api/hubs/board', {
                accessTokenFactory(): string | Promise<string> {
                    return api_access_token;
                }
            })
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
        this.hubConnection.on(
            'StickerColorChanged',
            (data: StickerColorChangedEvent) => {
                this.stickerColorChanged$.next(data);
            });
        this.hubConnection.on(
            'StickerRemoved',
            (data: StickerRemovedEvent) => {
                this.stickerRemoved$.next(data);
            });
    }
}

