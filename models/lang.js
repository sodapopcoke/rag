

const { RedisVectorStore } = require('@langchain/redis');

const { OpenAIEmbeddings } = require("@langchain/openai");

const { Document } = require("@langchain/core/documents");

const { ChatOpenAI } = require("@langchain/openai");

const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const { MemoryVectorStore } = require("@langchain/classic/vectorstores/memory");

const { createRetrieverTool } = require("@langchain/classic/tools/retriever");

const { TextLoader } = require("@langchain/classic/document_loaders/fs/text");

const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio");


const { HumanMessage } = require("@langchain/core/messages");


var redis = require('redis');

var vectorStore = {};

const { SchemaFieldTypes } = require('redis');


const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: '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'
});


const client = redis.createClient({
  username: 'default',
  password: '6CiJt4sC4gpUTNjiAfMU3bIaXilqYk9A',
  socket: {
    host: 'redis-10657.c74.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 10657,
    connectTimeout: 30000
  }
});


const retry = async (data) => {

  await vectorindex();

  retriever = vectorStore.asRetriever();

  return await retriever.invoke(data.query);;

}


const getTool = async (retriever, name, description) => {

  const tool = createRetrieverTool(
    retriever,
    {
      name: name,
      description: description
    },
  );

  return tool;


}


const request = async (data) => {


  const input = { messages: [new HumanMessage(data.message)] };
  const result = await generateQueryOrRespond(input);
  console.log(result.messages[0]);

  return result.messages;

}


const generateQueryOrRespond = async (data) => {


  let tools = [];
  let trie = { query: data.trigger };
  let retriever = await retry(trie);

  let tool = await getTool(retriever, data.name, data.description);

  const { messages } = data;
  const model = new ChatOpenAI({
    apiKey: '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',
    model: "gpt-4o",
    temperature: 0,
  }).bindTools([tool]);

  const response = await model.invoke(messages);
  return {
    messages: [response],
  };

}



const search = async (data) => {

  await vectorindex();

  const textFilterResults =
    await vectorStore.similaritySearchVectorWithScoreAndMetadata(
      await embeddings.embedQuery(data.filter),
      3,
      {
        description: data.search, // Text search in description field
        score: { min: data.score }, // Minimum score of 85
      }
    );

  console.log("Text filter results:");
  for (const [doc, score] of textFilterResults) {
    console.log(`* [SIM=${score.toFixed(3)}] ${doc.pageContent}`);
    console.log(`  Description: ${doc.metadata.description}`);
  }

  return textFilterResults;

}


const loadData = async (data) => {



  let documents = [];

  await vectorindex();

  let document = new Document({ pageContent: data.content, metadata: { id: data.id, category: data.category, score: data.score, tags: [data.tag.one, data.tag.two], description: data.description } });

  documents.push(document);

  // This will validate each document's metadata against the custom schema
  await vectorStore.addDocuments(documents);

  return { 'result': true };


}


const vectorindex = async () => {

  if (!client.isOpen) {
    await client.connect();
  }


  const customSchema = {
    id: {
      type: SchemaFieldTypes.TEXT,
      required: true,
      SORTABLE: true,
    },
    category: {
      type: SchemaFieldTypes.TAG,
      SORTABLE: true,
      SEPARATOR: ",",
    },
    price: {
      type: SchemaFieldTypes.NUMERIC,
      SORTABLE: true,
    },
    score: {
      type: SchemaFieldTypes.NUMERIC,
      SORTABLE: true,
    },
    tags: {
      type: SchemaFieldTypes.TAG,
      SEPARATOR: ",",
      CASESENSITIVE: true,
    },
    description: {
      type: SchemaFieldTypes.TEXT,
      NOSTEM: true,
      WEIGHT: 2.0,
    },
  };


  vectorStore = new RedisVectorStore(embeddings, {
    redisClient: client,
    indexName: "langchain",
    customSchema: customSchema

  });



}





const similararity = async (data) => {


  await vectorindex();


  const similaritySearchResults = await vectorStore.similaritySearch(
    data.search,
    data.score
  );

  for (const doc of similaritySearchResults) {
    console.log(`* ${doc.pageContent} [${JSON.stringify(doc.metadata, null)}]`);
  }

  return similaritySearchResults;

}


module.exports = { vectorindex, similararity, search, retry, request, loadData, generateQueryOrRespond, getTool };