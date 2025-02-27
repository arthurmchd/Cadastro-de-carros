const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const path = require('path');

// carrega as variáveis do alo.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// conecta com o MYSQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'estacionamento',
});
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/form', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// rota para adicionar um novo carro ao banco
app.post('/cars', (req, res) => {
  const { placa, modelo, cor } = req.body;

  // vê se todos os campos foram preenchidos
  if (!placa || !modelo || !cor) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // coloca o carro no banco
  const query = 'INSERT INTO cars (placa, modelo, cor) VALUES (?, ?, ?)';
  connection.query(query, [placa, modelo, cor], (err, results) => {
    if (err) {
      console.error('Erro ao inserir no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao salvar o carro no banco de dados.' });
    }
    res.status(201).json({ message: 'Carro adicionado com sucesso!' });
  });
});

// rota para listar todos os carros cadastrados
app.get('/cars', (req, res) => {
  const query = 'SELECT * FROM cars';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar carros:', err);
      return res.status(500).json({ error: 'Erro ao buscar carros no banco de dados.' });
    }
    res.json(results);
  });
});

// rota para atualizar informações de um carro 
app.put('/cars/:placa', (req, res) => {
  const { modelo, cor } = req.body;
  const { placa } = req.params;

  const query = 'UPDATE cars SET modelo = ?, cor = ? WHERE placa = ?';
  connection.query(query, [modelo, cor, placa], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao atualizar o carro no banco de dados.' });
    }
    res.json({ message: 'Carro atualizado com sucesso!' });
  });
});

// rota para deletar um carro específico
app.delete('/cars/:placa', (req, res) => {
  const { placa } = req.params;
  const query = 'DELETE FROM cars WHERE placa = ?';
  connection.query(query, [placa], (err, results) => {
    if (err) {
      console.error('Erro ao deletar carro:', err);
      return res.status(500).json({ error: 'Erro ao deletar o carro no banco de dados.' });
    }
    res.json({ message: 'Carro deletado com sucesso!' });
  });
});

// inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// pesquisei algumas funções no Google para deixar meu projeto um pouco mais fácil de desenvolver e usar, mas entendi como todas elas funcionam
