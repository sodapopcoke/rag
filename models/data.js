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

const cheerio = require('cheerio');

var fs = require("fs");

const { writeFile } = require("fs/promises");

const { setTimeout } = require('timers/promises');

var request = require('request');

const vector = require('../models/lang');

const webdriver = require('selenium-webdriver');

const { By, Key, until } = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');

const Quagga = require('@ericblade/quagga2');

const {createDelay} = require('delay');

const customDelay = createDelay({clearTimeout, setTimeout});

let options = new chrome.Options();
//Below arguments are critical for Heroku deployment
options.addArguments("--incognito");
options.addArguments("--headless");
options.addArguments("--disable-gpu");
options.addArguments("--disable-dev-shm-usage");
options.addArguments("--disable-extensions");
options.addArguments("--no-sandbox");

let driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

const client = redis.createClient({
  username: 'default',
  password: 'KEY',
  socket: {
    host: 'redis-10657.c74.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 10657,
    connectTimeout: 30000
  }
});

const { reject } = require('promise');
const OpenAI = require("openai");
const { getDefaultAutoSelectFamilyAttemptTimeout } = require('net');
const { deserialize } = require('v8');

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: 'KEY'
});

const openai = new OpenAI({ apiKey: 'KEY' });





const web = async (data) => {
  let response = {};

  response = await input(data.id, data.message, 'web');

  return response;

}

const input = async (id, message, system) => {

  let state = await getState(id);

  let type = "text";

  let context = await node(state.node);

  let request = '';

  let lastVariables = state.variables;

  let toVariable = {};

  let validate = false;

  let variable = '';

  let next = 0;

  let value = 0;

  let validations = context.input;

  let decision = [];

  let messageAgent = "fuera de servicio 😔";

  let url = "https://www.google.com";

  let prom = [];

  let nextNode = [];

  let delaytime = false;

  let tries = false;


  if (message == 'limpiar' || message == 'Limpiar' || message == 'borrar' || message=='Borrar') {

    let fresh = await clear(id);
 
    messageAgent = "🧹 limpiando conversacion ";

  } else {

    for (val of validations) {

      prom.push(
        determine(message, val.type, val.node, val.variable, val.value, val.request,id).then((result) => { return result; })
      );

    }


    decision = await Promise.all(prom).then((p) => {
      return p;

    });


    for (dcn of decision) {
      validate = dcn.answer;
      next = dcn.next;
      variable = dcn.variable;
      request = dcn.request;
      delaytime = dcn.delaytime;
      tries = dcn.tries;
    }

 

    if (validate == true || validate =='true') {

  
      value = context.input[0];

      context = await node(next);


      toVariable = { "variable": variable, "value": message };
      lastVariables.push(toVariable);

      op = { "node": context.node, "variables": lastVariables };
      let currentString = JSON.stringify(op);
      let resultMem = await setState(id, currentString);

    } else {

      context = await contrast(next);

    }


    if(request=='default'){
      messageAgent = context.content;
    }else if(request=='search'){
      
      let contextSearch = await contextFlow(id);
      messageAgent = context.content +': \n '+contextSearch +'\n ¿ cual y cuantos de llevas ?';
      
    }else if(request=='tries'){

       console.log('VALIDATE:');
       console.log(validate);

       if(validate == true || validate =='true'){
       messageAgent = context.content;
       }else{
       messageAgent = context.contrast; 
       } 
    }

    type = context.type;

    url = context.url;

    if(1==2){

    lastVariables.forEach(m => {

      toFind = '{{' + m.variable + '}}';
      toReplace = m.value;
     
      if(messageAgent){
        messageAgent = messageAgent.replaceAll(toFind, toReplace);
      }

    });

    }




  }



  if (system == "whatss" && type == "text") {

    result = await whatss(id, messageAgent);


  } else if (system == "whatss" && type == "image") {

    await imageWhatss(id, 'kof', url);

    await setTimeout(1000);

    await whatss(id, messageAgent);


  } else {

    let result = {
      "id": "KOF",
      "message": messageAgent
    }

    return result;

  }


}


