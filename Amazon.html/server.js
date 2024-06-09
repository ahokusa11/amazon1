const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(bodyParser.json());
app.use(cors());

// MongoDB接続
mongoose.connect('mongodb://localhost:27017/amazon-gift');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// スキーマとモデルの設定
const giftCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true },
    isWon: { type: Boolean, default: false },
});

const GiftCode = mongoose.model('GiftCode', giftCodeSchema);

// ギフト券コードの追加
app.post('/add-gift-code', (req, res) => {
    console.log('Request to add gift code:', req.body);
    const newCode = new GiftCode({
        code: req.body.code,
        quantity: req.body.quantity,
    });

    newCode.save((err) => {
        if (err) {
            console.error('Error saving gift code:', err);
            return res.status(500).send(err);
        }
        res.status(200).send({ message: 'Gift code added successfully' });
    });
});

// ギフト券コードの取得（管理者用）
app.get('/gift-codes', (req, res) => {
    GiftCode.find({}, (err, codes) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(codes);
    });
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
