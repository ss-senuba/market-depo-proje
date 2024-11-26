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

// Depo güncelleme
exports.update = async (req, res) => {
    try {
        const { name, location } = req.body;
        const warehouse = await Warehouse.findById(req.params.warehouseId);

        if (!warehouse) {
            return res.status(404).json({ message: 'Depo bulunamadı.' });
        }

        // Güncellenmek istenen alanları kontrol et
        if (name) warehouse.name = name;
        if (location) warehouse.location = location;

        await warehouse.save();
        res.status(200).json({ message: 'Depo başarıyla güncellendi.', warehouse });
    } catch (error) {
        res.status(500).json({ message: 'Depo güncellenemedi.', error });
    }
};

// Depo silme
exports.delete_depo = async (req, res) => {
    try {
        // Depoyu bul
        const warehouse = await Warehouse.findById(req.params.warehouseId);

        if (!warehouse) {
            return res.status(404).json({ message: 'Depo bulunamadı.' });
        }

        // Depoyu sil
        await Warehouse.findByIdAndDelete(req.params.warehouseId);

        res.status(200).json({ message: 'Depo başarıyla silindi.' });
    } catch (error) {
        console.error(error); // Detaylı hata için
        res.status(500).json({ message: 'Depo silinemedi.', error: error.message });
    }
};


// Tüm depoları listeleme
exports.list = async (req, res) => {
    try {
        const warehouses = await Warehouse.find();
        if (warehouses.length === 0) {
            return res.status(404).json({ message: 'Herhangi bir depo bulunmamaktadır.' });
        }
        res.status(200).json({ message: 'Depolar başarıyla listelendi.', warehouses });
    } catch (error) {
        res.status(500).json({ message: 'Depolar listelenemedi.', error });
    }
};