const contextFlow = async (id) =>{

  let dataText = '';

  let context = await memory('search',id);
 
 
   context.forEach((cont)=>{

     dataText = cont.content +'\n'+ dataText;

   });


   return dataText;

}


const pass = async (node, message, lastVariables) => {

  let context = await node(node);
  console.log('PASS');
  messageAgent = context.content;
  type = context.type;
  console.log(message);
  lastVariables.forEach(m => {

    toFind = '{{' + m.variable + '}}';
    toReplace = m.value;
    console.log('TO REPLACE');
    messageAgent = messageAgent.replaceAll(toFind, toReplace);

  });

  return messageAgent;

}

const clear = async (id) => {

  if (!client.isOpen) {
    await client.connect();
  }
  await client.del('-state:' + id);
  await client.del('-history:' + id);
  await client.del('-search:' + id);

  return true;

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



  if (!Object.keys(state).length) {


    state = { node: 0, variables: [{ variable: "default", value: 1 }] };

    let stringState = JSON.stringify(state);

    await memory('state', id, stringState);

  }


  return state;

}

const setState = async (id, state) => {


  let node = await memory('state', id, state);

  if (state.length == 0 || state.length == undefined) {


    state = { node: 0 };

    await memory('state', id, state)

  }

  return state;

}

const getVariable = async () => {

}

const setVariable = async (data) => {

}

