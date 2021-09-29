import { IAuthConfig, ElementsService } from './services';

export class ServicesProvider {
    private static _elementsService: ElementsService;

    public static get elementsService(): ElementsService {
        if (!this._elementsService) {
            this._elementsService = new ElementsService(new IAuthConfig());
        }

        return this._elementsService;
    }
}
