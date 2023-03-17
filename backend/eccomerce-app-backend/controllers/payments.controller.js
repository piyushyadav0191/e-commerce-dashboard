
/** Payment example 1 */
const body = {
    payer_email: "comprador@email.com",
    items: [
        {
            title: "Dummy Title", /** Required */
            description: "Dummy description",
            picture_url: "http://www.myapp.com/myimage.jpg",
            category_id: "cat123",
            quantity: 1, /** Required */
            unit_price: 10 /** Required */
        }
    ],
    back_urls: {
        success: "https://www.success.com",
        failure: "http://www.failure.com",
        pending: "http://www.pending.com"
    },
    notification_url: "https://www.your-site.com/ipn"
};

/** Payment example 2 */
const body2 = {
    items: [
        {
            id: "item-ID-1234",
            title: "Mi producto",
            currency_id: "ARS",
            picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
            description: "Descripción del Item",
            category_id: "art",
            quantity: 1,
            unit_price: 75.76
        }
    ],
    payer: {
        name: "Juan",
        surname: "Lopez",
        emai: "user@email.com",
        phone: {
            area_code: "11",
            number: "4444-4444"
        },
        identification: {
            type: "DNI",
            number: "12345678"
        },
        address: {
            street_name: "Street",
            street_number: 123,
            zip_code: "5700"
        }
    },
    back_urls: {
        success: "https://www.success.com",
        failure: "http://www.failure.com",
        pending: "http://www.pending.com"
    },
    auto_return: "approved",
    payment_methods: {
        excluded_payment_methods: [
            {
                id: "master"
            }
        ],
        excluded_payment_types: [
            {
                id: "ticket"
            }
        ],
        installments: 12
    },
    notification_url: "https://www.your-site.com/ipn",
    statement_descriptor: "MINEGOCIO",
    external_reference: "Reference_1234",
    expires: true,
    expiration_date_from: "2016-02-01T12:00:00.000-04:00",
    expiration_date_to: "2016-02-28T12:00:00.000-04:00"
};

class PaymentController {
    constructor(subscriptionService) {
      this.subscriptionService = subscriptionService;
    }
  
    async getPaymentLink(req, res) {
      try {
        const payment = await this.subscriptionService.createPayment(req.body);
  
        return res.json(payment);
      } catch (error) {
        console.log(error);
  
        return res
          .status(500)
          .json({ error: true, msg: "Failed to create payment" });
      }
    }
  }
  
  module.exports = PaymentController;