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

        const doujinData = []
        const $ = cheerio.load(data)

        const nmElemSelector = '#info h1'
        const doujinName = $(nmElemSelector).text()
        doujinData.push(doujinName)

        const auElemSelector = '#tags div:nth-child(4) span'
        const artist = $(auElemSelector).children().first().text()
        doujinData.push(artist)

        var tags = []
        const totalTags = '#tags div:nth-child(3) span'.length
        for (let i = 1; i <= totalTags; i++) {
            const tag = $(`#tags div:nth-child(3) span a:nth-child(${i})`).text()
            tags.push(tag)
        }
        doujinData.push(tags)
           
        const chElemSelector = '#thumbnail-container div'
        const chapters = []
        $(chElemSelector).each((pIdx, pElm) => {
            const chapter = $(pElm).find('img').data('src')
            chapters.push(chapter.slice(0, chapter.length - 5) + '.jpg');
        })
        doujinData.push(chapters)



        return doujinData;
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
    var a = await getChapters(id)
    var dataJSON = 
    {
        name: a[0],
        artist:a[1],
        tags: a[2],
        chapters: a[3],
    }
    res.send(dataJSON)
})


app.listen(
    process.env.PORT || 3000,
)


// name author 