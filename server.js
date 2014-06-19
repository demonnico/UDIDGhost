var http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs"),
sys = require('sys'),
exec = require('child_process').exec,
port = process.argv[2] || 8888;

http.createServer(function(request, response) {
                  var uri = url.parse(request.url).pathname
                  , filename = path.join(process.cwd(), uri);
                  path.exists(filename, function(exists) {
                              if(!exists) {
                                  var body = "";
                                  request.on('data',function (chunk){
                                             body += chunk.toString('utf-8');
                                             });
                                  request.on('end', function(){
                                             var indexBegin = body.indexOf("<dict>");
                                             var indexEnded = body.indexOf("</dict>");
                                             var resultFilter = body.slice(indexBegin,indexEnded+7);
                                             fs.writeFileSync("udid.plist", resultFilter, "UTF-8",{'flags': 'w+'});
                                             exec("/ghost.sh", function(error, stdout, stderr) {
                                                  sys.puts(stdout)
                                                  });
                                             });
                                  response.writeHead(301,
                                                 {Location: 'http://www.huaban.com'}
                                                 );
                                  response.end();
                                return;
                              }
                              
                              if (fs.statSync(filename).isDirectory()) filename += '/index.html';
                              
                              fs.readFile(filename, "binary", function(err, file) {
                                          if(err) {
                                            response.writeHead(500, {"Content-Type": "text/plain"});
                                            response.write(err + "\n");
                                            response.end();
                                            return;
                                          }
                                          
                                          response.writeHead(200);
                                          response.write(file, "binary");
                                          response.end();
                                          });
                              });
                  }).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
