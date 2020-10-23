const cheerio = require('cheerio')
const axios = require('axios')


const getImageURL = async (url) => {
    const newPromise = new Promise((resolve, reject) => {
        setTimeout(async () => {
            const imageRes = await axios.get(url)
            const $ = cheerio.load(imageRes.data)
            let meta = $('meta')
            for(let i = 0; i < meta.length; i++) {
                if(meta[i].attribs.property && meta[i].attribs.property === 'og:image') {
                    console.log('property', meta[i].attribs.property)
                    console.log('content', meta[i].attribs.content.split('?')[0])
                    resolve(meta[i].attribs.content.split('?')[0])
                }
            }
            resolve(null)
        }, 2000)
    })
    return newPromise
    
}

module.exports = {getImageURL}