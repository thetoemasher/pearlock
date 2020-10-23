import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useFocus} from './utils'



function Login(props) {
    const [username, setUsername] = useState('pearlock')
    const [password, setPassword] = useState('buttsbuttsbutts')
    const [error, setError] = useState('')
    const [usernameRef, setUsernameFocus] = useFocus()
    const [passwordRef, setPasswordFocus] = useFocus()
console.log('props', props)
    useEffect(() => {
        async function fetchData() {
            try{
                //add loading
                const userRes = await axios.get('/api/user')
                if(userRes.data.user) {
                  props.setUser(userRes.data.user) 
                  props.history.push('/' + userRes.data.user.username)
                  console.log('um?')
                }
            } catch(error) {
                console.log('error', error)
            }
        }
        fetchData()
      }, [])

    return (
        <div className='row bg-primary d-flex-row justify-content-center' style={{height: '50%', width: '30%'}}>
            <div className='col' style={{height: '100%'}}>
                {error && (
                    <div>
                        <p>{error}</p>
                    </div>
                    )
                }
                <div onKeyDown={e => e.key === 'Enter' && loginUser()} style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <input className="form-control" placeholder='Username' ref={usernameRef} type='text' value={username} onChange={e => setUsername(e.target.value)}/>
                    <input className="form-control" placeholder='Password' ref={passwordRef} type='password' value={password} onChange={e => setPassword(e.target.value)}/>
                    <button className='btn btn-dark' variant='contained' onClick={loginUser}>Login</button>
                </div>
            </div>
        </div>
    )
    async function loginUser() {
        setError('')
        //add loading
        if(!username) {
            setError('Username required')
            setUsernameFocus()
            return
        }
        if(!password) {
            setError('Password required')
            setPasswordFocus()
            return
        }
        let loginResults = await axios.post('/api/login', {username, password})
        if(loginResults.data.error) {
            setError(loginResults.data.error)
            return
        }
        props.setUser(loginResults.data.user)
        props.history.push('/' + loginResults.data.user.username)

    }
}

export default Login