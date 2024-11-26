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

// Ürün güncelleme
exports.update_product = async (req, res) => {
    try {
        const { id } = req.params; // Güncellenecek ürünün ID'sini parametre olarak alıyoruz
        const { name, price, quantity } = req.body; // Güncellemek istediğimiz alanları alıyoruz

        // Ürünü güncelleme işlemi
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, price, quantity },  // Güncellenen alanlar
            { new: true }  // Yeni halini geri döndürecek
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' }); // Eğer ürün bulunamazsa hata mesajı döner
        }

        res.status(200).json({ message: 'Ürün başarıyla güncellendi.', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Ürün güncellenirken bir hata oluştu.', error });
    }
};

// Ürün silme
exports.delete_product = async (req, res) => {
    try {
        const { id } = req.params; // Silinecek ürünün ID'sini parametre olarak alıyoruz
        const deletedProduct = await Product.findByIdAndDelete(id); // Ürünü veritabanından silme

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Ürün bulunamadı.' }); // Eğer ürün bulunamazsa hata mesajı döner
        }

        res.status(200).json({ message: 'Ürün başarıyla silindi.', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Ürün silinirken bir hata oluştu.', error });
    }
};

// Tüm ürünleri listeleme
exports.list_products = async (req, res) => {
    try {
        // Tüm ürünleri almak için find() metodu kullanılır
        const products = await Product.find();

        // Eğer ürün yoksa, uygun bir mesaj dönülür
        if (products.length === 0) {
            return res.status(404).json({ message: 'Hiç ürün bulunamadı.' });
        }

        // Ürünler başarıyla listelendiyse, verileri geri döneriz
        res.status(200).json({ message: 'Ürünler başarıyla listelendi.', products });
    } catch (error) {
        // Eğer bir hata oluşursa, hata mesajı döneriz
        res.status(500).json({ message: 'Ürünler listelenirken bir hata oluştu.', error });
    }
};