const determine = async (message, apply_rule, nextNode, variable, value,request,id) => {

  let sample = [];
  let originalMessage = message;
  let rm = 0;
  answer = '👌';
  let rmx = /^[1-5]$/;
  let next = 0;
  let val = value;
  let delaytime = false;
  let tries = false;


  message = message.normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize();
  message = message.toLowerCase();
  message = message.trimStart();

  if (apply_rule == undefined) {
    apply_rule = 'ANY';
  }


  if (apply_rule == 'bool') {

    if (message == 'si' || message == 'Si' || message == 'SI') {

      answer = true

    } else {
      answer = false;
    }


    if (answer == true) {

      for (n of nextNode) {
        if (n.value == 'si') {
          answer = true;
          next = n.node;
        }
      }
    } else {

      for (n of nextNode) {


        answer = false;
        next = n.try_node;

      }

    }



  } else if (apply_rule == 'fullname') {


    message = message.replace('ñ', 'n');


    message = message.replace('Ñ', 'Ñ');

    const fullNameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)+$/;

    answer = fullNameRegex.test(message);



    if (answer == true) {
      for (n of nextNode) {

        console.log('is...next ' + n.node + '--' + n.value);
        console.log(typeof message);

        if (n.value == 'string') {

          next = n.node;

        }
      }
    } else {

      for (n of nextNode) {



        if (n.value == 'string') {

          next = n.try_node;

        }


      }
    }



  } else if (apply_rule == 'number_10') {

    var pattern = new RegExp("^[0-9]{10}$");
    answer = pattern.test(message);


  } else if (apply_rule == 'number_1') {

    var pattern = new RegExp("^[0-9]{1}$");
    answer = pattern.test(message);


  } else if (apply_rule == 'email') {

    rxm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    answer = rxm.test(message);


    if (answer == true) {
      for (n of nextNode) {

        console.log('is...next ' + n.node + '--' + n.value);
        console.log(typeof message);

        if (n.value == 'string') {

          next = n.node;

        }
      }
    } else {

      for (n of nextNode) {

        console.log('is...next ' + n.node + '--' + n.value);
        console.log(typeof message);



        next = n.try_node;


      }


    }



  } else if (apply_rule == 'event') {

    var regexdate = /^(?:enero|february|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre),\s*(?:\d{1,2}),\s*(?:1[0-2]|0?[1-9])(?::[0-5]\d)?\s*(?:AM|PM)$/i;

    let dateformat = regexdate.test(message);

    answer = dateformat;


  } else if (apply_rule == 'random_1_2') {

    message = parseInt(message);

    rmx = /^[1-2]$/;



    answer = rmx.test(message);

    if (answer == true) {
      for (n of nextNode) {
        if (n.value == message) {

          if (message == 1) {


          }

          if (rm > 1) {
            next = n.node;
          }
        }
      }
    } else {


      for (n of nextNode) {



        next = n.try_node;

      }



    }

  } else if (apply_rule == 'between_1_2') {

    message = parseInt(message);

    rmx = /^[1-2]$/;


    answer = rmx.test(message);

    if (answer == true) {
      for (n of nextNode) {
        if (n.value == message) {

          next = n.node;

        }
      }
    } else {

      console.log('FALSE');
      for (n of nextNode) {


        next = n.try_node;




      }


    }



  } else if (apply_rule == 'between_1_3') {

    message = parseInt(message);

    rmx = /^[1-3]$/;

    answer = rmx.test(message);

    if (answer == true) {
      for (n of nextNode) {
        if (n.value == message) {
          next = n.node;
        }
      }
    } else {

      for (n of nextNode) {

        next = n.try_node;

      }


    }



  } else if (apply_rule == 'between_1_4') {

    message = parseInt(message);

    rmx = /^[1-4]$/;

    answer = rmx.test(message);

    if (answer == true) {
      for (n of nextNode) {
        if (n.value == message) {
          next = n.node;
        }
      }
    } else {

      for (n of nextNode) {

        next = n.try_node;

      }


    }


  } else if (apply_rule == 'comparation') {


    comparation = stringSimilarity.compareTwoStrings(message, 'TEXTO');

    answer = true;

  } else if (apply_rule == 'curp') {

    console.log(originalMessage);


    rmx = /([A-Z]{4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM](AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[A-Z]{3}[0-9A-Z]\d)/;
    answer = rmx.test(originalMessage);

    console.log('IS CURP');
    console.log(answer);


    if (answer == true) {
      for (n of nextNode) {
        if (n.value == 'string') {
          next = n.node;
        }
      }
    } else {

      console.log('TRY');

      for (n of nextNode) {

        next = n.try_node;

      }

    }




  } else if (apply_rule == 'rfc') {

    rmx = /^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/;

    answer = rmx.test(originalMessage);

    answer = true;

  } else if (apply_rule == 'any') {

    answer = true;

  } else if (apply_rule == 'code') {

    for (n of nextNode) {
      if (n.value == 'listo' && n.node == 12) {
        answer = true;
        next = n.node;
      } else {

        answer = false;
        next = n.try_node;
      }

    }

  } else if (apply_rule == 'image') {



    console.log(message);

    answer = true;

  } else if (apply_rule == 'greeting') {



    sample[1] = 'hola que hay';

    sample[2] = 'saludos';

    sample[3] = 'estoy interesado en';

    sample[4] = 'quiero saber como';

    sample[5] = 'necesito que me';

    sample[6] = 'buen dia';

    sample[6] = 'buenas tardes';

    sample[7] = 'me ayuda con ';

    sample[8] = 'buenas';

    sample[9] = 'hola';

    sample[10] = 'hey';

    score = ponderation(message, sample);

    if (score > 0.8) {
      for (n of nextNode) {
        if (n.value == 1) {
          next = n.node;
        }
      }
      console.log('ES UN SALUDO: ' + score);
      answer = true;
    } else {
      console.log('NO ES UN SALUDO: ' + score);
      answer = false;
      next = 0;
    }





  } else if (apply_rule == 'next') {

    answer = true;

    for (n of nextNode) {
      if (n.value == 1) {
        next = n.node;
      }
    }

  } else if (apply_rule == 'ai') {

    answer = false;
    answer = await contextAI(message,id);
    tries = true;
    request = 'tries';
    if (answer == 'true') {
      for (n of nextNode) {
        if (n.value == 1) {
          next = n.node;
        }
      }
    }

  } else if (apply_rule == 'search') {

    answer = false;
    answer = await searchAI(message,id);
    request = 'search';
    delaytime = true;
    if (answer == true) {
      for (n of nextNode) {
        if (n.value == 1) {
          next = n.node;
        }
      }
    }

  } else if (apply_rule == 'delay') {

    answer = true;
    delaytime = true;
    request = 'default';
    if (answer == true) {
      for (n of nextNode) {
        if (n.value == 1) {
          next = n.node;
        }
      }
    }

  } else {
    message = answer
    answer = false;
    for (n of nextNode) {
      next = n.try_node;
    }
  }

  return {
    answer: answer, next: next, variable: variable, value: message, request: request, delaytime: delaytime
  };
}


