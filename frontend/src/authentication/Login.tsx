import { AuthService } from './AuthService';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { googleAuthSettings } from './GoogleAuthSettings';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { createStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
    createStyles({
        row: {
            display: 'flex',
            justifyContent: 'center',
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            textAlign: 'center',
            ...theme.typography.h6
        }
    }),
);

const Login = () => {
    const classes = useStyles();

    function onGoogleLoginSuccess(response: any): void {
        new AuthService().signinWithGoogle(response.tokenId);
    }

    return (
        <div>
            <div className={classes.row}>
                <p>Get started with Sticker Board by sign in with Google</p>
            </div>
            <div className={classes.row}>
                <GoogleLogin clientId={googleAuthSettings.client_id}
                             onSuccess={onGoogleLoginSuccess}
                             scope={googleAuthSettings.scope}>
                </GoogleLogin>
            </div>
        </div>
    );
}

export default Login;
