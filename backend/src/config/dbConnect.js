import moongose from 'mongoose';

export async function conectaNaDataBase() {
  moongose.connect(process.env.DB_CONNECTION_STRING);
  return moongose.connection;
}

export default conectaNaDataBase;
