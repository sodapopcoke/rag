
const model = require('../models/data');
const vector = require ('../models/lang');

const deepAI = (req, res) => {

    
    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
        
        }else{
            req.body = JSON.stringify(req.body);
        }

    
        model.requestDeepAI(req.body).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });


}


const openAI = (req, res) => {

    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
        
        }else{
            req.body = JSON.stringify(req.body);
        }

        model.requestOpenAI(req.body).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });


}

const webNodes = (req, res) => {


    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
        
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);
      

        model.readNodes(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });


}


const input = (req, res) => {

    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
                 
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);

        model.web(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}


const classificator = (req, res) => {

    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
                 
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);

        model.classificationFile(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}

const toText = (req, res) => {

    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
                 
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);

        model.toHTML(data.file).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}




const loadFile = (req, res) => {

    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
                 
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);

        model.loadFile(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}


const whatss = (req, res) => {

    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
                 
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);

        model.whatss(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}



const index = (req, res) => {
    
    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
                 
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);

        vector.vectorindex(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });


}


const search = (req, res) => {

    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
                 
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);

        vector.similararity(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}


const request = (req, res) => {

    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');
                 
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);

        vector.request(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}


const loadData = (req, res) => {

    
    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');         
        
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);
        vector.loadData(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}

const retry = (req, res) => {

    
    if(Buffer.isBuffer(req.body)){
        const b = Buffer.from(req.body,'utf8'); 
        req.body =  b.toString(); // example
        req.body =  req.body.replace(/[\n\r\t\s]+/g, ' ');         
        
        }else{
            req.body = JSON.stringify(req.body);
        }

        data = JSON.parse(req.body);
        vector.retry(data).then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send(error.message);
        });

}


module.exports = {deepAI,webNodes,input,openAI,index,loadData,loadFile,search,retry,request,whatss,classificator,toText};
