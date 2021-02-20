const express = require('express') 
const bodyparser = require('body-parser') 
const path = require('path') 
const app = express() 

var Publishable_Key = 'pk_test_51IMvzCDjHqcnVG9uyBhACwmsdWo8BWErBmm8bskyHFixQCsmBy888A3aUpUs12QBUYfv6vnBsPugTEQMgeWtNh30005ha0D1zc'
var Secret_Key = 'sk_test_51IMvzCDjHqcnVG9u1edJcvDPtFaJArcQ8VSMs3CDxZI8K1OwiLfHyQOXaWGtIA1KSB9Vp6fykwhi9hhomoPur34c00E2UTNqvs'

const stripe = require('stripe')(Secret_Key) 

const port = process.env.PORT || 3000 

app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json()) 

// View Engine Setup 
app.set('views', path.join(__dirname, 'views')) 
app.set('view engine', 'ejs') 

app.get('/', function(req, res){ 
	res.render('home', { 
	key: Publishable_Key 
	}) 
}) 

app.post('/payment', function(req, res){ 

	// Moreover you can take more details from user 
	// like Address, Name, etc from form 
	stripe.customers.create({ 
		email: req.body.stripeEmail, 
		source: req.body.stripeToken, 
		name: 'Sounav Saha', 
		address: { 
			line1: '219/1A Lake Gardens', 
			postal_code: '700045', 
			city: 'Kolkata', 
			state: 'West Bengal', 
			country: 'India', 
		} 
	}) 
	.then((customer) => { 

		return stripe.charges.create({ 
			amount: 250000,	 // Charing Rs 2500 
			description: 'Donation to Charity', 
			currency: 'INR', 
			customer: customer.id 
		}); 
	}) 
	.then((charge) => { 
		res.send("Success") // If no error occurs 
	}) 
	.catch((err) => { 
		res.send(err)	 // If some error occurs 
	}); 
}) 

app.listen(port, function(error){ 
	if(error) throw error 
	console.log("Server created Successfully") 
})