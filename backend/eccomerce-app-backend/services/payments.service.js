const mercadoPagoApi = require('../api/mercadoPagoApi');

class PaymentsService {

    async createPayment(data) {

        const {
            products,
            user_email,
            success,
            failure,
            pending,
            notification_baseUrl
        } = data;

        try {

            let items = [];

            products.forEach((e) => items = [...items, {
                title: e.name,
                description: e.description,
                picture_url: e.img[0].imageUrl,
                category_id: e.category._id,
                quantity: e.quantity,
                unit_price: 10
                // unit_price: e.price
            }])

            const { data } = await await mercadoPagoApi.post("", {
                payer_email: user_email,
                items,
                back_urls: {
                    success,
                    failure,
                    pending,
                },
                notification_url: `https://eccomerce-app-backend.onrender.com/api/sales/clear/${user_email}`,
            });

            return data;
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = PaymentsService;