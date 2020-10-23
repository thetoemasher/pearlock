import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {shuffle} from './utils'
import GamePage from './GamePage'
// import { makeStyles } from '@material-ui/core/styles';
// import Modal from '@material-ui/core/Modal';
import {Switch, Route, Link} from 'react-router-dom'

function GameStart(props) {
    const [gameInfo, setGameInfo] = useState(null)
    const [gameSubmissions, setGameSubmissions] = useState([])
    const [userCheckLoading, setUserCheckLoading] = useState(true)
    const [pageNum, setPageNum] = useState(0)
    const [submitterNames, setSubmitterNames] = useState([])
    const {game_id, game_name} = props.match.params
    const {user, setUser} = props
    useEffect(() => {
        //add some sort of loading for this
        async function fetchData() {
            try{
                setUserCheckLoading(true)
                document.title = game_name
                let foundUser = false
                let currentUser = user
                if(!currentUser) {
                    const userRes = await axios.get('/api/user')
                    if(userRes.data.user) {
                        // setUserCheckLoading(false)
                        foundUser = true
                        currentUser = userRes.data.user
                        props.setUser(userRes.data.user) 
                    } 
                } else {
                    foundUser = true
                }
                if(!foundUser) {
                    console.log('3')
                    props.history.push('/')
                } else {
                    const gameInfoRes = await axios.get('/api/game/' + game_id)
                    setGameInfo(gameInfoRes.data)
                    const gameSubmissionsRes = await axios.get('/api/game/submissions/' + game_id)
                    const subs = shuffle(gameSubmissionsRes.data)
                    let names = []
                    // console.log(subs)
                    setGameSubmissions(subs)
                    gameSubmissionsRes.data.forEach(gs => {
                        names.push(gs)
                    })
                    names = names.sort((a, b) => a.submitter_name.toLowerCase()[0] > b.submitter_name.toLowerCase()[0])
                    setSubmitterNames(names)
                    setUserCheckLoading(false)
                }
            } catch(error) {
                console.log('error', error)
            }
        }
        fetchData()
      }, [game_id])
// console.log('SubmitterNames', submitterNames)
    return (
        <div>
            {userCheckLoading && <div>Loading</div>}
            {
                !userCheckLoading && user && 
                (
                    <Switch>
                        <Route path='/:username/game/:game_id/:game_name/play' exact>
                            <div>
                                <div>Welcome {user.username}</div>
                                <div>Name: {gameInfo.game_name}</div>
                                <div>Description: {gameInfo.game_description}</div>
                                <div>Press Start when you are ready to begin deducing</div>
                                <Link to={`/${user.username}/game/${game_id}/${game_name}/play/${gameSubmissions[0].game_submission_id}`}><button>Start</button></Link>
                            </div>
                        </Route>
                        <Route path='/:username/game/:game_id/:game_name/play/:game_submission_id' render={(props) => <GamePage key={props.match.params.game_submission_id} {...props} key={props.match.params.game_submission_id} setUser={setUser} user={user} pageNum={pageNum} setPageNum={setPageNum} gameSubmissions={gameSubmissions} setGameSubmissions={setGameSubmissions} gameInfo={gameInfo} submitterNames={submitterNames} />}></Route>
                    </Switch>
                )
            }
            
            
        </div>
    )
}


export default GameStart