const searchAI = async (message,id) => {

  let status = false;

  let toSearch = {search:message,score:'3',filter:'producto'};

  let dataFiles = await vector.similarity(toSearch);

  let dataStore =[];

   dataFiles.forEach((file)=>{

   let prod= {
      "role": "system",
      "content": file.metadata.id
    }

    dataStore.push(prod);

  });

 
  console.log(dataStore);

  if(dataFiles.length!=0){

    let saveFile =await memory('search',id,dataStore);

    status = true;
  }


  console.log(status);

  return status;


}


const contextAI = async (message,id) => {

  let decision = false;

  dataFiles = await memory('search',id);


  let context = [
    {
      "role": "system",
      "content": "Operational parameters"
    },
    {
      "role": "system",
      "content": "You are an AI agent in spanish language.Your job is determine and complete shop list, verify and check product name and quantity products that user add to shop list."
    },
    {
      "role": "system",
      "content": "Rules"
    }, 
    {
      "role": "system",
      "content": "-AI *important* use this common spanish words when you only show one product then user use  to add product to shop list quantity to shop list like :'llevo 5','quiero 5','necesito solo 4','dame 6','nada mas 3','agrega 5' or spanish number like 'tres' or number '3'  "
    },
    {
      "role": "system",
      "content": "-AI *important* use this common spanish words when user add one or multimple products to shop list quantity to shop list like :'llevo 5 del paquete ...','quiero 5 de ...','solo 6 del ...','dame 6 del ...','tambien quiero 5 del ...','agrega 5 del ...','y tambien serian 5 de ...'.  "
    },
    {
      "role": "system",
      "content": "-AI *very important* for *every response to user* send shop list like this format: {'answer':'true','shop_list':[{'product_id':'product name b','qty':1},{'product_id':'product name b','qty':3}]}"
    },
        {
      "role": "system",
      "content": "-AI *important* If the user does not respond to add a product or is out of context then send like format : {'answer':'false','shop_list':'none''}"
    },
    {
      "role": "system",
      "content": "Begin the conversation:"
    },
    {
      "role": "user",
      "content": "¿que productos tienes?"
    },
    {
      "role": "system",
      "content": "tengo:"
    }];

 dataFiles.forEach((item)=>{
    context.push(item);

  });

  let agentRequest={};

  if(dataFiles.length==1){

  agentRequest = { 
    "role":"assistant",
    "content":" ¿ Cuantos deseas agregar ?",
  };

  }else{
  agentRequest = { 
    "role":"assistant",
    "content":"¿ cual producto deseas agregar a tu lista de compra?",
  };
}

   context.push(agentRequest);

  
   let userRequest =  {
      "role": "user",
      "content": message
    };


   context.push(userRequest);  


  let responseAI = await AI(context);

  let jsonResponse = responseAI.replaceAll("'",'"');

  let dataResponse = JSON.parse(jsonResponse);

  console.log('RESPONSE AI');
  console.log(dataResponse);





  return dataResponse.answer;


}

const randomatic = (min, max) => {


  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive



}

const ponderation = (comparation, list) => {


  let calification_1 = 0;

  let calification_2 = 0;

  let calification_3 = 0;

  let calification_4 = 0;

  let calification_5 = 0;

  let calification_6 = 0;

  let calification_7 = 0;

  let score = 0;

  let summatory = 0;


  calification_1 = stringSimilarity.compareTwoStrings(comparation, list[1]);

  calification_2 = stringSimilarity.compareTwoStrings(comparation, list[2]);

  calification_3 = stringSimilarity.compareTwoStrings(comparation, list[3]);

  calification_4 = stringSimilarity.compareTwoStrings(comparation, list[4]);

  calification_5 = stringSimilarity.compareTwoStrings(comparation, list[5]);

  calification_6 = stringSimilarity.compareTwoStrings(comparation, list[6]);

  calification_7 = stringSimilarity.compareTwoStrings(comparation, list[7]);


  summatory = calification_1 + calification_2 + calification_3 + calification_4 + calification_5 + calification_6 + calification_7;



  if (summatory >= 0.5) {
    score = 1;

  } else {
    score = 0;
  }



  return score;


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

  let messages = require('../flow.json');


  //messages = JSON.parse(messages);

  //console.log(messages);



  return messages[value];



}

