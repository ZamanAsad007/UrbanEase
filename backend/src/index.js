const express = require('express');
const cors = require('cors');
const { serverConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Mount user routes
app.use('/api', apiRoutes);

app.listen(serverConfig.PORT, () => {
    console.log(`Successfully started on the server on PORT : ${serverConfig.PORT}`);

});

