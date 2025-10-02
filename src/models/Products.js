import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  code: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio debe ser positivo']
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    validate: {
      validator: Number.isInteger,
      message: 'El stock debe ser un número entero'
    }
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    enum: {
      values: ['Autos', 'Motos', 'Camionetas', 'SUV'],
      message: 'La categoría debe ser: Autos, Motos, Camionetas o SUV'
    }
  },
  thumbnails: {
    type: [String],
    default: [],
    validate: {
      validator: function(arr) {
        return arr.length <= 5;
      },
      message: 'No se pueden agregar más de 5 imágenes'
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices para mejorar rendimiento
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ status: 1 });

// Plugin de paginación
productSchema.plugin(mongoosePaginate);

// Middleware pre-save para validaciones adicionales
productSchema.pre('save', function(next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

// Métodos
productSchema.methods.isAvailable = function() {
  return this.status && this.stock > 0;
};

productSchema.statics.findByCategory = function(category) {
  return this.find({ category: new RegExp(category, 'i'), status: true });
};

// Virtual
productSchema.virtual('availability').get(function() {
  if (!this.status) return 'Inactivo';
  if (this.stock === 0) return 'Sin stock';
  if (this.stock < 5) return 'Poco stock';
  return 'Disponible';
});

// Incluir virtuals en JSON
productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
