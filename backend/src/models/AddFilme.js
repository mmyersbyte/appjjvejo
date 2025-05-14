import mongoose from 'mongoose';

const AddFilmeSchema = new mongoose.Schema(
  {
    nomeFilme: {
      type: String,
      required: true,
    },
    imagemFilme: {
      type: String,
      required: false,
    },
    dataAssistir: {
      type: Date,
      required: false,
    },
    descricao: {
      type: String,
      required: false,
      maxlength: 144,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AddFilme', AddFilmeSchema);
