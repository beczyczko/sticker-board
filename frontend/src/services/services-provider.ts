import { StickersService } from './services';
import { config } from '../app-settings';

export class ServicesProvider {
    private static _stickersService: StickersService;

    public static get stickersService(): StickersService {
        if (!this._stickersService) {
            this._stickersService = new StickersService(config.BASE_API_URL);
        }

        return this._stickersService;
    }
}
