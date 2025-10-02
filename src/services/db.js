import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/config.js';

const connectDB = async () => {
  try {
    console.log('🔄 Conectando a MongoDB...');

    await mongoose.connect(MONGODB_URI);

    console.log('✅ Conexión a MongoDB establecida correctamente');
    console.log(`📍 Base de datos: ${mongoose.connection.name}`);

  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);

    // Si falla la conexión inicial, intentar reconectar después de 5 segundos
    setTimeout(() => {
      console.log('🔄 Reintentando conexión...');
      connectDB();
    }, 5000);
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('📡 Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Mongoose desconectado de MongoDB');
});

// Cerrar la conexión cuando la aplicación termine
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📡 Conexión a MongoDB cerrada por terminación de la aplicación');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cerrar la conexión:', error);
    process.exit(1);
  }
});

export default connectDB;