const contrast = async (value) => {


  let currentNode = await node(value);


  let valueContrast = currentNode.contrast;

   let valueContent = currentNode.content;


  let toContrast = {
    "role": "assistant",
    "content": valueContent,
    "contrast": valueContrast,
    "type": "text"
  };


  return toContrast;



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
    { "role": "system", "content": "AI: determine product options to buy like unitary, bundles, packets, promotions and list like: ['1 600 ml','250 ml','1 lt','bundle of 8']" },
    { "role": "system", "content": "AI: *Important* for all respones to user send with this like format: {'id':'product_name','product_options':['option buy a','option buy b'],'category':'category_one,category_two','price':100,'score':1,'tags':['tag1','tag2','tag3'],'description':'description'}." },


  ];

  let content = '';

  if (data.type == 'txt') {
    content = await toTXT(file);

  } else if (data.type == 'html') {

    content = await toHTML(file);
  } else if (data.type == 'url') {

    content = await loadFile(data);

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


  textClassification = textClassification.replaceAll("'",'"');

  let objClassification=JSON.parse(textClassification);

  objClassification.file = file;

  objClassification.content = content.replaceAll(/(\r\n|\n|\r)/gm, "");

  await vector.loadData(objClassification);

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

const loadCSV = async (data) => {

  let filePath = './public/shard.csv';

  fs.writeFileSync(filePath, data);

  return { "file": "save" };



}

const codeBar = async (req) => {


 const filenames = req.files.map(file => file.filename);



    const config = {
      // Specify that we are decoding a single static image
      inputStream: {
        name: "jon",
        type: "ImageStream", // Use NodeJS input stream type
        // The size is important for image processing in Node environments
        singleImageMode: true
      },
      // The source of the image, can be a local path or a data URL
      src: './public/' + filenames[0],
      decoder: {
        // Specify the type of readers to use
        readers: ["code_128_reader", "ean_reader", "upc_reader", "code_39_reader"],
        // Attempt to locate the barcode within the image for better results
        locate: true
      },
      // Set debug mode if needed (optional)
      debug: {
        drawBoundingBox: true,
        drawScanline: true,
        showCanvas: true,
        showPatches: true
      }
    };

    var codebarNumber='';
    var codebarFormat='';

    // Call the decodeSingle method
   await Quagga.decodeSingle(config, function (result) {
      if (result && result.codeResult) {


        codebarNumber = result.codeResult.code;
        codebarFormat = result.codeResult.format;

      } else {

         codebarNumber = 'none'
         codebarFormat = 'none';
        
      }
    });

    return {code:codebarNumber, format: codebarFormat};
  
}

const uploadFileOpenAI = async (data) => {


  let filePath = './public/shard.csv';

  fs.writeFileSync(filePath, data.source);


  const vector_store = await client.vectorStores.create({   // Create vector store
    name: "Support FAQ",
  });

  await client.vector_stores.files.upload_and_poll({         // Upload file
    vector_store_id: vector_store.id,
    file: fs.createReadStream("./public/shard.csv"),
  });



}

const determineAI = async (determine, variable, value) => {


  let messages = require('../determine.json');


  let evaluation = await AI(messages);

  return evaluation;

}

const AI = async (messages) => {


  let response = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-5-nano"
  }).then((response) => {

    return response.choices[0].message.content;

  })

 
  return response;
}

const memory = async (type, number, data = null) => {
  let code = '+';

  let stringData = '{"empty":"true"}';

  if (type == 'state') {
    code = '-state:';
  } else if (type == 'variable') {
    code = '-variable:';
  } else if (type == 'file') {
    code = '-file:';
  } else if (type == 'search') {
    code = '-search:';
  } else if (type == 'history') {
    code = '-history:';
  } else if (type == 'try') {
    code = '-try:';
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


  if (number == '5215582492980') {

  

    return { "response": "self" };

  } else {

    await input(number, message, 'whatss');

  }

}

const whatss = async (number, message) => {

  var data = qs.stringify({
    "token": "KEY",
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

const imageWhatss = async (number, caption, file) => {

  var data = qs.stringify({
    "token": "KEY",
    "to": "+" + number,
    "image": file,
    "caption": caption,
    "caption": "",
    "priority": "",
    "referenceId": "",
    "msgId": ""
  });



  var config = {
    method: 'post',
    url: 'https://api.ultramsg.com/instance110925/messages/image',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };




  let res = axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));

      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });




}

