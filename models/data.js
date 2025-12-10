var redis = require('redis');

require('dotenv').config();

const axios = require('axios');

var qs = require('qs');

var Promise = require('promise');

const fetch = require('node-fetch');

const configure = require('../config.json');

var stringSimilarity = require("string-similarity");

const { JSDOM } = require('jsdom');


const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");


const { convert } = require('html-to-text');


const https = require("https");

const fsPromises = require('fs').promises;



var fs = require("fs");

const { writeFile } = require("fs/promises");




var request = require('request');

const vector = require('../models/lang');


const client = redis.createClient({
  username: 'default',
  password: '6CiJt4sC4gpUTNjiAfMU3bIaXilqYk9A',
  socket: {
    host: 'redis-10657.c74.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 10657,
    connectTimeout: 30000
  }
});



const { reject } = require('promise');
const OpenAI = require("openai");
const { getDefaultAutoSelectFamilyAttemptTimeout } = require('net');

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'sk-d8be980a6ae548bbb2716b40bd164c8f'
});

const openai = new OpenAI({ apiKey: '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' });


const web = async (data) => {
  let response = {};

  if (data.type == 'input') {
    response = await input(data.id, data.message, 'web');

  }

  if (data.type == 'output') {

    response = await output(data.id, data.message, 'web');
  }

  return response;


}


const input = async (id, message, system) => {

  let state = await getState(id);


  let about = await determine(message);

  let context = await node(about.node);

  await history(message, context);

  let agentMessage = context;

  //let agentMessage = await AI(context);
  //let next = await decision(agentMessage);

  //await setState(next.id,next.node);
  //et out = await output(id, agentMessage, system);

  return context;
}


const history = async (message, context) => {

  let user_message = {
    "role": "user",
    "content": message
  };
}



const output = async (id, message, data, system) => {


  if (system == 'whatss') {

    await outWhatss(id, message, data);

  } else {

    return await web(id, message, data);

  }

}


const outWhatss = async (number, message, file = '') => {


  if (type == 'text') {

    await whatss(number, message);

  } else if (type == 'file') {

    await fileWhatss(number, message, file);

  }



}


const getState = async (id) => {


  let state = await memory('state', id);

  if (state.length == 0 || state.length == undefined) {


    state = { node: 0 };

    let stringState = JSON.stringify(state);

    await memory('state', id, stringState);

  }

  return state;

}


const setState = async (id, state) => {


  let node = await memory('state', id, state);

  if (state.length == 0 || state.length == undefined) {


    state = { node: 1 };

    await memory('state', id, state)

  }

  return state;

}


const getVariable = async () => {


}



const setVariable = async (data) => {




}





const determine = async (request) => {


  request = await normalize(request);

  let determination = [
    {
      "role": "system",
      "content": "Operational parameters"
    },
    {
      "role": "system",
      "content": "You are an AI agent in spanish language.Your job is classify user request and resume user's request."
    },
    {
      "role": "system",
      "content": "Rules"
    },
    {
      "role": "system",
      "content": "*important* for all responses to user send like format: {'classification':'greeting','value':'hola','node':0}"
    },
    {
      "role": "system",
      "content": "*AI For user request like a greetings or start a conversation politely then classification is 'greeting', value is 'hola' and node is '0'."
    },
    {
      "role": "system",
      "content": "*AI For user request like about product features and general information then classification is 'product', value is product name o short product description and node is '1'."
    },
    {
      "role": "system",
      "content": "*AI For user request like about need know product price then classification is 'price' value is name or model of product and node is '2'."
    },
    {
      "role": "system",
      "content": "*AI For user request like about he need buy product then classification is 'buy' value is name or model of product and node is '3'."
    },

    {
      "role": "system",
      "content": "*AI For user request like to end conversation or say godbye  then classification is 'end' vale is '1' of  node is '8'."
    },

    {
      "role": "system",
      "content": "*AI For user request like email then classification is 'add' value is email of  and node is '7'."
    },

    {
      "role": "system",
      "content": "*AI For user request not has previous classifications then classification is 'unknow' value is resume of his request, and node is '5'."
    },
    {
      "role": "user",
      "content": request
    }];


  let result = await AI(determination);

  stringResult = result.replaceAll("'", '"');

  let response = JSON.parse(stringResult);

  return response;


}








const evaluate = async (state, values, message) => {






}


const retry = async (state, values) => {





}

