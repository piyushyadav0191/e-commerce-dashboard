const axios = require('axios');

const accessToken = process.env.MERCADOPAGO_ACCESSTOKEN;

const mercadoPagoApi = axios.create({
    baseURL: "https://api.mercadopago.com/checkout/preferences"
});

// Todo: configurar interceptores
mercadoPagoApi.interceptors.request.use(config => {

    config.headers = {
        ...config.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
    }

    return config;
})

module.exports = mercadoPagoApi;