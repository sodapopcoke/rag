const express = require('express');
const path = require('path');

const cluster = require('node:cluster')
const http = require('node:http');
const process = require('node:process');

 const cors = require('cors');


var timeout = require('connect-timeout')

const port = process.env.PORT || 5006

const app = express();

const { Client } = require('pg');


var timeout = require('connect-timeout');



app.use(cors());



//app.use(timeout('5s'))



//Promise.all([
//    import('adminjs'),
//    import('@adminjs/express'),
//]).then(([{default: AdminJS}, {default: AdminJSExpress}]) => {

//    const admin = new AdminJS({})

//    const adminRouter = AdminJSExpress.buildRouter(admin)
//    app.use(admin.options.rootPath, adminRouter)


//})






app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(timeout('190000s'))

//app.use(haltOnTimedout)

const numOfWorkers =
  process.env.HEROKU_AVAILABLE_PARALLELISM || // for fir-based apps
  process.env.WEB_CONCURRENCY || // for cedar-based apps
  1


  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)
    for (let i = 0; i < numOfWorkers; i++) {
      cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`)
    })
  } else {  


app.get('/', (req, res) => {
  res.render('pages/index')
})

app.use("/api", require("./routes/routes"));

const server = app.listen(port, () => {
 
  console.log(`Listening on ${port}`);
})


  }





function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}