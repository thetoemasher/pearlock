const bcrypt = require('bcrypt')

const login = async (req, res) => {
    const {username, password} = req.body
    const db = req.app.get('db')
    try{
        console.log('starting')
        if(!username) {
            res.status(200).send({error: 'Missing Username'})
            return
        }
        if(!password) {
            res.status(200).send({error: 'Missing Password'})
            return
        }
        let user = await db.users.findOne({username})
        if(!user) {
            res.status(200).send({error: 'Could not find user'})
            return
        }
        let authentication = await bcrypt.compareSync(password, user.password);      
        if(!authentication) {
            res.status(200).send({error: 'Username and password do not match'})
            return
        }
        delete user.password
        req.session.user = user
        console.log('done')
        res.status(200).send({user})
    } catch(error) {
        console.log('error', error)
        res.status(500).send({error: 'Oops, something went wrong'})
    }
}

const getUser = (req, res) => {
    if(req.session.user) {
        res.status(200).send({user: req.session.user})
    } else {
        res.status(200).send({})
    }
}

module.exports = {login, getUser}