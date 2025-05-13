import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    senha: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function (next) {
  // Só executa o hash se a senha foi modificada (ou é nova)
  if (!this.isModified('senha')) return next();

  try {
    // Gera um salt com fator 10
    const salt = await bcrypt.genSalt(10);
    // Substitui a senha em texto por um hash inico
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// verificar senha
userSchema.methods.verificaSenha = async function (senhaFornecida) {
  try {
    // Como 'select: false' no schema, tem q garantir a senha disponiv
    // qnd o método for usado após um User.findOne().select('+senha')
    return await bcrypt.compare(senhaFornecida, this.senha);
  } catch (error) {
    throw new Error('Erro ao verificar senha: ' + error.message);
  }
};

const User = mongoose.model('User', userSchema);

export default User;
