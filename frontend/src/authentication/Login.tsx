import { AuthService } from './AuthService';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { googleAuthSettings } from './GoogleAuthSettings';

function Login() {
    function onGoogleLoginSuccess(response: any): void {
        new AuthService().loginWithGoogle(response.tokenId);
    }

    return (
        <div>
            <GoogleLogin clientId={googleAuthSettings.client_id}
                         onSuccess={onGoogleLoginSuccess}
                         scope={googleAuthSettings.scope}>
            </GoogleLogin>
        </div>
    );
}

export default Login;
