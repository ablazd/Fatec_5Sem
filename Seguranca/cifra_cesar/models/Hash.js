import mongoose from 'mongoose';

const hashSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  passo: {
    type: Number,
    required: true
  },
  usado: {
    type: Boolean,
    default: false
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  usadoEm: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Índice para busca rápida de hashes
hashSchema.index({ hash: 1, usado: 1 });

const Hash = mongoose.model('Hash', hashSchema);

export default Hash;
