import { AuthenticationService, GoogleAuthToken, IAuthConfig, SbApiAuthToken } from '../services/services';

export class AuthService {
    public signinWithGoogle(idToken: string): Promise<void> {

        const authenticationService = new AuthenticationService(new IAuthConfig());
        return authenticationService.google({
            idToken: idToken
        } as GoogleAuthToken)
            .then((response: SbApiAuthToken) => {
                if (response.token) {
                    localStorage.setItem('api_access_token', response.token);
                    window.location.assign('/');
                    return;
                } else {
                    throw new Error('empty sb api auth token');
                }
            });
    }

    public logout(): void {
        localStorage.removeItem('api_access_token');
        window.location.assign('/login');
    }
}
