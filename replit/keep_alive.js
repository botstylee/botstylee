let express = require('express');
let path = require('path');
let app = new express();
let PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'views')))
app.listen(PORT, () => console.log('App listened on port', PORT))
