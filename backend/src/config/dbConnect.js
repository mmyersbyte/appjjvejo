import dotenv from 'dotenv';
import moongose from 'mongoose';
dotenv.config();
export async function conectaNaDataBase() {
  moongose.connect(process.env.DB_CONNECTION_STRING);
  return moongose.connection;
}

export default conectaNaDataBase;
