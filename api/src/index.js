const app = require('./app');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Capstone application listening on http://localhost:${PORT}`);
})
