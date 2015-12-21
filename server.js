'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

var express = require('express'),
	mongojs = require('mongojs'),
	bodyParser = require('body-parser')

var morgan,
	compression
	
var app = express(),
	dbLocation = ''

app.use(bodyParser.urlencoded({'extended':'true'}))
app.use(bodyParser.json())

if(process.env.NODE_ENV === 'development'){
	dbLocation = 'cafedb'
	
	morgan = require('morgan')
	app.use(morgan('dev'))
} else if (process.env.NODE_ENV === 'production'){
	dbLocation = 'mongodb://leptone:leptone@ds033145.mongolab.com:33145/heroku_n1twfcxv'
	
	compression = require('compression')
	app.use(compression())
}
var db = mongojs(dbLocation, ['cafes'])

app.set('views', './public/views')
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))

app.listen(process.env.PORT || 3000)
console.log('Listening on port 3000 test')
	
// Routes
app.get('/', function(req, res, next){
	console.log('req.body.sorter', req.body.sorter)
	if(req.body.sort === 'upAvg'){
		db.cafes.find().sort({upAvg: -1}).toArray(function(err, cafes){
			if (err) { next(err) }
			else {
				res.render('index', {cafes: cafes})
			}
		})
	} else {
		db.cafes.find().sort({downAvg: -1}).toArray(function(err, cafes){
			if (err) { next(err) }
			else {
				res.render('index', {cafes: cafes})
			}
		})
	}
})
app.get('/upSort', function(req, res, next){
	db.cafes.find().sort({upAvg: -1}).toArray(function(err, cafes){
		if (err) { next(err) }
		else {
			res.render('index', {cafes: cafes})
		}
	})
})
// Add Cafe 
app.post('/addCafe', function(req, res, next){
	console.log('req.body', req.body)
	var newCafe = req.body	
	db.cafes.insert(newCafe)
	
	res.redirect('/')
})

// Add SpeedTest
app.post('/addTest', function(req, res, next){
	console.log('req.body.id', req.body.id)
	res.end("what the hell!")
	console.log('req.params.id', req.params.id)
	db.cafes.findAndModify({
		query: {_id: mongojs.ObjectId(req.body.id)},
		update: {
			$push: {
				testList: req.body.test
			}
		},
	new: true}, function (err, doc) {
		if(err) {console.log(err)}
		else{
			console.log('doc', doc)
			setAvgs(req.body.id)
		}
	})	
	res.redirect('/')
})
function setAvgs(id){
	db.cafes.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
		if(err){ console.log(err) }
		else{
			var down = 0,
				up = 0
				
			console.log('doc', doc)
			console.log('doc.testList', doc.testList)
			for(var i = 0; i < doc.testList.length; i++){
				down += doc.testList[i].downloadSpeed
				up += doc.testList[i].uploadSpeed
			}
			down /= doc.testList.length
			up /= doc.testList.length
			
			down = Math.round(10*down)/10
			up = Math.round(10*up)/10
			
			db.cafes.findAndModify({
				query: {_id: mongojs.ObjectId(id)},
				update: {
					$set: {
						downAvg: down,
						upAvg: up
					}
				},
			new: true}, function (err, doc) {
				if(err) {console.log(err)}
				else{
					console.log('doc', doc)
				}
			})	
			
			
		}
	})
}

//Upload Test Route
app.post('/uploadTest',function(req, res){
	var start = Date.now()
	req.on('end', function(){
		var elapsed = Date.now() - start	
		
		console.log(elapsed.toString())
		
		res.end(elapsed.toString())
	})
	
	req.resume()
})

/*

//Add Cafe Route
router.addRoute('/addCafe', function(server){
    parseform(server.req, server.res, function (err, params) {
        if(err) console.log('err',err)

        console.log('params:',params)

        var aCafe = new cafeConstructor(params)
        server.cafes.insert(aCafe, function(err){
            if(err){
                server.res.end(JSON.stringify(err))
                return
            }
            server.res.statusCode=302
            server.res.setHeader('location', '/') //redirect header
            server.res.end('ok\n')
        })
    })
})

//Add Speed Test Route
router.addRoute('/addSpeedTest', function(server){
    parseform(server.req, server.res, function (err, params) {
        if(err) console.log('err',err)

        server.cafes.update(
            {"_id": ObjectId(params.id)},
            {$push: {testList: params.test}},
            function(err){
                if(err) {
                    server.res.end(JSON.stringify(err))
                    return
                }
                server.res.statusCode=302
                server.res.setHeader('location', '/') //redirect header
                server.res.end('ok\n')
            }
        )
    })
})

//Upload Test Route
router.addRoute('/uploadTest',function(server){
    var start = Date.now()
    server.req.on('end', function(){
        var elapsed = Date.now() - start

        server.res.end(elapsed.toString())
    })
    server.req.resume()
})

//Delete Cafe Route
router.addRoute('/deleteCafe', function(server){
    parseform(server.req, server.res, function (err, params) {
        server.cafes.remove( {"_id": ObjectId(params.id)}, function(err){
            if(err){
                server.res.end(JSON.stringify(err))
                return
            }
            server.res.statusCode=302;
            server.res.setHeader('location', '/'); //redirect header
            server.res.end('ok\n');
        });
    });
})
*/

