const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require('express-fileupload');
require('colors');

const publicPath = path.join(__dirname, '..', 'public');

const { dbConnection } = require('../database/config')



class Server {

    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads',
            bin: '/api/bin',
            records: '/api/records',
            sales: '/api/sales',
            notifications: '/api/notifications',
            dashboard: '/api/dashboard',
            ranking: '/api/ranking',
            payment: '/api/payment',
        }

        this.conectarDB();

        this.middlewares();

        this.routes();
    };

    async conectarDB() {
        await dbConnection()
    };

    middlewares() {
        this.app.use(cors());

        this.app.use(logger("dev"));
        // this.app.use(cookieParser());

        //Reading and parsing of the body.
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(express.json());

        this.app.use(express.static(publicPath));

        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    };

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.users, require('../routes/user.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
        this.app.use(this.paths.bin, require('../routes/bin.routes'));
        this.app.use(this.paths.records, require('../routes/record.routes'));
        this.app.use(this.paths.sales, require('../routes/sales.routes'));
        this.app.use(this.paths.notifications, require('../routes/notifications.routes'));
        this.app.use(this.paths.dashboard, require('../routes/dashboard.routes'));
        this.app.use(this.paths.ranking, require('../routes/ranking.routes'));
        this.app.use(this.paths.payment, require('../routes/payments.routes'));

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(publicPath, 'index.html')), function (err) {
                if (err) {
                    res.status(500).send(err)
                }
            };
        });
    };
    listen() {
        this.app.listen(this.port, () => {
            console.log('Server listening on port: '.green, this.port);
        });
    };
};


module.exports = Server;
