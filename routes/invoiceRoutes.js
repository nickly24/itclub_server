const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const API_KEY = 'live_rM4sET_1TGTYlDWDN078ADcJKEAaM94SkUkrtu2CeYE';
const SHOP_ID = '367847';
const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3/payments';

router.post('/create-payment', async (req, res) => {
    const paymentData = req.body;
    const idempotenceKey = uuidv4(); // Генерация уникального ключа

    // Создание правильной структуры paymentData
    const paymentRequest = {
        amount: paymentData.amount, // { value: "1000.00", currency: "RUB" }
        payment_method_data: {
            type: 'bank_card'
        },
        confirmation: {
            type: 'redirect',
            return_url: 'https://your-return-url.com' // Замените на ваш фактический URL
        },
        description: paymentData.description, // "Payment for B2O6"
        metadata: paymentData.metadata // Дополнительные данные, если есть
    };

    try {
        console.log('Создание платежа с данными:', paymentRequest);
        const response = await axios.post(YOOKASSA_API_URL, paymentRequest, {
            auth: {
                username: SHOP_ID,
                password: API_KEY
            },
            headers: {
                'Content-Type': 'application/json',
                'Idempotence-Key': idempotenceKey // Добавление идемпотентного ключа
            }
        });
        console.log('Ответ сервера YooKassa:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Ошибка при создании платежа:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
