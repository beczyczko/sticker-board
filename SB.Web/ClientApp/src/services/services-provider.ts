import { StickersService } from './services';
import { BaseAPIUrl } from '../app-settings';

export class ServicesProvider {
    private static _stickersService: StickersService;

    public static get stickersService(): StickersService {
        if (!this._stickersService) {
            this._stickersService = new StickersService(BaseAPIUrl);
        }

        return this._stickersService;
    }
}
