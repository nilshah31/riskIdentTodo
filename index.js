const config     = require('./config.json')
const express    = require('express')
const routes     = require('./routes/routes.js')
const bodyParser = require('body-parser');
const app        = express()
const cors       = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Routes and server Configuration
 * cors will allow specified origin to access website 
 */
app.use(cors({origin: '*'}));
app.use('/api', routes);
app.use('/*',(req,res) => {
  res.status(404).send({
    error_code :"404",
    message    :"Api Not found"
  });  
});
app.listen(process.env.PORT || config.port, () => console.log(`Application Running on the Port : ${config.port}!`))