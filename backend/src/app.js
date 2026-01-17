import app from '../server.js';


app.get('/', (req, res) => {
    res.send('Fitness Tracker API is running');
});


// app health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

