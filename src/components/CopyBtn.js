import React, {useState, useRef} from 'react';
import {Overlay, Tooltip} from 'react-bootstrap'


function CopyBtn(props) {
    const [copySuccess, setCopySuccess] = useState(false)
    const textAreaRef = useRef(null)
    const copyBtnRef = useRef(null)
    function handleCopy(e) {
        console.log(textAreaRef.current.value)
        textAreaRef.current.select()
        document.execCommand('copy')
        e.target.focus()
        setCopySuccess(true)
        setTimeout(() => {
            setCopySuccess(false)
        }, 3000)
    }
    return(
        <div className='row pr-3'>
            {/* <textarea ref={textAreaRef} style={{height: 0, width: 0, position: 'fixed', top:'-50px', right: '-50px'}} value={props.value} readOnly></textarea> */}
            <button ref={copyBtnRef} onClick={handleCopy} className='btn btn-outline-dark col-2 py-1' style={{fontSize: 13}}>Copy</button>
            <input className='col form-control bg-transparent border-0 shadow-none py-1' ref={textAreaRef}  value={props.value} readOnly></input>
            {/* <button ref={copyBtnRef} onClick={handleCopy} className='btn btn-warning px-2 py-0' style={{fontSize: 12, background: 'none', border: 'none', boxShadow: 'none'}}> */}
            <Overlay target={copyBtnRef.current} show={copySuccess} placement='left'>
                {(props) => (
                    <Tooltip {...props}>
                        Coppied!
                    </Tooltip>
                )}
            </Overlay>
        </div>
    )
}

export default CopyBtn