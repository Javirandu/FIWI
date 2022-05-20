//Middleware
let express = require('express');
const session = require('express-session');

//other scripts
const api_request = require('./scripts/api_connector.js');
const db_request = require('./scripts/db_connector.js');
const path = require('path');
// CommonJS
const Swal = require('sweetalert2');

let app = express();
app.use(express.json());
app.use('/scripts/', express.static(__dirname + '/scripts')); //loading scripts needed
app.use(express.static(path.join(__dirname, "/public"))); //css

//session
const { v4: uuidv4 } = require('uuid');
app.use(session({
	genid:function(req){
		return uuidv4();
	},
	secret: 'cesurformacion',
	resave: true,
	maxAge:300,
	saveUninitialized: true,
	name: 'fiwi_logged'
}));




//sending homepage
app.get('/', (req, res) => {
	res.sendFile('public/formulario.html', { root: __dirname });
});

//getting data from form  
app.post('/', async (req, res) => {
	const { title, region, country } = req.body;
	const { authorization } = req.headers;

	const asyncFetching = async () => {
		try {
			//creating api_request object
			let request = new api_request();

			const response = await request.sendRequest(title, region, country); //data fecth
			return response
		} catch (error) {
			//catching posible errors
			console.log(error);
			res.sendStatus(500); //internal server error
		}
	}
	//sending data back to frontend  
	const data = await asyncFetching(); //waiting for data to send
	if(data && data.length>0){
		res.send(data);
	}else{
		res.send({
			retStatus: 'not found',
			msg:'Title not found'
		});;
	}

});

/*
LOGIN
*/
app.get('/login', function (req, res) {

	res.sendFile('public/login.html', { root: __dirname }); //sending login
});

app.post('/login', async (req, res) => {
	let query = new db_request();

	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		// Checking if account is in database
		result =  await query.getConnection(username,password);
			// If account true
			if (result) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				res.send({
					retStatus: 'success',
					redirectTo:'/home',
					msg:'home'
				});
			} else {
				res.send({
					retStatus: 'fail',
					msg:'Wrong username or password'
				});
			}
			res.end();
	} else {
		res.send('Please enter Username and Password!');
		res.redirect('/login');
		res.end();
	}
});

/*
LOG OUT
*/
app.get('/logout', function (req,res) {

	req.session.destroy();
	res.redirect('/');
});

/*
CREATE USER
*/
app.get('/create', function (req, res) {

	res.sendFile('public/create_user.html', { root: __dirname }); //sending login
});

app.post('/create',  async (req, res) => {

	let data = req.body
	const creation =  async() =>{
		try{
			let query = new db_request();
			const result =  await query.createUser(data);
			return result;
		}catch(error){
			console.log(error);
		}
	}
	const result =  await creation();
	if (result){
		//redirect to main to login with success
		res.send({
			retStatus: 'success',
			redirectTo:'/',
			msg:'main home'
		}); 
	}else{
		res.send({
			//user name already in database alert incoming
			retStatus: 'fail',
			msg:'username already in use'
		}); 
	}
})


/*
HOME
*/
app.get('/home', function (req, res) {
	//checks if user is logged to send home
	if (req.session.username !== undefined){
		console.log("is logged");
		res.sendFile('public/home.html', { root: __dirname }); //sending login
	}
	else{
		res.redirect('/');
	}
});
app.post('/home', async (req, res) => {
	let query = new db_request();
	let sess = req.session;
	let cards = await query.getCards(sess.username); //cards saved in db
	// sess.save();
	res.send({
		username: sess.username,
		cards : cards 
	});
})

app.post('/saveCard', async (req, res) => {
	const { web_url, poster,platform } = req.body;
	let sess = req.session;
	let username = sess.username;
	try{
		let query = new db_request();

		const result = await query.saveCard(username, web_url, poster, platform);
		if (result){
			//redirect to main to login with success
			res.send({
				retStatus: 'saved',
				msg:'card saved, refresh to see it in your library.'
			}); 
		}else{
			res.send({
				//user name already in database alert incoming
				retStatus: 'fail',
				msg:'card already saved.'
			}); 
		}
	}catch(e){
		console.log(e);
	}
		
	console.log(web_url, poster, platform);
})

app.post('/deleteCard',async(req, res) => {
	let web_url = req.body.web_url;
	let username = req.session.username;

	try{
		let query = new db_request();

		const deleteCard = await query.deleteCard(username, web_url);
		if (deleteCard){
			//redirect to main to login with success
			res.send({
				retStatus: 'deleted',
				msg:'card deleted.'
			}); 
		}else{
			res.send({
				//user name already in database alert incoming
				retStatus: 'fail',
				msg:'card was not deleted.'
			}); 
		}
	}catch(e){
		console.log(e);
	}
})

app.post('/search', async (req, res) => {
	const { title, use_region, country } = req.body;
	const { authorization } = req.headers;

	const asyncFetching = async () => {
		try {
			//creating api_request object
			let request = new api_request();

			const response = await request.sendRequest(title, use_region, country); //data fecth
			return response
		} catch (error) {
			//catching posible errors
			console.log(error);
			res.sendStatus(500); //internal server error
		}
	}
	//sending data back to frontend  
	const data = await asyncFetching(); //waiting for data to send
	if(data){
		res.send(data);
	}else{
		res.send({
			retStatus: 'not found',
			msg:'Title not found'
		});;
	}

});



/*
app listening port
 */
app.listen(3000, () => {
	console.log('Server en: http://127.0.0.1:3000'); //muestra el formulario como home
});
