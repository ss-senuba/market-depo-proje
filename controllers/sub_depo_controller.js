const SubWarehouse = require('../models/sub_depo');
const Warehouse = require('../models/main_depo');

// Alt depo oluşturma
exports.create_sub_depo = async (req, res) => {
    try {
        const { name, location, parentWarehouse } = req.body;
        const newSubWarehouse = new SubWarehouse({ name, location, parentWarehouse });
        await newSubWarehouse.save();

        const warehouse = await Warehouse.findById(parentWarehouse);
        warehouse.subWarehouses.push(newSubWarehouse._id);
        await warehouse.save();

        res.status(201).json({ message: 'Alt depo başarıyla oluşturuldu.', subWarehouse: newSubWarehouse });
    } catch (error) {
        res.status(500).json({ message: 'Alt depo oluşturulamadı.', error });
    }
};


// Alt deponun ana depodan ürün talep etmesi
exports.request_product = async (req, res) => {
    try {
        const { warehouseId, productId, quantity } = req.body;
        const warehouse = await Warehouse.findById(warehouseId);
        if (!warehouse) {
            return res.status(404).json({ message: 'Ana depo bulunamadı.' });
        }

        const subWarehouse = await SubWarehouse.findById(req.params.subWarehouseId);
        if (!subWarehouse) {
            return res.status(404).json({ message: 'Alt depo bulunamadı.' });
        }

        const productInWarehouse = warehouse.products.find(p => p.productId.toString() === productId);
        if (!productInWarehouse || productInWarehouse.quantity < quantity) {
            return res.status(400).json({ message: 'Yeterli ürün stokta yok.' });
        }

        productInWarehouse.quantity -= quantity;
        const productInSubWarehouse = subWarehouse.products.find(p => p.productId.toString() === productId);

        if (productInSubWarehouse) {
            productInSubWarehouse.quantity += quantity;
        } else {
            subWarehouse.products.push({
                productId: productId,
                quantity: quantity
            });
        }

        await warehouse.save();
        await subWarehouse.save();

        res.status(200).json({
            message: 'Ürün talebi başarıyla karşılandı.',
            kalan: productInWarehouse.quantity,
            added: quantity,
            total: subWarehouse.products.find(p => p.productId.toString() === productId).quantity
        });
    } catch (error) {
        res.status(500).json({ message: 'Ürün talebi karşılanamadı.', error });
    }
};

// Alt depo güncelleme
exports.update_sub_depo = async (req, res) => {
    try {
        const { name, location } = req.body;
        const subWarehouse = await SubWarehouse.findById(req.params.subWarehouseId);

        if (!subWarehouse) {
            return res.status(404).json({ message: 'Alt depo bulunamadı.' });
        }

        subWarehouse.name = name || subWarehouse.name;
        subWarehouse.location = location || subWarehouse.location;

        await subWarehouse.save();

        res.status(200).json({
            message: 'Alt depo başarıyla güncellendi.',
            subWarehouse
        });
    } catch (error) {
        res.status(500).json({ message: 'Alt depo güncellenemedi.', error });
    }
};

// Alt depo silme
exports.delete_sub_depo = async (req, res) => {
    try {
        const subWarehouse = await SubWarehouse.findById(req.params.subWarehouseId);

        if (!subWarehouse) {
            return res.status(404).json({ message: 'Alt depo bulunamadı.' });
        }

        const warehouse = await Warehouse.findById(subWarehouse.parentWarehouse);
        if (!warehouse) {
            return res.status(404).json({ message: 'Ana depo bulunamadı.' });
        }

        // Alt depoyu ana depodan kaldır
        warehouse.subWarehouses = warehouse.subWarehouses.filter(id => id.toString() !== subWarehouse._id.toString());
        await warehouse.save();

        // Alt depoyu veritabanından sil
        await subWarehouse.remove();

        res.status(200).json({ message: 'Alt depo başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Alt depo silinemedi.', error });
    }
};

// Alt depo listeleme
exports.list_sub_depos = async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.parentWarehouseId).populate('subWarehouses');
        if (!warehouse) {
            return res.status(404).json({ message: 'Ana depo bulunamadı.' });
        }

        res.status(200).json({ subWarehouses: warehouse.subWarehouses });
    } catch (error) {
        res.status(500).json({ message: 'Alt depolar listelenemedi.', error });
    }
};
