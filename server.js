const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime')

// const chatServer = require('./server/chat_server')
// chatServer.listen(server)

let cache = {}

const seed404 = res => {
    res.writeHeader(404,{
        'content-type' : 'text/html;charset="utf-8"'
    });
    res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
    res.end();
}
const sendFile = (res, filePath, fileContents) =>　{
    res.writeHeader(200,{
        'content-type' : mime.getType(path.basename(filePath)) + ';charset="utf-8"'
    });
    res.end(fileContents);
}
const serverStatics = (res, cache, absPath) => {
    if(cache[absPath]){
        sendFile(res, absPath, cache[absPath])
    }else {
        fs.exists(absPath, function(exists){
            if(exists) {
                fs.readFile(absPath, function(err, data){
                    if(err){
                        seed404(res)
                    }else {
                        cache[absPath] = data
                        sendFile(res, absPath, data)
                    }
                })
            }else {
                seed404(res)
            }
        })
    }
}

const server = http.createServer((req, res) => {
    let filePath = '';

    filePath = req.url == '/' ? 'index.html' : req.url

    let absPath = './' + filePath
    serverStatics(res, cache, absPath)
})

server.listen(4000, function(){
    console.log('服务器开启成功, 访问 http://localhost:4000 查看！');
})

