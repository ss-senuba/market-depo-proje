const Market = require('../models/market');
const SubWarehouse = require('../models/sub_depo');

// Market oluşturma
exports.create_market = async (req, res) => {
    try {
        const { name, location, subWarehouse } = req.body;
        const newMarket = new Market({ name, location, subWarehouse });
        await newMarket.save();

        const subWarehouseRecord = await SubWarehouse.findById(subWarehouse);
        subWarehouseRecord.markets.push(newMarket._id);
        await subWarehouseRecord.save();

        res.status(201).json({ message: 'Market başarıyla oluşturuldu.', market: newMarket });
    } catch (error) {
        res.status(500).json({ message: 'Market oluşturulamadı.', error });
    }
};

// Marketin alt depodan ürün talep etmesi
exports.request_product = async (req, res) => {
    try {
        const { subWarehouseId, productId, quantity } = req.body;
        const subWarehouse = await SubWarehouse.findById(subWarehouseId);
        if (!subWarehouse) {
            return res.status(404).json({ message: 'Alt depo bulunamadı.' });
        }

        const market = await Market.findById(req.params.marketId);
        if (!market) {
            return res.status(404).json({ message: 'Market bulunamadı.' });
        }

        const productInSubWarehouse = subWarehouse.products.find(p => p.productId.toString() === productId);
        if (!productInSubWarehouse || productInSubWarehouse.quantity < quantity) {
            return res.status(400).json({ message: 'Yeterli ürün stokta yok.' });
        }

        productInSubWarehouse.quantity -= quantity;
        const productInMarket = market.products.find(p => p.productId.toString() === productId);

        if (productInMarket) {
            productInMarket.quantity += quantity;
        } else {
            market.products.push({
                productId: productId,
                quantity: quantity
            });
        }

        await subWarehouse.save();
        await market.save();

        res.status(200).json({
            message: 'Ürün talebi başarıyla karşılandı.',
            talep: productInSubWarehouse.quantity,
            eklenenstok: quantity,
            totalstok: market.products.find(p => p.productId.toString() === productId).quantity
        });
    } catch (error) {
        res.status(500).json({ message: 'Ürün talebi karşılanamadı.', error });
    }
};

// Market güncelleme
exports.update_market = async (req, res) => {
    try {
        const { name, location, subWarehouse } = req.body;
        const marketId = req.params.marketId;

        const updatedMarket = await Market.findByIdAndUpdate(
            marketId,
            { name, location, subWarehouse },
            { new: true } // This option returns the updated document
        );

        if (!updatedMarket) {
            return res.status(404).json({ message: 'Market bulunamadı.' });
        }

        // Optionally, update the subWarehouse relationship if needed
        const subWarehouseRecord = await SubWarehouse.findById(subWarehouse);
        if (subWarehouseRecord && !subWarehouseRecord.markets.includes(marketId)) {
            subWarehouseRecord.markets.push(marketId);
            await subWarehouseRecord.save();
        }

        res.status(200).json({ message: 'Market başarıyla güncellendi.', market: updatedMarket });
    } catch (error) {
        res.status(500).json({ message: 'Market güncellenemedi.', error });
    }
};

// Market silme
exports.delete_market = async (req, res) => {
    try {
        const marketId = req.params.marketId;

        const market = await Market.findById(marketId);
        if (!market) {
            return res.status(404).json({ message: 'Market bulunamadı.' });
        }

        // Remove market from the subWarehouse
        const subWarehouseRecord = await SubWarehouse.findById(market.subWarehouse);
        if (subWarehouseRecord) {
            subWarehouseRecord.markets = subWarehouseRecord.markets.filter(
                (marketIdInSubWarehouse) => marketIdInSubWarehouse.toString() !== marketId
            );
            await subWarehouseRecord.save();
        }

        // Delete the market
        await market.remove();

        res.status(200).json({ message: 'Market başarıyla silindi.' });
    } catch (error) {
        res.status(500).json({ message: 'Market silinemedi.', error });
    }
};

// Marketleri listeleme
exports.list_markets = async (req, res) => {
    try {
        const markets = await Market.find().populate('subWarehouse', 'name location');
        
        if (markets.length === 0) {
            return res.status(404).json({ message: 'Hiçbir market bulunamadı.' });
        }

        res.status(200).json({ markets });
    } catch (error) {
        res.status(500).json({ message: 'Marketler listelemesi sırasında bir hata oluştu.', error });
    }
};
