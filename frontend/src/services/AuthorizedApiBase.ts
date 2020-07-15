import { config } from '../app-settings';
import { AuthService } from './AuthService';

export class IConfig {
    //todo db something is not fine here
    getAuthorization: () => string = () => {
        const api_access_token = localStorage.getItem('api_access_token');
        return `Bearer ${api_access_token}`;
    };
}

export class AuthorizedApiBase {
    private readonly config: IConfig;

    protected constructor(config: IConfig) {
        this.config = config;
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
            //todo db it can be better
            new AuthService().login().then();
        }

        return processor(response);
    }

    protected getBaseUrl(defaultBaseUrl: string, baseUrl: string | undefined): string {
        const BASE_API_URL = config.BASE_API_URL;
        if (BASE_API_URL) {
            return BASE_API_URL;
        } else if (baseUrl) {
            return baseUrl;
        } else {
            return defaultBaseUrl;
        }
    }
}
