module.exports = {
    // ENDPOINTS
    initEndpoints: async (_express, _app) => {
        const fs = require('fs');
        const path = require('path');
        const routes = fs.readdirSync(path.join(__dirname, '../../app/routes'));
        routes.forEach(cont => {
            _app.use('/api/' + cont.replace('.route.js', '').replace('.', '/'), require('../../app/routes/' + cont)(_express, _app));
        });
    }
};
