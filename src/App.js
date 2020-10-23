import React, {useState} from 'react';
// import './App.css';
import {Switch, Route} from 'react-router-dom'
import Login from './components/Login'
import Submit from './components/Submit'
import UserPage from './components/UserPage'
import GameStart from './components/GameStart'

function App() {
  const [user, setUser] = useState('')
  return (
    <div className='row bg-secondary' style={{width: '100vw', height: '100vh'}}>
      <div className='col'>
        <Switch>
          <Route path='/' exact render={(props) => <Login setUser={setUser} {...props}/>}/>
          <Route path='/:username/:game_id/:game_name/submit' exact render={(props) => <Submit setUser={setUser} user={user} {...props}/>}/>
          <Route path='/:user' exact render={(props) => <UserPage setUser={setUser} user={user} {...props}/>}/>
          <Route path='/:username/game/:game_id/:game_name/play' render={(props) => <GameStart setUser={setUser} user={user} {...props}/>}/>
        </Switch>
      </div>
    </div>
  );
}

export default App;
