import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import {
    ElementColorChangedEvent,
    ElementMovedEvent,
    ElementRemovedEvent,
    ElementTextChangedEvent,
    StickerCreatedEvent
} from '../services/services';

export class BoardSignalRService {

    private baseUrl: string;
    private boardId: string = 'testId';
    private connectionIsEstablished = false;
    private hubConnection: HubConnection;

    private elementMoved$ = new Subject<ElementMovedEvent>();
    private elementTextChanged$ = new Subject<ElementTextChangedEvent>();
    private elementColorChanged$ = new Subject<ElementColorChangedEvent>();
    private stickerCreated$ = new Subject<StickerCreatedEvent>();
    private elementRemoved$ = new Subject<ElementRemovedEvent>();

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;

        this.hubConnection = this.createConnection();
        this.registerOnServerEvents();
        this.startConnection();
    }

    public elementMoved(): Observable<ElementMovedEvent> {
        return this.elementMoved$.asObservable();
    }

    public elementTextChanged(): Observable<ElementTextChangedEvent> {
        return this.elementTextChanged$.asObservable();
    }

    public elementColorChanged(): Observable<ElementColorChangedEvent> {
        return this.elementColorChanged$.asObservable();
    }

    public stickerCreated(): Observable<StickerCreatedEvent> {
        return this.stickerCreated$.asObservable();
    }

    public elementRemoved(): Observable<ElementRemovedEvent> {
        return this.elementRemoved$.asObservable();
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
            'ElementMoved',
            (data: ElementMovedEvent) => {
                this.elementMoved$.next(data);
            });
        this.hubConnection.on(
            'ElementTextChanged',
            (data: ElementTextChangedEvent) => {
                this.elementTextChanged$.next(data);
            });
        this.hubConnection.on(
            'StickerCreated',
            (data: StickerCreatedEvent) => {
                this.stickerCreated$.next(data);
            });
        this.hubConnection.on(
            'ElementColorChanged',
            (data: ElementColorChangedEvent) => {
                this.elementColorChanged$.next(data);
            });
        this.hubConnection.on(
            'ElementRemoved',
            (data: ElementRemovedEvent) => {
                this.elementRemoved$.next(data);
            });
    }
}

