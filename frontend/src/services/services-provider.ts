import { IConfig, StickersService } from './services';

export class ServicesProvider {
    private static _stickersService: StickersService;

    public static get stickersService(): StickersService {
        if (!this._stickersService) {
            this._stickersService = new StickersService(new IConfig());
        }

        return this._stickersService;
    }
}
