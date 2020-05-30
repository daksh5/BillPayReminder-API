const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var Schema = mongoose.Schema;

var app = express();
app.use(express.static('public'));
app.set('view engine','pug');
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended:true}));

var schemaName = new Schema({
	  name: String,
    amount: Number,
    due_date: String,
    category: String,
    id: Number
}, {
	collection: 'collectionName'
});

var idd = 0;

var Model = mongoose.model('Model', schemaName);
mongoose.connect('mongodb://localhost:27017/ccaa');

app.get('/save/:r_name/:r_amount/:r_due/:r_category', cors(), function(req, res) {

    var r_name = req.params.r_name;
    var r_amount = req.params.r_amount;
    var r_due = req.params.r_due;
    var r_category = req.params.r_category;

    console.log('saving reminder:'+r_name)
	var savedata = new Model({
		'name': r_name,
        'amount': r_amount, 
        'due_date': r_due,
        'category': r_category,
        'id': idd
	}).save(function(err, result) {
		if (err) throw err;

		if(result) {
      console.log("saving reminder: ");
      res.end('record saved..');

		}
	})
});

app.get("/update/:_id/:name/:amount/:due_date/:category", cors(), function(req, res) {
    var r_name = req.params.name;
    var r_amount = req.params.amount;
    var r_due = req.params.rue;
    var r_category = req.params.category;
    var r_id = req.params._id
    Model.findByIdAndUpdate(
      { _id: r_id },
      { $set: req.params }, function(err) {
        if (err) {
          res.send(err);
        } else {
          console.log("update reminder: "+r_id);
          res.send("record updated..");
        }
      }
    )
  });

  

app.delete('/delete/:_id', cors(), function(req, res){
    var r_id = req.params._id;

    Model.findByIdAndRemove(r_id, function (err) {
        if (err) return next(err);
        res.send('record deleted..');
        console.log('delete reminder:'+r_id);
    })
});

app.post("/addname", (req, res) => {
    var query1 = req.params.firstName;
    var query2 = req.param.lastName
    console.log('saving query:'+query1)
	var savedata = new Model({
		'request': query1,
        'time': Math.floor(Date.now() / 1000), // Time of save the data in unix timestamp format
        'id': query2
	}).save(function(err, result) {
		if (err) throw err;

		if(result) {
            res.end('put method '+ req.params.firstName);
			
		}
	})
});




app.get('/find/:query', cors(), function(req, res) {
	var query = req.params.query;

	Model.find({
		'name': query
	}, function(err, result) {
		if (err) throw err;
		if (result) {
            res.json(result);
            console.log(result);  

		} else {
			res.send(JSON.stringify({
				error : 'Error'
			}))
		}
	})
});

app.get('/usersList', function(req, res) {
    Model.find({}, function(err, result) {
       
        if (err) throw err;
		if (result) {
            res.json(result);
        }
    });
  });

var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log('Node.js listening on port ' + port);
});