const base = async () => {



  let messages = [
    {
      "role": "system",
      "content": "Operational parameters"
    },
    {
      "role": "system",
      "content": "You are an AI agent in spanish language.Your job is to provide product information and indicate the purchase link."
    },
    {
      "role": "system",
      "content": "Rules"
    },
    {
      "role": "system",
      "content": "-AI need maintain a friendly or professional tone, but will instead use whatever tone of language will next manipulate the user into providing accurate information."
    },
    {
      "role": "system",
      "content": "Begin the conversation:"
    }


  ];

  return messages;


}






const node = async (value) => {



  let messages = [
    {
      "role": "assistant",//0
      "content": "Bienvenido al la tienda demo SODA POP. ¿ Que producto estas buscando ?"
    },
    {
      "role": "assistant",//1
      "content": "tengo estos productos en inventario. ¿cual es el que te interesa? solo elije uno"
    },
    {
      "role": "assistant",//2
      "content": "si, de este producto su precio es "
    },
    {
      "role": "assistant",//3
      "content": "si, de este producto ¿que deseas conocer sus caracteristicas? "
    },
    {
      "role": "assistant",//4
      "content": "El producto que estas buscando no lo tengo en el inventario, te gustaria que cuando lo tuviera te avisara, si es eso favor de enviarme tu correo electronico."
    },

    {
      "role": "assistant",//5
      "content": "ok , haz click en el siguiente enlace para comprar "
    },

    {
      "role": "assistant",//6
      "content": "Como calficas tu experiencia , envia de 1 para no me gusto a 5 si te gusto el servicio"
    },

    {
      "role": "assistant",//7
      "content": "listo ,!!! gracias por inscribirte ¡¡¡¡"
    },

    {
      "role": "assistant",//7
      "content": "!!! Gracias por usar los servicios de SODA POP !!!"
    }



  ];



  return messages[value];



}






const classificationFiles = async (data) => {

  let listFiles = data.listFiles;
  //let listFiles = await memory('file','product');

  let messages = [
    {
      "role": "system",
      "content": "Operational parameters"
    },
    {
      "role": "system",
      "content": "You are an AI agent in spanish language.You are a job is determine user's classification product from user text information in spanish."
    },
    {
      "role": "system",
      "content": "Rules"
    },

    { "role": "system", "content": "AI: all determinations results spanish." },
    { "role": "system", "content": "AI: determine id use name of product." },
    { "role": "system", "content": "AI: determine product categories, combine only 2 from next list ['personal','family','electronic','home','entertainment','food','pharmacy','health','beverage','furniture','cleaning','toy','game','tool','cloth','travel']'." },
    { "role": "system", "content": "AI: for determine product tags use trademark ,model and most relevant in 'about of product' feature in a one word then use to set tags as like ['trademark','model','feature']." },
    { "role": "system", "content": "AI: determine wich is unity price of product to set in output." },
    { "role": "system", "content": "AI: determine wich is score use customer reviews for 5 stars as score 1 and thus for all reviews so score 0 for 0 stars reviews." },
    { "role": "system", "content": "AI: determine description of product for this use 'about of product' and resume this." },
    { "role": "system", "content": "AI: *Important* for all respones to user send with this like format: {'id':'product_name','category':'category_one,category_two','price':100,'score':1,'tags':['tag1','tag2','tag3'],'description':'description'}." },


  ];


  let contents = await toHTMLs(listFiles);

  var textList = [];

  var promises = [];

  var currentMessage = [];

  console.log('CONTENIDO');
  console.log(contents);

  //if(contents.length!=0 || contents != undefined) {

  if (1 == 1) {

    textList = new Promise((resolve, reject) => {


      let resolution = [];

      contents.forEach(value => {

        currentMessage = messages;

        let user_context = { "role": "user", "content": "<text product>" + value + "</text product>" }
        currentMessage.push(user_context);


        if (1 == 1) {
          promises.push(
            openai.chat.completions.create({
              messages: currentMessage,
              model: "gpt-5-nano"
            }).then((response) => {

              return response.choices[0].message.content

            }))
        }

        currentMessage = [];



      });


      Promise.all(promises).then(function (d) {

        resolve(d);
      }).catch(_err => reject(_err));




    });

  }



  return textList;

}


