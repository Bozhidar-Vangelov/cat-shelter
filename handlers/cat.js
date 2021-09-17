const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
// const formidable = require('formidable');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
  const pathname = url.parse(req.url).pathname;
  let filePath = undefined;
  console.log(req.method);

  if (pathname === '/cats/add-cat' && req.method === 'GET') {
    filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));
    const index = fs.createReadStream(filePath);

    index.on('data', (data) => {
      res.write(data);
    });

    index.on('end', () => {
      res.end();
    });

    index.on('error', (err) => {
      console.log(err);
    });
  } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
    filePath = path.normalize(path.join(__dirname, '../views/addBreed.html'));
    const index = fs.createReadStream(filePath);

    index.on('data', (data) => {
      res.write(data);
    });

    index.on('end', () => {
      res.end();
    });

    index.on('error', (err) => {
      console.log(err);
    });
  } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
    let formData = '';

    req.on('data', (data) => {
      formData += data;
    });

    req.on('end', () => {
      let body = qs.parse(formData);

      fs.readFile('../data/breeds.json', (err, data) => {
        if (err) {
          throw err;
        }

        let breedsTwo = JSON.parse(data);
        breedsTwo.push(body.breed);
        let json = JSON.stringify(breedsTwo);

        fs.writeFile('../data/breeds.json', json, 'utf-8', () =>
          console.log('The breed was uploaded successfully!')
        );
      });

      res.writeHead(202, { location: '/' });
      res.end();
    });
  } else {
    return true;
  }
};
