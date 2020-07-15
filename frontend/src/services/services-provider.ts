import { IAuthConfig, StickersService } from './services';

export class ServicesProvider {
    private static _stickersService: StickersService;

    public static get stickersService(): StickersService {
        if (!this._stickersService) {
            this._stickersService = new StickersService(new IAuthConfig());
        }

        return this._stickersService;
    }
}