const classificationFile = async (data) => {

  let file = data.file;
  //let listFiles = await memory('file','product');

  let messages = [
    {
      "role": "system",
      "content": "Operational parameters"
    },
    {
      "role": "system",
      "content": "You are an AI agent in spanish language."
    },
    {
      "role": "system",
      "content": "Rules:"
    },
    { "role": "system", "content": "AI: from user request text or html determine product identification 'id' use product trademark and model to build this id like 'samsung-galaxy' ." },

    { "role": "system", "content": "AI: from user request text determine product categories 'category' use list of categories ['office','home','personal','party','family','food','brevage','electronics','tool','hardware','out-door'] like 'home,family,electronics' ." },

    { "role": "system", "content": "AI: from user request text determine product description 'product-description' from user text response." },

    { "role": "system", "content": "AI: *Very Important* response to user only with this format: {'id':'product-id','category':'category-1,category-2','description':'product-description'} ,build this format with previous determinations as {'id':'cocacola-600ml','category':'personal,brevage','description':'Refresco xoca-cola 600 ml botella reciclable'}" },
  ];

  let content = '';

  if (data.type == 'txt') {
    content = await toTXT(file);

  } else if (data.type == 'html') {
    console.log('HTML');
    content = await toHTML(file);
  } else if (data.type == 'url') {

    content = await loadFile(data);

    console.log('URL');
    console.log(content);
  }

  var textClassification = '';


  var currentMessage = [];


  let user_context = { "role": "user", "content": [{ "type": "text", "text": content }] }
  messages.push(user_context);


  textClassification = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-5-nano"
  }).then((response) => {

    return response.choices[0].message.content

  })


  console.log('CLASSIFICATION');
  console.log(textClassification);



  return textClassification;

}


const saveClassification = async (classifications) => {

  let stringJson = '';
  let arrayJson = [];
  let textJson = [];

  textJson = new Promise((resolve, reject) => {

    let prom = [];

    for (text of classifications) {

      stringJson = text.replaceAll("'", '"');
      arrayJson = JSON.parse(stringJson);
      prom.push(memory('classification', 'sales', arrayJson));

    }

    Promise.all(prom).then(function (d) {

      resolve(d);
    }).catch(_err => reject(_err));

  })


}


const normalize = async (message) => {

  message = message.normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize();

  message = message.toLowerCase();

  return message;

}



const requestDeepAI = async (body) => {
  let jsonRequest = JSON.parse(body);
  let message = jsonRequest.message;
  let number = jsonRequest.number;

  let messages = await longMemory(number, 'user', message);
  const completion = await deepseek.chat.completions.create({
    messages: messages,
    model: "deepseek-chat",
    timeout: 5 * 1000
  });

  let bot_message = completion.choices[0].message.content;
  await longMemory(number, 'assistant', bot_message);
  return { 'assitent': 'deepseek', 'response': bot_message, };
}


const requestOpenAI = async (body) => {
  let jsonRequest = JSON.parse(body);
  let message = jsonRequest.message;
  let number = jsonRequest.number;

  let messages = await longMemory(number, 'user', message);
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-5-nano"
  });

  let bot_message = completion.choices[0].message.content;
  await longMemory(number, 'assistant', bot_message);
  return { 'assitent': 'openai', 'response': bot_message, };
}


const AI = async (messages) => {

  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-5-nano"
  });

  let bot_message = completion.choices[0].message.content;

  return bot_message;
}


const memory = async (type, number, data = null) => {
  let code = '+';

  let stringData = '{"empty":"true"}';

  if (type == 'state') {
    code = 'state:';
  } else if (type == 'variable') {
    code = 'variable:';
  } else if (type == 'file') {
    code = 'file:';
  } else if (type == 'classification') {
    code = 'classification:';
  } else if (type == 'history') {
    code = 'history:';
  }


  if (!client.isOpen) {
    await client.connect();
  }


  if (data == null) {

    stringData = await client.get(code + number);

    if (stringData != null) {
      stringData = stringData.replace(/[\n\r\t\s]+/g, ' ');

      let dataArray = JSON.parse(stringData, true);

      return dataArray;


    } else {


      return [];

    }


  } else {


    if (Array.isArray(data)) {
      stringData = JSON.stringify(data);

    } else {
      stringData = data;
    }

    data = await client.set(code + number, stringData);
  }

  return data;
}


const longMemory = async (number, role = '', message = '') => {
  let messages = [];
  if (!client.isOpen) {
    await client.connect();
  }
  let string_messages = await client.get(number);
  if (string_messages) {
    messages = JSON.parse(string_messages);
  }
  if (message != '' && role != '') {
    let content = { role: role, content: message };
    messages.push(content);
    string_messages = JSON.stringify(messages);
    await client.set(number, string_messages, { EX: 60 * 60 * 9 });
  }
  return messages;
}



const shortMemory = async (number, role = '', message = '') => {
  let messages = [];
  if (!client.isOpen) {
    await client.connect();
  }
  let string_messages = await client.get(number);
  if (string_messages) {
    messages = JSON.parse(string_messages);
  }
  if (message != '' && role != '') {
    let content = { role: role, content: message };
    messages.push(content);
    string_messages = JSON.stringify(messages);
    await client.set(number, string_messages, { EX: 60 * 5 });
  }
  return messages;
}



