import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {shuffle} from './utils'
import {useRef} from 'react';
import {withRouter} from 'react-router-dom'

// import { makeStyles } from '@material-ui/core/styles';
// import Modal from '@material-ui/core/Modal';
// import {Switch, Route, Link} from 'react-router-dom'

function GamePage(props) {
    const [max, setMax] = useState(500)
    const [sizeMultiplier, setSizeMultiplier] = useState(1)
    const [submitterSelect, setSubmitterSelect] = useState('')
    const [guessCheck, setGuessCheck] = useState(false)
    const [imageContainerRef, setImageContainerRef] = useState(useRef(null))
    const [imageRef, setImageRef] = useState(useRef(null))
    const [pos, setPos] = useState({top: 0, left: 0, x: 0, y: 0})
    const [mouseDownToggle, setMouseDownToggle] = useState(false)
    const {gameInfo, gameSubmissions, pageNum, submitterNames, setGameSubmissions, setPageNum} = props
    const {game_id, game_name, game_submission_id, username} = props.match.params
console.log('submitterSelect', submitterSelect)

    useEffect(() => {
        console.log(gameSubmissions)
        const subCheck = gameSubmissions.findIndex(gs => gs.game_submission_id === +game_submission_id)
        console.log('subcheck', subCheck)
        if(subCheck >= 0) {
            setPageNum(subCheck)
        } else {
            props.history.push(`/${username}/game/${game_id}/${game_name}/play/${gameSubmissions[pageNum].game_submission_id}`)
        }
        // let splitPath = props.location.pathname.split('/')
        // splitPath[splitPath.length - 1] = gameSubmissions[pageNum].game_submission_id
        // props.history.push(splitPath.join('/'))
    }, [props.history])    
    
    useEffect(() => {
        console.log(gameSubmissions[pageNum])
        if(gameSubmissions[pageNum].guess_number < 3 && !gameSubmissions.correct) {
            setGuessCheck(true)
        } else {
            setGuessCheck(false)
        }
    }, [])
    
    const submitterNamesSelectMap = submitterNames.map(sn => {
        if((!sn.correct) || (gameSubmissions[pageNum].game_submission_id === sn.game_submission_id)) {
            return (
                <option key={sn.game_submission_id} value={sn.game_submission_id}>{sn.submitter_name}</option>
            )
        } 
        return null
    })

    // const nameListMap = sub
    //TODO: 
    //guess btn that checks if name is correct and stores results in guesses table
    //user name list
    //user names list needs to have check if the user has been guessed correctly. (highlight ones that have been)
    //if guessed correctly remove name from select list, unless we are viewing the setup for that use then keep the name in
    //next and previous buttons
    //next incriments pageNum, then pushes to gameSubmissions[new page num].game_submission_id

    return (
        <div>
            <div>
                <div>
                    <div>{gameInfo.game_name}</div>
                </div>
                <div style={{position: 'fixed', top: 0, right: 0}}>
                    <input type='range' onChange={(e) => setSizeMultiplier(e.target.value * .01)} min='50' max={max} value={Math.floor(sizeMultiplier * 100)}/>
                    <input type='number' placeholder='Size %' onChange={updateMax} value={Math.floor(sizeMultiplier * 100)}/>
                    <button onClick={resetMax}>Reset</button>
                </div>
                <div style={{overflow: 'auto', height: '80vh', cursor: 'grab', userSelect: 'none'}} ref={imageContainerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseLeave}>
                    <img src={gameSubmissions[pageNum].img_url} ref={imageRef} height={500 * sizeMultiplier} style={{userSelect: 'none'}} onDragStart={() => false}/>
                </div>
                <div>
                    <select value={submitterSelect} onChange={e => setSubmitterSelect(e.target.value)} disabled={!guessCheck}>
                        <option value=''>Select A Name</option>
                        {submitterNamesSelectMap}
                    </select>
                    <button onClick={makeAGuess} disabled={!guessCheck}>Guess</button>
                </div>
                <div>
                    {pageNum > 0 ? (
                        <button onClick={prevPage}>Previous</button>
                    ) : (
                        <div></div>
                    )}
                    {pageNum < gameSubmissions.length - 1 ? (
                        <button onClick={nextPage}>Next</button>
                    ) : (
                        <button>Finish</button>
                    )}
                </div>
                <div>
                    Name list
                    <div>
                        <div>a</div>
                        <div>s</div>
                        <div>s</div>
                    </div>
                </div>
            </div>
        </div>
    )
    function updateMax(e) {
        if(e.target.value > 500) {
            setMax(e.target.value)
        }
        setSizeMultiplier(e.target.value * .01)
    }
    function resetMax() {
        setMax(500)
        setSizeMultiplier(1)
    }
    function makeAGuess() {

        //if guess count is 3 or more out of guesses
        //if correct is true disable ability to change
        //else let it go

        console.log(submitterSelect)
        console.log(gameSubmissions[pageNum])
        let submission = {...gameSubmissions[pageNum]}
        // let guessCount = gameSubmissions[pageNum].guess_number
        // let correct = gameSubmissions[pageNum].correct
        if(submission.guess_number < 3 && !submission.correct) {
            submission.guess_number += 1
            if(submission.game_submission_id === +submitterSelect) {
                submission.correct = true
                console.log('you did it')
                setGuessCheck(false)
            } else {
                submission.correct = false
                console.log('you failed')
            }
            //send results to the db
            //update state
            let updatedSubmissions = [...gameSubmissions]
            updatedSubmissions[pageNum] = submission
            
            // gameSubmissions[pageNum].correct = correct
            // gameSubmissions[pageNum].guess_number = guessCount
            console.log('um')
            setGameSubmissions(updatedSubmissions)
        } else {
            setGuessCheck(false)
        }
    }
    function handleMouseDown(e) {
        e.preventDefault()
        setPos({top: imageContainerRef.current.scrollTop, left: imageContainerRef.current.scrollLeft, x: e.clientX, y: e.clientY})
        setMouseDownToggle(true)
        return false
    }
    function handleMouseMove(e) {
        if(mouseDownToggle) {
            imageContainerRef.current.style.cursor = 'grabbing'
            imageContainerRef.current.style.userSelect = 'none'
    
            const dx = e.clientX - pos.x
            const dy = e.clientY - pos.y
            imageContainerRef.current.scrollTop = pos.top - dy
            imageContainerRef.current.scrollLeft = pos.left - dx
        }
    }
    function handleMouseUp(e) {
        imageContainerRef.current.style.cursor = 'grab'
        imageContainerRef.current.style.removeProperty('user-select')
        setMouseDownToggle(false)
    }
    function handleMouseLeave(e) {
        if(mouseDownToggle) {
            handleMouseUp(e)
        }
    }
    function nextPage() {
        let next = pageNum + 1
        setPageNum(next)
        props.history.push(`/${username}/game/${game_id}/${game_name}/play/${gameSubmissions[next].game_submission_id}`)
    }
    function prevPage() {
        let prev = pageNum - 1
        setPageNum(prev)
        props.history.push(`/${username}/game/${game_id}/${game_name}/play/${gameSubmissions[prev].game_submission_id}`)
    }
}


export default withRouter(GamePage)