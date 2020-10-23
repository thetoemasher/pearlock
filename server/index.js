require('dotenv').config()
const express = require('express')
const expressSession = require('express-session')
const massive = require('massive')
const {auth_controller, games_controller} = require('./controllers/index')
const app = express()

//login
//save photos and names
//create new game
//get game

const { SESSION_SECRET, SERVER_PORT, DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } = process.env

const session = expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
})

app.use(express.json())
app.use(session)

massive({
    host: DB_HOST, 
    port: DB_PORT, 
    database: DB_DATABASE, 
    user: DB_USER, 
    password: DB_PASSWORD, 
    ssl: {
        rejectUnauthorized: false
    }
}).then(db=>{
		app.set('db', db)
		console.log('db connect success!')
}).catch(error => console.log('error', error))



app.post('/api/login', auth_controller.login)
app.get('/api/user', auth_controller.getUser)
app.get('/api/:user_id/games', games_controller.getGames)
app.post('/api/:user_id/game/create', games_controller.createGame)
app.post('/api/game/:game_id', games_controller.submitInfo)
app.get('/api/game/:game_id', games_controller.getGameInfo)
app.get('/api/game/submissions/:game_id', games_controller.getGameSubmissions)
app.get('/api/images', games_controller.getImages)


app.listen(SERVER_PORT, () => console.log('Butts on butts on ' + SERVER_PORT))