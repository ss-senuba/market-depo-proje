const Product = require('../models/product');

// Ürün oluşturma
exports.create_product = async (req, res) => {
    try {
        const { name, price, quantity } = req.body;
        const newProduct = new Product({ name, price, quantity });
        await newProduct.save();
        res.status(201).json({ message: 'Ürün başarıyla oluşturuldu.', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Ürün oluşturulamadı.', error });
    }
};