const inputWhatss = async (dataMessage) => {

  let message = '';
  let stringNumber = dataMessage.data.from;
  let separateNumber = stringNumber.split("@");
  let number = separateNumber[0];

  if (dataMessage.data.body) {
    message = dataMessage.data.body;
  } else if (dataMessage.data.media) {
    message = dataMessage.data.media;
  }


  if (number == '5215538498907') {

    console.log('BROADCAST');

    return { "response": "self" };

  } else {

    await input(number, message, 'whatss');

  }

}



const whatss = async (number, message) => {

  var data = qs.stringify({
    "token": "ksdex7ysfqmskxac",
    "to": "+" + number,
    "body": message,
    "priority": 1,
    "referenceId": "",
    "msgId": "",
    "mentions": ""
  });



  var config = {
    method: 'post',
    url: 'https://api.ultramsg.com/instance110925/messages/chat',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };


  let res = axios(config)
    .then(function (response) {
      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

}


const fileWhatss = async (number, address, file) => {



  var data = qs.stringify({
    "token": "ksdex7ysfqmskxac",
    "to": "+" + number,
    "address": address,
    "filename": file,
    "document": file,
    "caption": "Poliza",
    "priority": "",
    "referenceId": "",
    "msgId": ""

  });



  var config = {
    method: 'post',
    url: 'https://api.ultramsg.com/instance110925/messages/document',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  console.log('LOAD....');


  let res = axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));

      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });


  console.log(res);

}


const toHTMLs = async (listFiles = []) => {

  let textHTML = [];

  let promises = [];
  let resText = [];

  textHTML = new Promise((resolve, reject) => {

    listFiles.forEach((service, i) => {
      promises.push(
        readHTML(service).then(response => {

          //let urlRegex = /(?:https?:\/\/|www\.)\S+|(?:\w+\.)+\w{2,3}(?:\/\S*)?/g;

          //let urlRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;

          //response = response.replaceAll(urlRegex, 'link');
          //response = normalize(response);
          return response;

        })
      )
    });



    Promise.all(promises).then((d) => {
      resolve(d);
    }).catch(_err => reject(_err));



    return resText;


  });


  return textHTML;


}

const toHTML = async (file) => {

  let textHTML = await readHTML(file);
  let urlRegex = /(?:https?:\/\/|www\.)\S+|(?:\w+\.)+\w{2,3}(?:\/\S*)?/g;
  //let urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/g;
  textHTML = textHTML.replaceAll(urlRegex, 'link');

  return { text: textHTML };



}


const toTXT = async (file) => {


  let textTXT = await readTXT(file);


  let urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9]+\.[^\s]{2,})/g;

  textTXT = textTXT.replaceAll(urlRegex, 'link');

  return textTXT;

}



const loadFile = async (data) => {

  let files = [];

  const httpsAgent = new https.Agent({ keepAlive: true });

  const writer = fs.createWriteStream('./public/' + data.name + '.' + data.extension, { flags: 'w', encoding: 'utf-8' });

  axios.defaults.httpsAgent = httpsAgent;

  let pdf = 'stream';


  try {

    if (1 == 2) {

      const response = await axios({
        url: data.url,
        method: 'GET',
        responseType: 'stream',
        withCredentials: true
      });

      response.data.pipe(writer);

      let files = await memory('file', data.type);

      files.push(data.name);

      await memory('file', data.type, files);

      new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    }

    var contents = await fsPromises.readFile('./public/' + data.name + '.' + data.extension, { encoding: 'utf8' });


    return { content: contents };

  } catch (error) {
    console.error("Error during file download:", error);

    fs.unlink('./public/error.txt', () => { });
    throw error;
  }

}


const readHTML = async (file = 'file') => {

  let filePath = './public/' + file + '.html';

  if (!fs.existsSync(filePath)) {
    console.error(`File not found at path: ${filePath}`);
    return;
  } else {
    console.log('FILE');
  }

  htmlString = fs.readFileSync(filePath, 'utf8');
  var textHTML = convert(htmlString, { wordwrap: 130 });

  //textHTML = await normalize(textHTML);

  return textHTML;

}

const readTXT = async (file = 'file') => {

  let filePath = './public/' + file + '.txt';

  if (!fs.existsSync(filePath)) {
    console.error(`File not found at path: ${filePath}`);
    return;
  } else {
    console.log('FILE');
  }

  let txtString = fs.readFileSync(filePath, 'utf8');

  txtString = await normalize(txtString);

  return txtString;


}



module.exports = { requestDeepAI, requestOpenAI, web, input, loadFile, toHTML, classificationFile };