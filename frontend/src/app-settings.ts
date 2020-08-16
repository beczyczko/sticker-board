const dev = {
    BASE_API_URL: 'https://localhost:44301',
};

const prod = {
    BASE_API_URL: '/',
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
