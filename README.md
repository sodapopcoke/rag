# node-js OPEN AI AND LANGCHAIN
El proposito de este desarrollo es crear un agente de ventas, tomando en cuenta los siguientes puntos:

**Deberia poder generar fluos de conversacion usando vibecode**

**Usar un crawler para poder acceder a los sitios y crear la base de conocimiento**

**Usar la IA para despachar a los clientes**

Pasos para construir un RAG usando langchain, open ai con redis

Armando de Indices:

1.- Usando IA para generar la clasificacion a travez de documentos de texto*;
     - Genera un Archivo JSON que se usa para generar los indices
     * Pendiente desde HTML, URL
      

2.- Usando langchain se se generan los indices a partir de los archivos de clasificacion

```

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

  ```

3.- Se crea la herramienta (tool) usando los tags , categoria asociado al documento que tiene la informacion completa. 

4.- Se clasifican los documentos con el siguiente prompt:

```json
[
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

```

  5.- se usa un json para el flujo de conversación, que usa la lógica de maquina de estados.


```json

  [

    {
      "node": 0,
      "role": "assistant",
      "content": "...",
      "contrast": "envia un saludo para iniciar",
      "input": [
        { "variable": "saludo", "type": "greeting", "value": 1,"request":"default","node":[{"value":1,"node":1,"try_node":0}] }
      ],
      "try":3,
      "type":"text"
    },
    {
      "node": 1,
      "role": "assistant",
      "content": "😃 Bienvenido a tu tienda SODA ¿Qúe deseas realizar? \n 1️⃣.-Un pedido \n 2️⃣.-Registrarme ",
      "contrast":"🫵 Solo acepto un numero correcto 🔢 y valido ✅",
      "input": [
        { "variable": "funciona", "type": "between_1_2", "value": 1,"request":"default","node": [{"value":1,"node":5,"try_node":1},{"value":2,"node":2,"try_node":1}] }
      ],
      "try":3,
      "type":"text"
    },   
    {
      "node": 2,
      "role": "assistant",
      "content": "😃 Empezemos con tu registro :\n Por favor escribe tu nombre completo tal como aparece en tu identificacion oficial 🪪 ",
      "contrast": "☝ solo acepto un nombre completo ejemplo 'José López Pérez'",
      "input": [
         {"variable": "nombre", "type": "fullname", "value": "string","request":"default","node": [{"value":"string","node":3,"try_node":8}]}
      ],
      "type":"text",
      "try":3
    
    },
     {
      "node": 3,
      "role": "assistant",
      "content": "👌 Perfecto. Por favor por ultimo,ingresa tu RFC para registrate.",
      "contrast": "🫵 solo acepto el formato R.F.C. para continuar",
      "input": [
              {"variable": "rfc", "type": "rfc", "value": "string","request":"default", "node": [{"value":"string","node":5,"try_node":10}]}
      ],
      "try":3,
      "type":"text"
    },
    {
      "node": 4,
      "role": "assistant",
      "try":3,
      "content": "🙌 Gracias por tu Registro.",
      "input": [
         {"variable": "dashboard", "type": "wait", "value": "si","request":"default","node": [{"value":"si","node":1,"try_node":16}]}
      ],
      "type":"text",
      "contrast": "👋 hay solo te falta un pasito"
    },
    {
      "node": 5,
      "role": "assistant",
      "content": "👌 ¿Que producto deseas agregar ➕ ? o buscas.👀 ",
      "contrast": "🫵 envia un nombre de producto o descripcion",
      "input": [
              {"variable": "search", "type": "search", "value": 1,"request":"default","node": [{"value":1,"node":6,"try_node":5}]}
      ],
      "try":3,
      "type":"text"
   
    },
    {
      "node": 6,
      "role": "assistant",
      "try":3,
      "content": "✅ estos son los productos que tengo disponibles para ti",
      "input": [
         {"variable": "dashboard", "type": "ai", "value": "si","request":"default","node": [{"value":1,"node":7,"try_node":7}]}
      ],
      "type":"text",
      "contrast": "👋  espera estamos generando el pedido"
    },
    {
      "node": 7,
      "role": "assistant",
      "try":3,
      "content": "✅ listo ya esta siendo generado tu pedido 📦",
      "input": [
         {"variable": "dashboard", "type": "any", "value": true,"request":"default","node": [{"value":1,"node":1,"try_node":16}]}
      ],
      "type":"text",
      "contrast": "👋 solo espera un momento"
    },
    {
      "node": 8,
      "role": "assistant",
      "content": "🙌 Gracias por tu pedido en kof. vuelve pronto",
      "input": [
         {"variable": "dashboard", "type": "any", "value": true,"request":"default","node": [{"value":"si","node":1,"try_node":9}]}
      ],
      "type":"text",
      "try":3,
      "contrast": "🥱 estamos esperando...."
    }


]

```


6.- Por hacer : 

  1.-Separar toda la configuracion en JSON

  2.-Clasificar y comparar con el archivo CSV de productos
  
  3.-Que el leector de Codigo de barras lea desde whatss para agregar un producto o compararlo y subir stock CSV
  
  4.-Mejoraras del flujo - timer - auto respuesta si tarda mucho, webhook
  
  5.- Probar en con Vibe Code para generar flujos



