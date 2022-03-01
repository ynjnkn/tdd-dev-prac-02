const app = require('./app');
const port = 5000;
const host = '0.0.0.0';

app.listen(port, () => {
    console.log(`Running on http://${host}:${port}`);
});