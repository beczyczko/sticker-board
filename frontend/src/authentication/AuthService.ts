import { User, UserManager, UserManagerSettings } from 'oidc-client';

//todo db move this config somewhere else
function getClientSettings(): UserManagerSettings {
    return {
        authority: 'https://accounts.google.com/',
        client_id: '503329558373-nndh2cks6bh8ss4kv1bhkjvme1be41ve.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/auth/google/callback',
        response_type: 'id_token token',
        scope: 'openid email'
    };
}

const manager = new UserManager(getClientSettings());

manager.signinCallback()
    .then(response => {
        console.log('signinCallback', response);

        const tokenBlob = new Blob([JSON.stringify({ IdToken: response.id_token }, null, 2)], { type: 'application/json' });
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        } as RequestInit;
        //todo db unhardcore url
        fetch('https://localhost:44301/api/Authentication/google', options)
            .then(r => {
                r.json().then(user => {
                    const token = user.token;
                    console.log(token);
                    //todo db clean

                    localStorage.setItem('api_access_token', token);
                    window.location.assign('/');
                });
            })

    }).catch(error => {
    console.log(error);
});

export class AuthService {
    private user: User | null = null;

    constructor() {

        manager.getUser().then(user => {
            this.user = user;
        });
    }

    login(): Promise<any> {
        return manager.signinRedirect();
    }

    async completeAuthentication() {
        // debugger;
        this.user = await manager.signinRedirectCallback();
    }

    //
    // register(userRegistration: any) {
    //     return this.http.post(this.configProvider.config.authApiUrl + '/account', userRegistration).pipe(catchError(this.handleError));
    // }

    isAuthenticated(): boolean {
        return this.user != null && !this.user.expired;
    }

    get authorizationHeaderValue(): string {
        if (this.user) {
            return `${this.user.token_type} ${this.user.access_token}`;
        } else {
            return '';
        }
    }

    get name(): string {
        return this.user != null ? this.user.profile.name : '';
    }

    signout() {
        manager.signoutRedirect();
    }
}
