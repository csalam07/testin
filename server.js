const puppeteer = require('puppeteer');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/getzepetor', async (req, res) => {
  res.status(200).json({ msg: 'Sam' });
});

app.post('/api/getzepetor', async (req, res) => {
  try {
    const { userName } = req.body;

    console.log(req.body);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const mainUrl = `https://user.zepeto.me/${userName}?language=en`;
    await page.setRequestInterception(true);

    page.on('requestfailed', (request) => {
      const url = request.url();
      console.log(url);
      return res.status(404).json({ message: 'Not Found' });
    });

    await page.goto(mainUrl);

    const [el] = await page.$x('/html/body/div/div/div[2]/section[1]/div/img');
    const src = await el.getProperty('src');
    if (src === undefined) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const srcTxt = await src.jsonValue();

    // name
    const [el2] = await page.$x(
      '/html/body/div/div/div[2]/section[1]/div/div/div[1]/h2',
    );
    const title = await el2.getProperty('textContent');
    if (src === undefined) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const titleTxt = await title.jsonValue();

    // location
    let locationTxt;
    const [el3] = await page.$x(
      '/html/body/div/div/div[2]/section[1]/div/div/div[2]/p[2]',
    );
    if (!el3) {
      locationTxt = 'NA';
    } else {
      const location = await el3.getProperty('textContent');
      if (src === undefined) {
        return res.status(404).json({ message: 'Not Found' });
      }
      locationTxt = await location.jsonValue();
    }

    // post
    const [el4] = await page.$x(
      '/html/body/div/div/div[2]/section[1]/div/div/ul/li[1]/span[1]/strong',
    );
    const post = await el4.getProperty('textContent');
    if (src === undefined) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const postTxt = await post.jsonValue();

    // follwors
    const [el5] = await page.$x(
      '/html/body/div/div/div[2]/section[1]/div/div/ul/li[2]/span[1]/strong',
    );
    const follwors = await el5.getProperty('textContent');
    if (src === undefined) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const follworsTxt = await follwors.jsonValue();

    // follwing
    const [el6] = await page.$x(
      '/html/body/div/div/div[2]/section[1]/div/div/ul/li[3]/span[1]/strong',
    );
    const follwing = await el6.getProperty('textContent');
    if (src === undefined) {
      return res.status(404).json({ message: 'Not Found' });
    }
    const follwingTxt = await follwing.jsonValue();

    // bio
    const [el7] = await page.$x('/html/body/div/div/div[2]/section[1]/p');
    const bio = await el7.getProperty('textContent');
    const bioTxt = await bio.jsonValue();

    const zepUser = {
      profile: srcTxt,
      name: titleTxt,
      bio: bioTxt,
      post: postTxt,
      following: follwingTxt,
      followers: follworsTxt,
      location: locationTxt,
    };
    // console.log(result);
    await browser.close();
    res.status(200).json({ zepUser });
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT || 5000;
http.listen(port, () => {
  console.log('Server is running on port', port);
});
