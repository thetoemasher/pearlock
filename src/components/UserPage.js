import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useFocus} from './utils'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Link} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalBody: {
      backgroundColor: 'white',
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  
function UserPage(props) {
    const [games, setGames] = useState([])
    const [userCheckLoading, setUserCheckLoading] = useState(false)
    const [openCreateGame, setOpenCreateGame] = useState(false)
    const classes = useStyles()
    useEffect(() => {
        //add some sort of loading for this
        async function fetchData() {
            try{
                setUserCheckLoading(true)
                let foundUser = false
                let {user} = props.user
                if(!user) {
                    console.log('1')
                    const userRes = await axios.get('/api/user')
                    if(userRes.data.user) {
                    console.log('2')
                        setUserCheckLoading(false)
                        foundUser = true
                        user = userRes.data.user
                      props.setUser(userRes.data.user) 
                    } 
                } else {
                    foundUser = true
                }
                if(!foundUser) {
                    console.log('3')
                    props.history.push('/')
                } else {
                    document.title = user.username
                    const gamesRes = await axios.get(`/api/${user.user_id}/games`)
                    setGames(gamesRes.data)
                    setUserCheckLoading(false)
                }
            } catch(error) {
                console.log('error', error)
            }
        }
        fetchData()
      }, [])
console.log('games', games)
      const gamesMap = games.map(g => {
          return (
          <div>
                <div>{g.game_name}</div>
                <div>
                    <div>URL</div>
                    <div>{`http://localhost:3000/#/${props.user.username}/${g.game_id}/${g.game_name}/submit`}</div>
          <div>Number Submitted: {g.submission_count}</div>
                </div>
                <Link to={`/${props.user.username}/game/${g.game_id}/${g.game_name}/play`}><button>Start Game</button></Link>
            </div>
          )
      })


    return (
        <div>
            {userCheckLoading && <div>Loading</div>}
            {
                !userCheckLoading && props.user && 
                (
            <div>
                <div>{props.user.username}</div>
                <div>
                    <div>Games</div>
                    <button variant="contained" onClick={() => setOpenCreateGame(true)}>Create Game</button>
                    {games.length > 0 ? gamesMap :
                        (
                            <div>No games yet</div>
                        )
                    }
                </div>
            </div>
                )
            }
            <Modal
                open={openCreateGame}
                onClose={() => setOpenCreateGame(false)}
                className={classes.modal}
            >
                <div className={classes.modalBody}>
                    <div>
                        Sup
                        <CreateGameModalBody user={props.user} setGames={setGames} games={games} closeModal={() => setOpenCreateGame(false)}/>
                    </div>
                </div>
            </Modal>
            
        </div>
    )
}

function CreateGameModalBody(props) {
    const [gameName, setGameName] = useState('')
    const [gameDescription, setGameDescription] = useState('')
    const [error, setError] = useState('')
    const [gameNameRef, setGameNameFocus] = useFocus()
    const [gameDescriptionRef, setGameDescriptionFocus] = useFocus()

    
    return(
        <div>
            {error && (
                <div>
                    {error}
                </div>
            )}
            <div>
                <input placeholder='Game Name' ref={gameNameRef} type='text' value={gameName} onChange={(e) => setGameName(e.target.value)}/>
                <input placeholder='Game Description' ref={gameDescriptionRef} type='text' value={gameDescription} onChange={(e) => setGameDescription(e.target.value)}/>
            </div>
            <div>
                <button variant='contained' onClick={createGame}>Save</button>
            </div>
        </div>
    )
    async function createGame() {
        setError('')
        if(!gameName) {
            setError('Game Name Required')
            setGameNameFocus()
            return
        } else if(!gameDescription) {
            setError('Game Description Required')
            setGameDescriptionFocus()
            return
        } else {
            setError('')
            console.log(gameName, gameDescription)
            const newGame = {game_name: gameName, game_description: gameDescription}
            try{
                const createGameRes = await axios.post(`/api/${props.user.user_id}/game/create`, newGame)
                props.setGames([...props.games, createGameRes.data])
                props.closeModal()
            } catch(error) {
                console.log('error', error)
            }

        }
    }
}

export default UserPage