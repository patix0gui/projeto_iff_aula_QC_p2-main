import express from 'express';
import cors from 'cors';
import userRoutes from './src/routes/userRoutes.js';
import { initializeDatabase } from './src/config/migrations.js';
import dbConfig from './src/config/database.js';

const app = express();
//const HOST = 'localhost';
const PORT = process.env.PORT || 3000;

// Initialize database
console.log('🔧 Initializing database...');
try {
  initializeDatabase();
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users'
    }
  });
});

// Routes
app.use('/api/users', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: true,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Route not found'
  });
});

// Start server
// app.listen(PORT, HOST, () => {
//   console.log(`🚀 Server running at http://${HOST}:${PORT}`);
//   console.log(`📚 API documentation available at http://${HOST}:${PORT}/`);
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  dbConfig.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  dbConfig.close();
  process.exit(0);
});

export default app;
