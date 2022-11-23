const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
app.use(express.json())

async function getChapters(doujin) {
    try {
        const siteURL = `https://nhentai.to/g/${doujin}`
        const { data } = await axios({
            method: "GET",
            url: siteURL,
        })

        const $ = cheerio.load(data)
        const elemSelector = '#thumbnail-container div'
        const chapters = []

        $(elemSelector).each((pIdx, pElm) => {
            const chapter = $(pElm).find('img').data('src')
            chapters.push(chapter.slice(0, chapter.length - 5) + '.jpg');
        })
        return chapters
    } catch (error) {
        console.log(error);
        return 'something went wrong, please try again'
    }
}


app.get('/', async (req, res) =>{
    res.send('nhentai api 🌚')
})


app.get('/api', async (req, res) =>{
    res.send('now type your favourite doujin and get results 🌚')
})


app.get('/api/:id', async  (req, res) => {
    const { id } = req.params
    var a = await getChapters(id)
    res.send({chapters: a})
})


app.listen(
    process.env.PORT || 3000,
)
