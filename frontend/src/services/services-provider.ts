import { StickersService } from './services';
import { config } from '../app-settings';
import { axiosDefault } from './AxiosService';

export class ServicesProvider {
    private static _stickersService: StickersService;

    public static get stickersService(): StickersService {
        if (!this._stickersService) {
            this._stickersService = new StickersService(config.BASE_API_URL, axiosDefault);
        }

        return this._stickersService;
    }
}
