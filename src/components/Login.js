import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {useFocus} from './utils'
import pearlockWPipe from '../assets/pearlock_w_pipe.png'



function Login(props) {
    const [username, setUsername] = useState('pearlock')
    const [password, setPassword] = useState('buttsbuttsbutts')
    const [error, setError] = useState('')
    const [usernameRef, setUsernameFocus] = useFocus()
    const [passwordRef, setPasswordFocus] = useFocus()
    const [loading, setLoading] = useState(false)
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
        <div className='row bg-light d-flex flex-row justify-content-center shadow p-3 mb-5 rounded' style={{height: '50%', width: '40%'}}>
            <div className='col' style={{height: '100%'}}>
                <div onKeyDown={e => e.key === 'Enter' && loginUser()} style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <div className='d-flex flex-column align-items-center'>
                        <img src={pearlockWPipe} height='100' width='100'/>
                        <h2>Pearlock Holmes</h2>
                        {error && <div><p style={{color: 'red'}}>{error}</p></div>}
                    </div>
                    <input className='form-control shadow-sm' placeholder='Username' ref={usernameRef} type='text' value={username} onChange={e => setUsername(e.target.value)} disabled={loading}/>
                    <input className='form-control shadow-sm' placeholder='Password' ref={passwordRef} type='password' value={password} onChange={e => setPassword(e.target.value)} disabled={loading}/>
                    <button className='btn btn-dark' variant='contained' onClick={loginUser} disabled={loading}>
                        {loading ? (
                            <div class="spinner-border text-light" role="status" style={{height: 24, width: 24}}>
                          </div>
                        ): 
                        'Login'
                        }
                        </button>
                </div>
            </div>
        </div>
    )
    async function loginUser() {
        setError('')
        //add loading
        setLoading(true)
        if(!username) {
            setError('Username required')
            setUsernameFocus()
            setLoading(false)
            return
        }
        if(!password) {
            setError('Password required')
            setPasswordFocus()
            setLoading(false)
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