import { AuthService } from './AuthService';
import Button from '@material-ui/core/Button';
import React from 'react';

function Login() {
    //todo db make it a little bit fancy
    function loginWithGoogle() {
        new AuthService().login().then();
    }

    return (
        <div>
            <Button onClick={loginWithGoogle} color="primary">
                Login with google
            </Button>
        </div>
    );
}

export default Login;
