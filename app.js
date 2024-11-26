const express = require('express');
const mongoose = require('mongoose');

const main_depo_routes = require('./routes/main_depo_routes');
const product_routes = require('./routes/product_routes');
const sub_depo_routes = require('./routes/sub_depo_routes');
const market_routes = require('./routes/market_routes');
const user_routes = require('./routes/user_routes');
const bodyParser = require('body-parser');
const database = require('./src/database');

const app = express();

require('dotenv').config();

// MongoDB bağlantısı
database();

// Body parser kullanarak gelen isteklerin JSON olarak işlenmesini sağla
app.use(bodyParser.json());

// Rotaları kullanma
app.use('/api/main', main_depo_routes);
app.use('/api/products', product_routes);
app.use('/api/sub', sub_depo_routes);
app.use('/api/markets', market_routes);
app.use('/api/users', user_routes); // Kullanıcı rotalarını burada ekledik

// Uygulamanın çalışacağı port
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
