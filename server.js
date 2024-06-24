const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let gameState = {
    currentPlayer: 'Ruperto',
    score: {'Ruperto': 100000, 'Juan': 100000, 'Mauricio': 100000},
    diamondStates: [
        {available: true, emoji: '💎'},
        {available: true, emoji: '💎'},
        {available: true, emoji: '☀️'},
        {available: true, emoji: '☀️'}
    ],
    goldBarStates: [
        {available: true, emoji: '💰'},
        {available: true, emoji: '💰'},
        {available: true, emoji: '🥇'},
        {available: true, emoji: '🥇'}
    ],
    rubyStates: [
        {available: true, emoji: '🔴'},
        {available: true, emoji: '🔴'},
        {available: true, emoji: '🍀'},
        {available: true, emoji: '🍀'}
    ],
    trophyStates: [
        {available: true, emoji: '💚'},
        {available: true, emoji: '💚'},
        {available: true, emoji: '🏆'},
        {available: true, emoji: '🏆'}
    ],
    takenRowsByPlayer: {Ruperto: [], Juan: [], Mauricio: []},
    takenCount: 0,
    timeLeft: 10,
};
app.use(bodyParser.json());
app.use(cors());

// Endpoint para el inicio de sesión con Facebook
app.get('/login/facebook', (req, res) => {
    // Aquí deberías implementar el flujo de inicio de sesión con Facebook
    // Devuelve la información del usuario (username, lastName, pin) y un token
    // Simula la respuesta para este ejemplo
    const userData = {
        username: 'UsuarioDeFacebook',
        lastName: 'ApellidoDeFacebook',
        pin: 'PINDeFacebook',
        token: 'TOKEN_GENERADO'
    };
    // Abrir ventana de la aplicación con los datos del usuario
    res.send(`<script>window.opener.postMessage(${JSON.stringify(userData)}, '*');window.close();</script>`);
});

// This line should come after initializing `app`
app.use(express.static('public'));
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('initialState', gameState);

    socket.on('updateState', (updatedState) => {
        gameState = updatedState;
        io.emit('stateChanged', gameState);
    });

    // Manejar el evento de registro de un nuevo jugador
    socket.on('registerPlayer', (username) => {
        gameState.score[username] = 100000; // Inicializar el puntaje del nuevo jugador
        gameState.takenRowsByPlayer[username] = []; // Inicializar las filas tomadas por el nuevo jugador
        io.emit('updatePlayersList', Object.keys(gameState.score)); // Emitir la lista actualizada de jugadores a todos los clientes
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});