const fileWhatss = async (number, address, file) => {



  var data = qs.stringify({
    "token": "KEY",
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



  let res = axios(config)
    .then(function (response) {
      //console.log(JSON.stringify(response.data));

      return JSON.stringify(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });


  

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






  return textTXT;



}

const saveLog = async (data) => {

  let dataText = '';

  if (typeof data === 'string') {
    dataText = data;

  } else {

    dataText = JSON.stringify(data);

  }


  let filePath = './public/log.txt';

  try {

    fs.writeFileSync(filePath, data);



  } catch (error) {
    console.error("Error file:", error);


  }

}

const loadFile = async (data) => {



  let filePath = './public/sample.html';

  try {
    let response = await axios.get(data.url);
    let corsHTML = response.data; // The HTML content as a string

    corsHTML = corsHTML.replaceAll(/(?:https?|ftp):\/\/[\n\S]+/g, '');

    const $ = cheerio.load(corsHTML);


    $('script').remove();
    $('style').remove();





    const bodyText = $('body').text();
    // Example: Get the inner HTML of the body tag
    //let bodyContent = document.documentElement.getElementsByTagName('body')[0].innerHTML;

    fs.writeFileSync(filePath, bodyText);


  } catch (error) {
    console.error("Error during file download:", error);

    fs.unlink('./public/error.txt', () => { });
    throw error;
    console.error("Error loading the HTML file:", error);
  }



  //var contents = await fsPromises.readFile('./public/' + data.name + '.' + data.extension, { encoding: 'utf8' });






}

const hour = async (job = 'default') => {

  await saveLog('hour:' + job);




}

const hook = async (data = { "default": "default" }) => {


  await saveLog('hook:' + data);



}

const reedirect = async (data = { "default": "default" }) => {


  await saveLog('redirect:' + data);


}

const readyHTML = async (path = '') => {



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


const sleep = async (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const browser = async (params) => {

  try {
    // 1. Navigate to the URL

    const session = await driver.getSession();
    const sessionId = session.getId();
    console.log('Session ID:', sessionId);

    await driver.navigate().refresh();


    await driver.get(params.url);

    await driver.sleep(3000);



    await driver.executeScript('return Array.prototype.slice.call(document.getElementsByTagName("script")).forEach( function(item) {  item.remove();});')

    await driver.executeScript('return Array.prototype.slice.call(document.getElementsByTagName("style")).forEach( function(item) {  item.remove();});')

    await driver.executeScript('function texto(){ allKids = document.querySelectorAll("a");  allKids.forEach((el)=>{ el.textContent = "*"+el.textContent+"*"; }); }; texto();');

    await driver.executeScript('function parrafo(){ allPigs = document.querySelectorAll("p");  allPigs.forEach((ep)=>{ ep.textContent = "|"+ep.textContent+"|"; }); }; parrafo();');

    let texto = await driver.executeScript('function onlytext(){ let fulltext=""; alltext = document.querySelectorAll("*"); alltext.forEach((al)=>{ if(al.textContent){ fulltext = al.textContent + fulltext; }}); return fulltext;} return onlytext();');




    let filePath = `${__dirname}/public/`+params.file+`.txt`;


    texto = texto.replaceAll('\n', '');

    texto = texto.replaceAll('\t', '');

    texto = texto.replaceAll(' ', '');

    fs.writeFileSync(filePath, texto);

    return texto;


  } catch (error) {
    console.error('Error extracting data:', error);
  } finally {

    await driver.quit();
  }


}



module.exports = { codeBar, saveLog, hour, hook, reedirect, browser, requestDeepAI, requestOpenAI, web, inputWhatss, input, loadFile, loadCSV, toHTML, classificationFile }