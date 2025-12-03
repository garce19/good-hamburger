const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await db.query('SELECT 1');
        console.log('Database connection established successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        }
        );
    } catch (err) {
        console.error('Unable to connect to the database:', err.message);
        process.exit(1);
    }
};

startServer();