const url = require('url');
const fs = require('fs');
const path = require('path');

function getContentType(url) {
  if (url.endsWith('css')) {
    return 'text/css';
  } else if (url.endsWith('html')) {
    return 'text/html';
  } else if (url.endsWith('js')) {
    return 'text/javascript';
  } else if (url.endsWith('png')) {
    return 'image/png';
  } else if (url.endsWith('jpeg')) {
    return 'image/jpeg';
  } else if (url.endsWith('jpg')) {
    return 'image/jpeg';
  } else if (url.endsWith('ico')) {
    return 'image/x-icon';
  }
}

module.exports = (req, res) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname.startsWith('/content') && req.method === 'GET') {
    if (
      pathname.endsWith('png') ||
      pathname.endsWith('jpg') ||
      pathname.endsWith('jpeg') ||
      pathname.endsWith('ico')
    ) {
      fs.readFile(`./${pathname}`, (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(404, {
            'Content-Type': 'text/plain',
          });

          res.write('404 Not Found!');
          res.end();
          return;
        }
        console.log(pathname);
        res.writeHead(200, {
          'Content-type': getContentType(pathname),
        });
        res.write(data);
        res.end();
      });
    } else {
      fs.readFile(`./${pathname}`, 'utf-8', (err, data) => {
        if (err) {
          console.log(err);
          res.writeHead(404, {
            'Content-Type': 'text/plain',
          });

          res.write('404 Not Found!');
          res.end();
          return;
        }
        console.log(pathname);
        res.writeHead(200, {
          'Content-type': getContentType(pathname),
        });
        res.write(data);
        res.end();
      });
    }
  } else {
    return true;
  }
};
