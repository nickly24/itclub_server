const express = require('express');
const cors = require('cors');
const filialsRoutes = require('./routes/filials');
const schedulesRoutes = require('./routes/schedules');
const probRoutes = require('./routes/probfilials');
const bodyParser = require('body-parser');
const invoicesRouter = require('./routes/invoices');
const app = express();
const port = 3001;
const invoiceRoutes = require('./routes/invoiceRoutes'); // Импортируем новые маршруты
app.use(cors());
app.use(express.json());

// Используем маршруты
app.use('/api', invoiceRoutes); // Используем новые маршруты
app.use('/api/filials', filialsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/probfilials', probRoutes);
app.use('/api', invoicesRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
