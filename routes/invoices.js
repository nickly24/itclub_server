const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const API_KEY = 'live_rM4sET_1TGTYlDWDN078ADcJKEAaM94SkUkrtu2CeYE';
const SHOP_ID = '367847';
const YOOKASSA_API_URL = 'https://api.yookassa.ru/v3/payments';

router.get('/payinfo', async (req, res) => {
    try {
        const response = await axios.get(YOOKASSA_API_URL, {
            auth: {
                username: SHOP_ID,
                password: API_KEY
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/payinfo', async (req, res) => {
    const paymentData = req.body;
    const idempotenceKey = uuidv4(); // Генерация уникального ключа

    try {
        console.log('Создание платежа с данными:', paymentData);
        const response = await axios.post(YOOKASSA_API_URL, paymentData, {
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
