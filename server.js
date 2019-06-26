var http = require('http');
const { app } = require('./app');

const port = process.env.port || 5101;

//create a server object:
http.createServer(function(req, res) {
	app.handle(req, res);
}).listen(port, () => {
	console.log(`Server ready at http://localhost:${port}`);
	console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
});
