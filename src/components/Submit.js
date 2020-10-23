import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useFocus} from './utils'



function Submit(props) {
    const [success, setSuccess] = useState('')
    const [url, setUrl] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [gameInfo, setGameInfo] = useState(null)
    const [urlRef, setUrlFocus] = useFocus()
    const [nameRef, setNameFocus] = useFocus()
    const {game_id, game_name, username} = props.match.params
    useEffect(() => {
        document.title = game_name
        async function fetchData() {
            try{
                const gameInfoRes = await axios.get('/api/game/' + game_id)
                setGameInfo(gameInfoRes.data)
            } catch(error) {
                console.log('error', error)
            }

        }
        fetchData()
      }, [game_name, game_id])

      console.log('gameInfo', gameInfo)
    return (
        <div>
            {!gameInfo ? (
                <div>Loading</div>
            ) : (
                <div>
            {error && (
                <div>
                    <p>{error}</p>
                </div>
                )
            }
            {success && <div>Success!!!</div>}
            <h2>Submit to be apart of {username}'s game</h2>
            <h3>{game_name}</h3>
            <h3>{gameInfo.game_description}</h3>
            {gameInfo.complete ? (
                <div>
                    No longer taking submissions
                </div>
            ) : (
                <div>
                    <div onKeyDown={e => e.key === 'Enter' && submitInfo()}>
                        <input placeholder='Name' ref={nameRef} type='text' value={name} onChange={e => setName(e.target.value)}/>
                        <input placeholder='URL' ref={urlRef} type='text' value={url} onChange={e => setUrl(e.target.value)}/>
                    </div>
                    <div>
                        <button onClick={submitInfo}>Submit</button>
                    </div>
                </div>
            )}
            </div>
            )}
        </div>
    )
    async function submitInfo() {
        setError('')
        setSuccess(false)
        //add loading
        if(!name) {
            setError('Name required')
            setNameFocus()
            return
        }
        if(!url) {
            setError('Image URL required')
            setUrlFocus()
            return
        }
        let submitInfoResults = await axios.post('/api/game/' + game_id, {name, url})
        if(submitInfoResults.data.error) {
            setError(submitInfoResults.data.error)
            return
        }
        setSuccess(true)
        return
    }
}

export default Submit