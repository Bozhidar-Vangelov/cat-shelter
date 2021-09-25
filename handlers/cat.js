const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');
const globalPath = __dirname.replace('handlers', '');

module.exports = (req, res) => {
  const pathname = url.parse(req.url).pathname;
  let filePath = undefined;
  console.log(req.method);
  console.log(pathname);

  if (pathname === '/cats/add-cat' && req.method === 'GET') {
    filePath = path.normalize(path.join(__dirname, '../views/addCat.html'));
    const index = fs.createReadStream(filePath);

    console.log(__dirname);
    console.log(globalPath);

    index.on('data', (data) => {
      let catBreedPlaceHolder = breeds.map(
        (breed) => `<option value="${breed}">${breed}</option>`
      );

      let modifiedData = data
        .toString()
        .replace('{{catBreeds}}', catBreedPlaceHolder);
      res.write(modifiedData);
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

      fs.readFile('./data/breeds.json', (err, data) => {
        if (err) {
          throw err;
        }

        let breeds = JSON.parse(data);
        breeds.push(body.breed);
        let json = JSON.stringify(breeds);

        fs.writeFile('./data/breeds.json', json, 'utf-8', () =>
          console.log('The breed was uploaded successfully!')
        );
      });

      res.writeHead(302, { location: '/' });
      res.end();
    });
  } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
    let form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        throw err;
      }

      let oldPath = files.upload.path;
      let newPath = path.normalize(
        path.join(globalPath, `/content/images/${files.upload.name}`)
      );

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          throw err;
        }
        console.log('File was uploaded successfully');
      });
      fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
        if (err) {
          throw err;
        }

        let allCats = JSON.parse(data);
        allCats.push({
          id: cats.length + 1,
          ...fields,
          image: files.upload.name,
        });
        let json = JSON.stringify(allCats);
        fs.writeFile('./data/cats.json', json, () => {
          res.writeHead(302, { location: '/' });
          res.end();
        });
      });
    });
  } else if (pathname.includes('/cats-edit') && req.method === 'GET') {
    let filePath = path.normalize(
      path.join(__dirname, '../views/editCat.html')
    );

    const index = fs.createReadStream(filePath);

    index.on('data', (data) => {
      let catId = Number(pathname.substring(pathname.length - 1));
      let currentCat = '';
      cats.forEach((cat) => {
        if (cat.id === catId) {
          currentCat = cat;
        }
      });

      let modifiedData = data.toString().replace('{{id}}', catId);
      modifiedData = modifiedData.replace('{{name}}', currentCat.name);
      modifiedData = modifiedData.replace(
        '{{description}}',
        currentCat.description
      );

      const breedAsOptions = breeds.map(
        (b) => `<option value="${b}">${b}</option>`
      );

      modifiedData = modifiedData.replace(
        '{{catBreeds}}',
        breedAsOptions.join('/')
      );

      modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);
      res.write(modifiedData);
    });

    index.on('end', () => {
      res.end();
    });

    index.on('error', (err) => {
      console.log(err);
    });
  } else if (pathname.includes('/cats-find-new-home') && req.method === 'GET') {
    let filePath = path.normalize(
      path.join(__dirname, '../views/catShelter.html')
    );

    const index = fs.createReadStream(filePath);

    index.on('data', (data) => {
      let catId = Number(pathname.substring(pathname.length - 1));
      let currentCat = '';
      cats.forEach((cat) => {
        if (cat.id === catId) {
          currentCat = cat;
        }
      });

      let catImg = `../content/images/${currentCat.image}`;

      let modifiedData = data.toString().replace('{{id}}', catId);
      modifiedData = modifiedData.replace('{{src}}', catImg);
      modifiedData = modifiedData.replace('{{name}}', currentCat.name);
      modifiedData = modifiedData.replace(
        '{{description}}',
        currentCat.description
      );

      const breedAsOptions = breeds.map(
        (b) => `<option value="${b}">${b}</option>`
      );

      modifiedData = modifiedData.replace(
        '{{catBreeds}}',
        breedAsOptions.join('/')
      );

      modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);
      res.write(modifiedData);
    });

    index.on('end', () => {
      res.end();
    });

    index.on('error', (err) => {
      console.log(err);
    });
  } else if (pathname.includes('/cats-edit') && req.method === 'POST') {
  } else if (
    pathname.includes('/cats-find-new-home') &&
    req.method === 'POST'
  ) {
  } else {
    return true;
  }
};
