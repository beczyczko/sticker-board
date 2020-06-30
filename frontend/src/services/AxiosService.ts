import axios from 'axios';
import { AuthService } from './AuthService';

const axiosInstance = axios.create();
const authService = new AuthService();

//todo db fix axios generated services problems with collections fetch
axiosInstance.interceptors.request.use(config => {
    const authorizationHeaderValue = authService.authorizationHeaderValue;
    console.log(authorizationHeaderValue);

    //todo db clean
    const api_access_token = localStorage.getItem('api_access_token');
    config.headers.Authorization =`Bearer ${api_access_token}`;
    console.log('Request was sent');

    return config;
});

axiosInstance.interceptors.response.use(config => {
    console.log('Response was received');
    return config;
}, error => {
    if (error.request.status === 401) {
        console.log('Should redirect');
        //todo db redirect to login page
        // debugger;
        authService.login();
    }
});

export const axiosDefault = axiosInstance;
