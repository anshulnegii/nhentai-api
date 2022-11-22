const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
//const PORT = 3000;

const app = express();
app.use(express.json())

async function getDoujin(doujin) {
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
    res.send('<h2>nhentai api 🌚</h2>')
})


app.get('/api', async (req, res) =>{
    res.send('<h2>now type your favourite doujin and get results 🌚<br> For example <a href="https://nhentai-api-pied.vercel.app/api/177013">https://nhentai-api-pied.vercel.app/api/177013</a><h2>')
})


app.get('/api/:id', async  (req, res) => {
    const { id } = req.params
    var a = await getDoujin(id)
    res.send({chapters: a})
})


app.listen(
    process.env.PORT || 3000,
    // console.log(`http://localhost:${PORT}`)
)
