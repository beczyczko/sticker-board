import { config } from '../app-settings';

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
            window.location.assign('/login');
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
