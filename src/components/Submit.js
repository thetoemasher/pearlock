import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useFocus} from './utils'
import {Modal} from 'react-bootstrap'



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
                // gameInfoRes.data.complete = true
                setGameInfo(gameInfoRes.data)
            } catch(error) {
                console.log('error', error)
            }

        }
        fetchData()
      }, [game_name, game_id])

      console.log('gameInfo', gameInfo)
    return (
        <div className='row bg-light justify-content-center shadow p-3 my-3 rounded overflow-auto'>
            {!gameInfo ? (
                <div>Loading</div>
            ) : (
                <div>
            {success && <div>Success!!!</div>}
            <Modal.Header>
                <Modal.Title><h2>{username} has invited you to join</h2></Modal.Title>
            </Modal.Header>
                <Modal.Body>
                <h3 className='text-center'>{game_name}</h3>
                <h4 className='text-muted text-center'>{gameInfo.game_description}<br/>Imgur urls only</h4>
                {error && <div className='alert alert-danger'>{error}</div>}
                {gameInfo.complete ? (
                    <div>
                        No longer taking submissions
                    </div>
                ) : (
                    <div>
                            <div>
                                <div onKeyDown={e => e.key === 'Enter' && submitInfo()}>
                                    <input className='form-control mb-3' placeholder='Name' ref={nameRef} type='text' value={name} onChange={e => setName(e.target.value)}/>
                                    <input className='form-control' placeholder='URL' ref={urlRef} type='text' value={url} onChange={e => setUrl(e.target.value)}/>
                                </div>
                            </div>
                    </div>
                )}
                </Modal.Body>
                {!gameInfo.complete && <Modal.Footer><button className='btn btn-primary' onClick={submitInfo}>Submit</button></Modal.Footer>}

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
        if(!url.includes('imgur.com')) {
            setError('Can only accept imgur URLs at this time')
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