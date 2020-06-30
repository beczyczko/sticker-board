import { BehaviorSubject } from 'rxjs';
import { User, UserManager, UserManagerSettings } from 'oidc-client';


function getClientSettings(): UserManagerSettings {
    return {
        authority: 'https://accounts.google.com/',
        client_id: '503329558373-nndh2cks6bh8ss4kv1bhkjvme1be41ve.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:3000/auth/google/callback',
        response_type: 'id_token token',
        // scope: 'openid profile email'
        scope: 'openid email'
    };
}

const manager = new UserManager(getClientSettings());

manager.signinCallback()
    .then(response => {
        // debugger;
        console.log('signinCallback', response);

        const tokenBlob = new Blob([JSON.stringify({ tokenId: response.id_token }, null, 2)], { type: 'application/json' });
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            cache: 'default'
        } as RequestInit;
        fetch('https://localhost:44301/auth/google', options)
            .then(r => {
                r.json().then(user => {
                    const token = user.token;
                    console.log(token);
                    // debugger;
                    //todo db clean
                    localStorage.setItem('api_access_token', token);
                });
            })

    }).catch(error => {
        console.log(error);
});

export class AuthService {

    // Observable navItem source
    private _authNavStatusSource = new BehaviorSubject<boolean>(false);
    // Observable navItem stream
    authNavStatus$ = this._authNavStatusSource.asObservable();

    private user: User | null = null;

    constructor() {

        manager.getUser().then(user => {
            this.user = user;
            this._authNavStatusSource.next(this.isAuthenticated());
        });
    }

    login() {
        return manager.signinRedirect();
    }

    async completeAuthentication() {
        // debugger;
        this.user = await manager.signinRedirectCallback();
        this._authNavStatusSource.next(this.isAuthenticated());
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

//
// const googleAuthConfig = {
//     authority: 'https://accounts.google.com/',
//     client_id: 'sb-main-app',
//     redirect_uri: 'http://localhost:3000/',
//     response_type: 'id_token token',
//     scope: 'openid'
// };
//
// const userManager = new Oidc.UserManager(googleAuthConfig);
//
// const signIn = () => {
//     userManager.signinRedirect();
// };
//
