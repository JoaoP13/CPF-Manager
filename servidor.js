const express = require('express');
const app = express();

app.set('port', process.env.PORT || 8080);
app.use(express.static('./frontend'));

app.listen(app.get('port'), () => {
	console.log(`O servidor está rodando na porta ${app.get('port')}`);
});
