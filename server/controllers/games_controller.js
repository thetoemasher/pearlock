const {getImageURL} = require('../utils')
const getGames = async (req, res) => {
    try {
        const db = req.app.get('db')
        console.log('user_id', req.params.user_id)
        // const games = await db.games.find({user_id: req.params.user_id})
        const games = await db.get_games_and_submission_count([req.params.user_id])
        res.status(200).send(games)
    } catch (err) {
        console.log('error', err)
        res.status(500).send(err)
    }
}

const createGame = async(req, res) => {
    try {
        const db = req.app.get('db')

        const newGame = await db.games.insert({...req.body, user_id: req.params.user_id})
        console.log('newGame', newGame)
        newGame.submission_count = 0
        res.status(200).send(newGame)
    } catch (err) {
        console.log('error', err)
        res.status(500).send(err)
    }
}

const submitInfo = async(req, res) => {
    try {
        const db = req.app.get('db')
        const submit = {
            submitter_name: req.body.name,
            game_id: req.params.game_id
        }
        let {url} = req.body
        if(url.includes('http') && url.includes('imgur') && !url.includes('i.i')) {
            let URL = await getImageURL(url)
            submit.img_url = URL
        } else {
            submit.img_url = url
        }
        // submit.guesses = {game_submission_id: undefined}
        const submittedInfo = await db.game_submissions.insert(submit)
        await db.guesses.insert({game_submission_id: submittedInfo.game_submission_id})

        res.sendStatus(200)
    } catch (err) {
        console.log('error', err)
        res.status(500).send({error: 'Oops! Something went wrong'})
    }
}

const getGameInfo = async(req, res) => {
    try {
        const db = req.app.get('db')
        const {game_id} = req.params
        const gameInfo = await db.games.findOne({game_id})
        res.send(gameInfo)
    } catch (err) {
        console.log('error', err)
        res.status(500).send(err)
    }
}
const getGameSubmissions = async(req, res) => {
    try {
        const db = req.app.get('db')
        const {game_id} = req.params
        const gameSubmissions = await db.get_submissions_and_guesses([game_id])
        res.send(gameSubmissions)
    } catch (err) {
        console.log('error', err)
        res.status(500).send(err)
    }
}

const getImages = async (req, res) => {
    try {
        const db = req.app.get('db')
        // const images = await db.game_submissions.find()
        // images.forEach(i => {
        //     db.guesses.save({game_submission_id: i.game_submission_id})
        // })
        // let promises = []]
        // for(let i = 0; i < images.length; i++) {
        //     if(images[i].img_url && images[i].img_url.includes('http')) {
        //         let URL = getImageURL(images[i].img_url).then(results => {
        //             console.log(images[i].img_url, results)
        //             // let image = {game_submission_id: images[i].game_submission_id, img_url: results}
        //             let update = db.game_submissions
        // let updatePromises = [.update(images[i].game_submission_id, {img_url: results})
        //             updatePromises.push(update)
        //         })
        //         promises.push(URL)
        //     }
        // }
        // await Promise.all(promises)
        // await Promise.all(updatePromises)
        // console.log(promises.length)
        res.sendStatus(200)
    } catch (err) {
        console.log('error', err)
        res.status(500).send(err)
    }
}

module.exports = {getGames, createGame, submitInfo, getGameInfo, getGameSubmissions, getImages}