/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.10.2.0 (NJsonSchema v10.3.4.0 (Newtonsoft.Json v12.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

import { config } from '../app-settings';
import * as moment from 'moment';

export class IAuthConfig {
    getAuthorization: () => string = () => {
        const api_access_token = localStorage.getItem('api_access_token');
        return `Bearer ${api_access_token}`;
    };
}

export class AuthorizedApiBase {
    private readonly config: IAuthConfig;

    protected constructor(config?: IAuthConfig) {
        this.config = config ? config : new IAuthConfig();
    }

    protected transformOptions = (options: RequestInit): Promise<RequestInit> => {
        options.headers = {
            ...options.headers,
            Authorization: this.config.getAuthorization(),
        };
        return Promise.resolve(options);
    };

    protected transformResult(url: string, response: Response, processor: (response: Response) => Promise<any>): Promise<any> {
        if (response.status === 401) {
            if (window.location.pathname !== '/login') {
                window.location.assign('/login');
            }
        }

        return processor(response);
    }

    protected getBaseUrl(defaultBaseUrl: string, baseUrl: string | undefined): string {
        const BASE_API_URL = config.BASE_API_URL;
        if (BASE_API_URL !== null && BASE_API_URL !== undefined) {
            return BASE_API_URL;
        } else if (baseUrl) {
            return baseUrl;
        } else {
            return defaultBaseUrl;
        }
    }
}

export class AuthenticationService extends AuthorizedApiBase {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: IAuthConfig, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = this.getBaseUrl("https://localhost:44301", baseUrl);
    }

    isAuthenticated(): Promise<FileResponse> {
        let url_ = this.baseUrl + "/api/Authentication";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/octet-stream"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processIsAuthenticated(_response));
        });
    }

    protected processIsAuthenticated(response: Response): Promise<FileResponse> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
            const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
            const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
            return response.blob().then(blob => { return { fileName: fileName, data: blob, status: status, headers: _headers }; });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<FileResponse>(<any>null);
    }

    google(googleAuthToken: GoogleAuthToken): Promise<SbApiAuthToken> {
        let url_ = this.baseUrl + "/api/Authentication/Google";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(googleAuthToken);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processGoogle(_response));
        });
    }

    protected processGoogle(response: Response): Promise<SbApiAuthToken> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            result200 = _responseText === "" ? null : <SbApiAuthToken>JSON.parse(_responseText, this.jsonParseReviver);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<SbApiAuthToken>(<any>null);
    }
}

export class SignalRService extends AuthorizedApiBase {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: IAuthConfig, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = this.getBaseUrl("https://localhost:44301", baseUrl);
    }

    types(): Promise<EventsTypes> {
        let url_ = this.baseUrl + "/Types";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processTypes(_response));
        });
    }

    protected processTypes(response: Response): Promise<EventsTypes> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            result200 = _responseText === "" ? null : <EventsTypes>JSON.parse(_responseText, this.jsonParseReviver);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<EventsTypes>(<any>null);
    }
}

export class ElementsService extends AuthorizedApiBase {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(configuration: IAuthConfig, baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
        super(configuration);
        this.http = http ? http : <any>window;
        this.baseUrl = this.getBaseUrl("https://localhost:44301", baseUrl);
    }

