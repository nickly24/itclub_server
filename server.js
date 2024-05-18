const express = require('express');
const cors = require('cors');
const filialsRoutes = require('./routes/filials');
const schedulesRoutes = require('./routes/schedules');
const probRoutes = require('./routes/probfilials');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Используем маршруты
app.use('/api/filials', filialsRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/probfilials', probRoutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
