const Warehouse = require('../models/main_depo');
const Product = require('../models/product');

// Depo oluşturma
exports.create = async (req, res) => {
    try {
        const { name, location } = req.body;
        const newWarehouse = new Warehouse({ name, location });
        await newWarehouse.save();
        res.status(201).json({ message: 'Depo başarıyla oluşturuldu.', warehouse: newWarehouse });
    } catch (error) {
        res.status(500).json({ message: 'Depo oluşturulamadı.', error });
    }
};

// Ana depoya ürün ekleme
exports.add_product = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const warehouse = await Warehouse.findById(req.params.warehouseId);
        if (!warehouse) {
            return res.status(404).json({ message: 'Depo bulunamadı.' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' });
        }

        const existingProductIndex = warehouse.products.findIndex(p => p.productId.toString() === productId);
        if (existingProductIndex > -1) {
            warehouse.products[existingProductIndex].quantity += quantity;
        } else {
            warehouse.products.push({
                productId: product._id,
                name: product.name,
                quantity: quantity,
                price: product.price
            });
        }

        await warehouse.save();
        res.status(200).json({ message: 'Ürün başarıyla depoya eklendi.', warehouse });
    } catch (error) {
        res.status(500).json({ message: 'Ürün depoya eklenemedi.', error });
    }
};
