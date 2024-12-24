const express = require('express');
const { serverConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();
app.use(express.json());

// Mount user routes
app.use('/api', apiRoutes);

app.listen(serverConfig.PORT, () => {
    console.log(`Successfully started on the server on PORT : ${serverConfig.PORT}`);

});

