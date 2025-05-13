import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Chave secreta para assinar o JWT - em um ambiente de produção, deve estar no .env
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_temporaria';

// Função para extrair o corpo da requisição em uma API HTTP sem frameworks
const extrairCorpo = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let corpo = '';

      req.on('data', (chunk) => {
        corpo += chunk.toString();
      });

      req.on('end', () => {
        try {
          const dadosJSON = JSON.parse(corpo);
          resolve(dadosJSON);
        } catch (error) {
          reject(new Error('Erro ao fazer parse do JSON'));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Função para registrar um novo usuário
export async function registrarUsuario(req, res) {
  try {
    // Extrair dados do corpo da requisição
    const dadosUsuario = await extrairCorpo(req);

    // Verificar se todos os campos necessários estão presentes
    if (!dadosUsuario.nome || !dadosUsuario.email || !dadosUsuario.senha) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Todos os campos são obrigatórios: nome, email e senha',
        })
      );
      return;
    }

    // Verificar se o e-mail já está cadastrado
    const usuarioExistente = await User.findOne({ email: dadosUsuario.email });
    if (usuarioExistente) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'E-mail já cadastrado',
        })
      );
      return;
    }

    // Criar um novo usuário
    const novoUsuario = new User({
      nome: dadosUsuario.nome,
      email: dadosUsuario.email,
      senha: dadosUsuario.senha, // Senha será hasheada pelo middleware no modelo
    });

    // Salvar o usuário no banco de dados
    await novoUsuario.save();

    // Gerar token JWT
    const token = jwt.sign(
      { id: novoUsuario._id, email: novoUsuario.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar resposta de sucesso sem expor a senha
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: false,
        mensagem: 'Usuário registrado com sucesso',
        usuario: {
          id: novoUsuario._id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
        },
        token,
      })
    );
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
  }
}

// Função para fazer login
export async function loginUsuario(req, res) {
  try {
    // Extrair dados do corpo da requisição
    const dadosLogin = await extrairCorpo(req);

    // Verificar se email e senha estão presentes
    if (!dadosLogin.email || !dadosLogin.senha) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Email e senha são obrigatórios',
        })
      );
      return;
    }

    // Buscar usuário pelo email com a senha (que normalmente fica oculta)
    const usuario = await User.findOne({ email: dadosLogin.email }).select(
      '+senha'
    );

    // Verificar se o usuário existe
    if (!usuario) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Credenciais inválidas',
        })
      );
      return;
    }

    // Verificar se a senha está correta
    const senhaCorreta = await usuario.verificaSenha(dadosLogin.senha);
    if (!senhaCorreta) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Credenciais inválidas',
        })
      );
      return;
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar resposta de sucesso sem expor a senha
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: false,
        mensagem: 'Login realizado com sucesso',
        usuario: {
          id: usuario._id,
          nome: usuario.nome,
          email: usuario.email,
        },
        token,
      })
    );
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
  }
}

// Middleware para verificar autenticação
export function verificarToken(req, res, next) {
  try {
    // Obter o cabeçalho de autorização
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Token não fornecido',
        })
      );
      return;
    }

    // Extrair o token do cabeçalho (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          erro: true,
          mensagem: 'Formato de token inválido',
        })
      );
      return;
    }

    // Verificar e decodificar o token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            erro: true,
            mensagem: 'Token inválido ou expirado',
          })
        );
        return;
      }

      // Adicionar informações do usuário à requisição
      req.usuario = decoded;
      next();
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        erro: true,
        mensagem: 'Erro interno do servidor',
      })
    );
  }
}
