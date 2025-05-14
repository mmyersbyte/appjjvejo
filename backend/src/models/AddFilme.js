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
  },
  { timestamps: true }
);

export default mongoose.model('AddFilme', AddFilmeSchema);
