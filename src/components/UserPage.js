import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useFocus} from './utils'
import {Link} from 'react-router-dom'
import CopyBtn from './CopyBtn'
import {Modal} from 'react-bootstrap'

  
function UserPage(props) {
    const [games, setGames] = useState([])
    const [userCheckLoading, setUserCheckLoading] = useState(false)
    const [openCreateGame, setOpenCreateGame] = useState(false)
    const baseURL = 'http://localhost:3000/#/'
    useEffect(() => {
        //add some sort of loading for this
        async function fetchData() {
            try{
                setUserCheckLoading(true)
                let foundUser = false
                let {user} = props.user
                if(!user) {
                    const userRes = await axios.get('/api/user')
                    if(userRes.data.user) {
                        setUserCheckLoading(false)
                        foundUser = true
                        user = userRes.data.user
                      props.setUser(userRes.data.user) 
                    } 
                } else {
                    foundUser = true
                }
                if(!foundUser) {
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
      const gamesMap = games.map((g, i) => {
          return (
          <div className='card m-1 row' key={`game_${g.game_id}`}>
                    <div className='card-body col'>
                        <div className='row'>
                            <div className='col'>
                                <h5 className='card-title'>{g.game_name}</h5>
                                <h6 className='card-subtitle text-muted ml-2 mt-1'>{g.game_description}</h6>
                            </div>
                            <div className='col'>
                                <div className='mb-2'>Number Submitted: {g.submission_count}</div>
                                <CopyBtn value={`${baseURL}${props.user.username}/${g.game_id}/${g.game_name}/submit`}/>
                            </div>
                        </div>
                        <Link to={`/${props.user.username}/game/${g.game_id}/${g.game_name}/play`}><button className='btn btn-secondary'>Start Game</button></Link>
                    </div>
                  </div>
          )
      })


    return (
        <div className='row bg-light justify-content-center shadow p-3 my-3 rounded overflow-auto' style={{height: '95%', width: '95%'}}>
            {userCheckLoading && <div>Loading</div>}
            {
                !userCheckLoading && props.user && 
                (
            <div className='col'>
                <div className='row d-flex p-3 d-flex justify-content-between'>
                    <h2>{props.user.username}</h2>
                    <button className='btn btn-info' variant="contained" onClick={() => setOpenCreateGame(true)}>Create Game</button>
                </div>
                    {games.length > 0 ? gamesMap :
                        (
                            <div>No games yet</div>
                        )
                    }
            </div>
                )
            }
            <Modal show={openCreateGame} onHide={() => setOpenCreateGame(false)}>
                <CreateGameModalBody user={props.user} setGames={setGames} games={games} closeModal={() => setOpenCreateGame(false)}/>
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
    const [createGameLoading, setCreateGameLoading] = useState(false)

    
    return(
        <div>
            <Modal.Header closeButton>
                <Modal.Title>Create A New Game</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <div className='alert alert-danger'>
                        {error}
                    </div>
                )}
                <div>
                    <input className='form-control' placeholder='Game Name' ref={gameNameRef} type='text' value={gameName} onChange={(e) => setGameName(e.target.value)}/>
                    <textarea className='form-control mt-2' placeholder='Game Description' ref={gameDescriptionRef} type='text' value={gameDescription} onChange={(e) => setGameDescription(e.target.value)}/>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-info w-3' variant='contained' onClick={createGame}>
                    {
                        createGameLoading ? (
                            <div class="spinner-border text-light" role="status" style={{height: 24, width: 24}}>
                          </div>
                        ) : 
                        'Save'
                    }
                    </button>
            </Modal.Footer>
        </div>
    )
    async function createGame() {
        setError('')
        setCreateGameLoading(true)
        if(!gameName) {
            setError('Game Name Required')
            setGameNameFocus()
            setCreateGameLoading(false)
            return
        } else if(!gameDescription) {
            setError('Game Description Required')
            setGameDescriptionFocus()
            setCreateGameLoading(false)
            return
        } else {
            setError('')
            gameNameRef.current.disabled = true
            gameDescriptionRef.current.disabled = true
            const newGame = {game_name: gameName, game_description: gameDescription}
            try{
                const createGameRes = await axios.post(`/api/${props.user.user_id}/game/create`, newGame)
                props.setGames([...props.games, createGameRes.data])
                props.closeModal()
                setCreateGameLoading(false)
            } catch(error) {
                console.log('error', error)
                gameNameRef.current.disabled = false
                gameDescriptionRef.current.disabled = false
            }
            // setTimeout(() => {
            //     props.closeModal()
            //     setCreateGameLoading(false)

            // }, 5000)

        }
    }
}

export default UserPage