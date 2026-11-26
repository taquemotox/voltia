// Backend VOLTIA - Express + express-validator
const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'site')));

const contatos = []; // guarda em memoria (projeto escolar)



app.post('/api/contato',
  body('nome').trim().isLength({ min: 5 }).withMessage('Nome muito curto'),
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail(),
  body('telefone').matches(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/).withMessage('Telefone inválido'),
  body('assunto').isIn(['avaliacao', 'seguro', 'parceria', 'outro']).withMessage('Assunto inválido'),
  body('mensagem').trim().isLength({ min: 10, max: 1000 }).withMessage('Mensagem deve ter de 10 a 1000 caracteres').escape(),
  body('lgpd').equals('true').withMessage('É preciso aceitar a LGPD'),
  function (req, res) {
    const erros = validationResult(req);
    if (!erros.isEmpty()) return res.status(400).json({ erros: erros.array() });
    contatos.push(req.body);
    res.json({ mensagem: 'Mensagem enviada com sucesso! Entraremos em contato.' });
  }
);

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, function () { console.log('Servidor rodando na porta ' + PORTA); });
