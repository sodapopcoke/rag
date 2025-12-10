# node-js OPEN AI AND LANGCHAIN
Pasos para construir un RAG usando langchain, open ai con redis

Armando de Indices:

1.- Usando IA para generar la clasificacion a travez de documentos de texto*;
     - Genera un Archivo JSON que se usa para generar los indices
     * Pendiente desde HTML, URL
      

2.- Usando langchain se se generan los indices a partir de los archivos de clasificacion

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

3.- Se crea la herramienta (tool) usando los tags , precio , categoria asociado al documento que tiene la informacion completa. 



