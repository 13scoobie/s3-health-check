/* Health Check */
var AWS = require('aws-sdk'),
    S3 = new AWS.S3(),
    restify = require('restify');

var server = restify.createServer();

server.use(
    function crossOrigin(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        return next();
      }
);

server.get('/bucket/:name', countItemsInBucket);
server.head('/bucket/:name', countItemsInBucket);

server.listen(process.env.PORT, function() {
    console.log('%s listening at %s', server.name, server.url);
  });

function countItemsInBucket(req, res, next) {
  var folder = req.params.name + '/';
  var bucket = {
    Bucket: process.env.BUCKET,
    Prefix: folder,
    Delimiter: (process.env.DELIMITER || '\\'),
    MaxKeys: (process.env.MAXKEYS || 26)
  };

  S3.listObjects(bucket, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      res.send({
        bucket: data.Contents[0].Key,
        currentNumberOfItems: Object.keys(data.Contents).length - 1
      });
    }
  });
}