    elements(): Promise<Element[]> {
        let url_ = this.baseUrl + "/api/Elements";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processElements(_response));
        });
    }

    protected processElements(response: Response): Promise<Element[]> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            result200 = _responseText === "" ? null : <Element[]>JSON.parse(_responseText, this.jsonParseReviver);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Element[]>(<any>null);
    }

    create(command: AddStickerCommand): Promise<void> {
        let url_ = this.baseUrl + "/api/Elements";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(command);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processCreate(_response));
        });
    }

    protected processCreate(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    element(elementId: string): Promise<Element> {
        let url_ = this.baseUrl + "/api/Elements/{elementId}";
        if (elementId === undefined || elementId === null)
            throw new Error("The parameter 'elementId' must be defined.");
        url_ = url_.replace("{elementId}", encodeURIComponent("" + elementId));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processElement(_response));
        });
    }

    protected processElement(response: Response): Promise<Element> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            result200 = _responseText === "" ? null : <Element>JSON.parse(_responseText, this.jsonParseReviver);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<Element>(<any>null);
    }

    position(elementId: string, newPosition: SbVector2): Promise<void> {
        let url_ = this.baseUrl + "/api/Elements/{elementId}/Position";
        if (elementId === undefined || elementId === null)
            throw new Error("The parameter 'elementId' must be defined.");
        url_ = url_.replace("{elementId}", encodeURIComponent("" + elementId));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(newPosition);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processPosition(_response));
        });
    }

    protected processPosition(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    text(elementId: string, correlationId: string | undefined, command: ChangeElementTextCommand): Promise<void> {
        let url_ = this.baseUrl + "/api/Elements/{elementId}/Text?";
        if (elementId === undefined || elementId === null)
            throw new Error("The parameter 'elementId' must be defined.");
        url_ = url_.replace("{elementId}", encodeURIComponent("" + elementId));
        if (correlationId === null)
            throw new Error("The parameter 'correlationId' cannot be null.");
        else if (correlationId !== undefined)
            url_ += "correlationId=" + encodeURIComponent("" + correlationId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(command);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processText(_response));
        });
    }

    protected processText(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 202) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    color(elementId: string, correlationId: string | undefined, newColor: ColorDto): Promise<void> {
        let url_ = this.baseUrl + "/api/Elements/{elementId}/Color?";
        if (elementId === undefined || elementId === null)
            throw new Error("The parameter 'elementId' must be defined.");
        url_ = url_.replace("{elementId}", encodeURIComponent("" + elementId));
        if (correlationId === null)
            throw new Error("The parameter 'correlationId' cannot be null.");
        else if (correlationId !== undefined)
            url_ += "correlationId=" + encodeURIComponent("" + correlationId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(newColor);

        let options_ = <RequestInit>{
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processColor(_response));
        });
    }

    protected processColor(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 202) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    remove(elementId: string, commandMoment: moment.Moment | undefined, correlationId: string | undefined): Promise<void> {
        let url_ = this.baseUrl + "/api/Elements/{elementId}/Remove?";
        if (elementId === undefined || elementId === null)
            throw new Error("The parameter 'elementId' must be defined.");
        url_ = url_.replace("{elementId}", encodeURIComponent("" + elementId));
        if (commandMoment === null)
            throw new Error("The parameter 'commandMoment' cannot be null.");
        else if (commandMoment !== undefined)
            url_ += "commandMoment=" + encodeURIComponent(commandMoment ? "" + commandMoment.toJSON() : "") + "&";
        if (correlationId === null)
            throw new Error("The parameter 'correlationId' cannot be null.");
        else if (correlationId !== undefined)
            url_ += "correlationId=" + encodeURIComponent("" + correlationId) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "DELETE",
            headers: {
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processRemove(_response));
        });
    }

    protected processRemove(response: Response): Promise<void> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 202) {
            return response.text().then((_responseText) => {
            return;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<void>(<any>null);
    }

    colors(): Promise<ColorDto[]> {
        let url_ = this.baseUrl + "/api/Elements/Colors";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processColors(_response));
        });
    }

    protected processColors(response: Response): Promise<ColorDto[]> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            result200 = _responseText === "" ? null : <ColorDto[]>JSON.parse(_responseText, this.jsonParseReviver);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ColorDto[]>(<any>null);
    }

    types(): Promise<ElementsTypes> {
        let url_ = this.baseUrl + "/api/Elements/Types";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <RequestInit>{
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.transformOptions(options_).then(transformedOptions_ => {
            return this.http.fetch(url_, transformedOptions_);
        }).then((_response: Response) => {
            return this.transformResult(url_, _response, (_response: Response) => this.processTypes(_response));
        });
    }

    protected processTypes(response: Response): Promise<ElementsTypes> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((v: any, k: any) => _headers[k] = v); };
        if (status === 200) {
            return response.text().then((_responseText) => {
            let result200: any = null;
            result200 = _responseText === "" ? null : <ElementsTypes>JSON.parse(_responseText, this.jsonParseReviver);
            return result200;
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
            return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<ElementsTypes>(<any>null);
    }
}

export interface SbApiAuthToken {
    token: string | undefined;
}

export interface GoogleAuthToken {
    idToken: string | undefined;
}

export interface EventsTypes {
    elementColorChangedEvent: ElementColorChangedEvent | undefined;
    elementMovedEvent: ElementMovedEvent | undefined;
    elementRemovedEvent: ElementRemovedEvent | undefined;
    elementTextChangedEvent: ElementTextChangedEvent | undefined;
    stickerCreatedEvent: StickerCreatedEvent | undefined;
}

export interface ElementColorChangedEvent {
    boardId: string;
    elementId: string;
    newColor: ColorDto;
    correlationId: string;
}

export interface ColorDto {
    red: number;
    green: number;
    blue: number;
}

export interface ElementMovedEvent {
    boardId: string;
    elementId: string;
    position: SbVector2;
}

export interface SbVector2 {
    x: number;
    y: number;
}

export interface ElementRemovedEvent {
    boardId: string;
    elementId: string;
    correlationId: string;
}

export interface ElementTextChangedEvent {
    boardId: string;
    elementId: string;
    text: string;
    correlationId: string;
}

export interface StickerCreatedEvent {
    boardId: string;
    stickerId: string;
}

export interface BaseEntity {
    id: string;
}

export interface Element extends BaseEntity {
    type: string;
    position: SbVector2;
    removedMoment: moment.Moment;
}

export interface AddStickerCommand {
    id: string;
    text: string | undefined;
    positionX: number;
    positionY: number;
    color: ColorDto | undefined;
}

export interface ChangeElementTextCommand {
    newText: string | undefined;
}

export interface ElementsTypes {
    sticker: Sticker | undefined;
    connection: Connection | undefined;
}

export interface Sticker extends Element {
    text: string;
    color: Color;
}

export interface Color {
    red: number;
    green: number;
    blue: number;
}

export interface Connection extends Element {
    start: Anchor;
    end: Anchor;
    color: Color;
}

export interface Anchor extends BaseEntity {
    position: SbVector2;
}

export interface FileResponse {
    data: Blob;
    status: number;
    fileName?: string;
    headers?: { [name: string]: any };
}

export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: { [key: string]: any; };
    result: any;

    constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.headers = headers;
        this.result = result;
    }

    protected isApiException = true;

    static isApiException(obj: any): obj is ApiException {
        return obj.isApiException === true;
    }
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined)
        throw result;
    else
        throw new ApiException(message, status, response, headers, null);
}