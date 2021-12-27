const fs = require('fs');

const htmlHandler = async (req,res) => {
    const path = req.path[0];
    res.setHeader('Content-Type','text/html');
    const fileName = (path.length > 0) ? `./public/${path}.html` : './public/index.html';
    try{ 
        const fileContent = fs.readFileSync(fileName);
        res.statusCode = 200;
        res.end(fileContent)
    } catch(e){
        const fileContent = fs.readFileSync('./public/404.html');
        res.statusCode = 200;
        res.end(fileContent)
    }

}

const defineHeaderType = (path) => {
    const headerType = {
        css : 'css',
        js: 'javascript'
    };
    if(path[0] == 'img'){
        const extend = path[1].split('.')[1];
        if(extend == 'svg')
            extend += '+xml'
        return `image/${extend}`;
    } else
        return `text/${headerType[path[0]]}` 
}


const resourceHandler = async (req,res) => {
    const {path} = req;
    const fileName = `./public/${path[0]}/${path[1]}`;
    try{
        const fileContent = fs.readFileSync(fileName);
        res.setHeader('Content-type', defineHeaderType(path));
        res.statusCode = 200;
        res.end(fileContent);
    } catch(e){
        res.statusCode = 404;
        res.end();
    }
}


const publicHandler = (req,res) => {
    const resource = ['css','js','img'];
    const path = req.path[0];
    if(resource.includes(path))
        resourceHandler(req,res);
    else
        htmlHandler(req,res);
};


module.exports = publicHandler;