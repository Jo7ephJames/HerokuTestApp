var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router(); 
var mongoose = require('mongoose'); //for connecting to Mongo Databse
var Schedule = require('/app/models/appointmentschedule.js')
var Client = require('/app/models/client.js')
//twilio phone number +1786-481-4346 //password: dragonCo1nsFromMoonlight
var ClientInfo = require('../app/models/clientInfo.js')
var Nexmo = require('nexmo');
var User = require('../app/models/adminCredentials.js');
var passport = require ('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');

var nexmo = new Nexmo({
	apiKey: process.env.NEXMO_APIKEY,
	apiSecret: process.env.NEXMO_APISECRET
})

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	secure: false,
	port: 25,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS
	},
	tls: {
		rejectUnauthorized: false
	}
});

var helperOptions = {
	from: '"James Accounting" <janodemailer@gmail.com>',
	to: 'zerzeros@live.com',
	subject: 'Test Email',
	text: 'Test Email Success'
}

transporter.sendMail(helperOptions, function(error, info) {
	if(error) {
		console.log(error)
	} else {
		console.log(info)
	}
})


mongoose.connect('mongodb://heroku_rgvd5500:ug9ibkb780ug1qv0kecvu4sslv@ds111082.mlab.com:11082/heroku_rgvd5500');
mongoose.connection.once('open', function() {
	console.log('Connection has been made to database');
}).on('error', function(error) {
	console.log(error);
})

// twilio.messages.create({
// 	to: '+13052839503',
// 	from: '+17864814346',
// 	body: 'The first text from appointmentSetter' 
// }).then(function(message) {
// 	console.log(message.sid);
// }).done();

function getOrdinal(day) {
		if(day === '1'|| day[1] === '1' && day - 10 !== 1) { 
			return day+'st'
		};
		if(day === '2'|| day[1] === '2' && day - 10 !== 2) { 
			return day+'nd'
		};
		if(day === '3'|| day[1] === '3' && day - 10 !== 3) { 
			return day+'rd'
		};
		return day+'th'
}

function convertTimeString(time) {
		var timeSplit = time.split(':');
		var hour = parseInt(timeSplit[0]);
		var minute = timeSplit[1];
		var ampm
		if(hour < 12) {
			ampm = 'AM';
		} else {
			ampm = 'PM';
		}

		if(hour < 12 && hour !== 0) {
			var convertedString = hour.toString() + ':' + minute.toString() + ' ' + ampm;
			return convertedString;
		}

		if(hour >= 12) {
			hour = hour - 12;
			var convertedString = hour.toString() + ':' + minute.toString() + ' ' + ampm;
			return convertedString;
		}

		if(hour === 0) {
			hour = 12;
			var convertedString = hour.toString() + ':' + minute.toString() + ' ' + ampm;
			return convertedString;
		}
}

function createDayArray(index) {
	resultArray = [];
	for(var x = 0; x < daysInAMonth[index]; x++) {
		resultArray.push([]);
	}
	return resultArray;
}


function upDate() {
	var date = new Date();
	var monthIndex = date.getMonth();
	var nextMonthIndex = date.getMonth()+1
	var year = date.getFullYear();
	var monthsInYear = ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October', 'November', 'December']
	var daysInAMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]// indexes matched to monthsInYear array
	var month = monthsInYear[monthIndex];
	var nextMonth = monthsInYear[nextMonthIndex];
	var cycle = new Date(year, monthIndex, date.getDate()+1)
	var cycleSwitch = cycle-date;

	function createDayArray(index) {
	resultArray = [];
	for(var x = 0; x < daysInAMonth[index]; x++) {
		resultArray.push([]);
	}
	return resultArray;
	}

	var thisMonthSchedule = new Schedule({
		_id: month+year,
		scheduleArray: createDayArray(monthIndex)
	})
	var idChk = month+year;

	Schedule.findById(idChk).then(function(result) {
		if(result === null) {
			thisMonthSchedule.save();
			console.log('Database updated with schedule for '+idChk);
		} else {
			console.log('Schedule for '+idChk+' Exists');
		}
	})

	var nextMonthSchedule = new Schedule({
		_id: nextMonth+year,
		scheduleArray: createDayArray(monthIndex)
	})
	var idChkNext = nextMonth+year;

	Schedule.findById(idChkNext).then(function(result) {
		if(result === null) {
			nextMonthSchedule.save();
			console.log('Database updated with schedule for '+idChkNext);
		} else {
			console.log('Schedule for '+idChkNext+' Exists');
		}
	})
	
	function destroyIfObsolete(clientId, chkYear, chkMonth, chkDay) {
		function destroy() {
			Client.findByIdAndDelete(clientId).then(function(result) {
				console.log(result, 'Destroyed due to obsolescence')
			})
		}

		var minYear = year;
		var minMonthIndex = monthIndex;
		var minDay = date.getDate();

		if(chkYear < minYear) {
			destroy();
		} 
		
		if(monthsInYear.indexOf(chkMonth) < minMonthIndex) {
			destroy();
		}

		if(chkDay < minDay) {
			destroy();
		}

	}

	Client.find({}).then(function(result) {
		
		result.forEach(function(client) {
			var dateChkArray = client.date.split(',');
			dateChkArray[0] = dateChkArray[0].split('2');
			dateChkArray[0][1] = '2'+dateChkArray[0][1];
			var chkMonth =  dateChkArray[0][0];
			var chkYear = dateChkArray[0][1];
			var chkDay = dateChkArray[1];
			destroyIfObsolete(client._id, chkYear, chkMonth, chkDay);
			console.log('Compare:', year, monthIndex, date.getDate())
		})
		console.log('Cleared Appointments Past Due')
			
	})
	
	console.log(cycleSwitch)
	setTimeout(function() {
		upDate()
	}, cycleSwitch)
}

upDate();

// Setup Admin Credentials ---- Move credentials to ENV variables for Heroku
var adminCreds = new User({
	_id: 4777,
	username: process.env.ADMIN_USER,
	password: process.env.ADMIN_PASS,
})

var lgnUser
var lgnPass

User.findById(4777).then(function(result) {
	if(result === null) {
		adminCreds.save();
		console.log("Admin Configured On Database Initialization");
		lgnUser = result.username;
		lgnPass = result.password;
	} else {
		console.log("Admin Exists")
		lgnUser = result.username;
		lgnPass = result.password;
	} 
})


var app = express();
port =  process.env.PORT || 8080

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(passport.initialize());
app.use(passport.session());

router.get('/', function(req, res, next) {
	console.log('Request Recieved');
	next();
})

router.get('/admin', ensureAuthenticated, function(req, res, next) {
	console.log('Request Recieved');
	next();
})

router.get('/login', function(req, res, next) {
	console.log('Login Page Accesssed')
	next();
})

router.get('/logout', function(req, res, next) {
	console.log('Admin Logout')
	req.logout();
	res.redirect('/');
	next();
})

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
    	console.log(user)
      if (err) { return done(err); }
      if (username !== lgnUser) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (password !== lgnPass) {
        return done(null, false, { message: 'Incorrect password.' });
      }
	  return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('local', {successRedirect: '/admin', failureRedirect: '/login'}),
  function(req, res) {
  	console.log(req.user)
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated() ) {
		return next();
	} else {
		res.redirect('/');
	}
}

router.post('/admin', function(req, res, next) {
	reqVal = req.body
	var protocol
	var scheduleData 
	for(prop in reqVal) {
		protocol = prop
	}
	if(protocol === 'sendDate') {
		console.log('Serving ',protocol,' request from Client ')
		dateFromServer = new Date();
		upDate();
		res.send(dateFromServer)
	} 
	if(protocol.includes('sendScheduleData') ) {
		console.log('Serving ',protocol,' request from Client ')
		var scheduleId = protocol.split('|')[1];
		console.log(scheduleId)
		filledAppointments = [];
		clientName = [];
		Client.find({}).then(function(result) {
			result.forEach(function(client) {
				if(client.date !== null) {
					filledAppointments.push(client.date);
					clientName.push(client.firstName + ' ' + client.lastName);
				}
			})
			console.log(filledAppointments)
		})
		Schedule.findById(scheduleId).then(function(result) {
			var scheduleData = result
			filledAppointments.forEach(function(date, x) {
				dateArray = date.split(',')
				console.log(dateArray);
				if(dateArray[0] === scheduleId) {
					var timeArray = scheduleData.scheduleArray[dateArray[1]-1]
					timeArray.forEach(function(time, i) {
						if(time === dateArray[2]) {
							timeArray[i] = timeArray[i] + '!' + clientName[x]
							console.log(timeArray);
						}
					})
				}
			})
			res.send(scheduleData);
			console.log('Make this dynamic')
			res.end()
		})
	}
	if(protocol.includes('updateSchedule') ) {
		console.log('Serving ',protocol,' request from Client ')
		var scheduleId = protocol.split('|')[1];
		console.log(scheduleId);
		var updatedData = JSON.parse(protocol.split('|')[2]);
		console.log(updatedData);
		Schedule.findByIdAndUpdate(scheduleId, {scheduleArray: updatedData}).then(function(result) {
			console.log(result);
			res.end
		})
	}
	if(protocol.includes('updateAndCancelScheduleData') ) {
		console.log('Serving ',protocol,' request from Client ');
		var scheduleId = protocol.split('|')[1];
		console.log(scheduleId);
		var updatedData = JSON.parse(protocol.split('|')[2])
		console.log(updatedData);
		var dateArray = JSON.parse(protocol.split('|')[3]);
		var appointmentToCancel = JSON.parse(protocol.split('|')[3]).join(',')
		console.log(appointmentToCancel);
		var reason = protocol.split('|')[4];
		console.log(reason);
		Schedule.findByIdAndUpdate(scheduleId, {scheduleArray: updatedData}).then(function(result) {
			console.log(result);
			res.end
		})
		Client.findOneAndDelete({date: appointmentToCancel}).then(function(result) {
			console.log(result);
			transporter.sendMail({
				from: '"James Accounting" <janodemailer@gmail.com>',
				to: result.eMail+' ,verna@jamesaccounting.com',
				subject: 'James Accounting Appointment Cancelled',
				text: 'Your appointment with James Accounting for ' + dateArray[0].split('2')[0] + ' '+ getOrdinal(dateArray[1]) + ' ' + 'at' + ' ' + convertTimeString(dateArray[2]+ ' has been cancelled'+' Message:'+ reason) 
			}, function(error, info) {
				if(error) {
					console.log(error)
				} else {
					console.log(info)
				}
			});
			nexmo.message.sendSms(15186460734, '1' + result._id, 'Your appointment with James Accounting for ' + dateArray[0].split('2')[0] + ' '+ getOrdinal(dateArray[1]) + ' ' + 'at' + ' ' + convertTimeString(dateArray[2])+ ' has been cancelled'+' Message:'+ reason, function(err, responseData) {
				if(err) {
					console.log(err);
				} else {
					console.log('1' + result._id + ': Sent cancellation notice');
				}
			})

		})
	}
});

router.post('/', function(req, res, next) {
	reqVal = req.body
	var protocol
	var scheduleData 
	for(prop in reqVal) {
		protocol = prop
	}
	if(protocol === 'sendDate') {
		console.log('Serving ',protocol,' request from Client ')
		dateFromServer = new Date();
		upDate();
		res.send(dateFromServer)
	} 
	if(protocol.includes('sendScheduleData') ) {
		console.log('Serving ',protocol,' request from Client ')
		var scheduleId = protocol.split('|')[1];
		console.log(scheduleId)
		filledAppointments = [];
		Client.find({}).then(function(result) {
			result.forEach(function(client) {
				if(client.date !== null) {
					filledAppointments.push(client.date);
				}
			})
			console.log(filledAppointments)
		})
		Schedule.findById(scheduleId).then(function(result) {
			var scheduleData = result
			filledAppointments.forEach(function(date) {
				dateArray = date.split(',')
				console.log(dateArray);
				if(dateArray[0] === scheduleId) {
					var timeArray = scheduleData.scheduleArray[dateArray[1]-1]
					timeArray.forEach(function(time, i) {
						if(time === dateArray[2]) {
							timeArray.splice(i, 1);
							console.log(timeArray);
						}
					})
				}
			})
			console.log(scheduleData);
			res.send(scheduleData);
			res.end()
		})
	}
	if(protocol.includes('updateSchedule') ) {
		console.log('Serving ',protocol,' request from Client ');
		var scheduleId = protocol.split('|')[1];
		console.log(scheduleId);
		var updatedData = JSON.parse(protocol.split('|')[2]);
		console.log(updatedData);
		Schedule.findByIdAndUpdate(scheduleId, {scheduleArray: updatedData}).then(function(result) {
			console.log(result);
			res.end()
		})
	}
	if(protocol.includes('processClientData') ) {
		console.log('Serving ',protocol,' request from Client ');
		var clientData = JSON.parse(protocol.split('|')[1]);
		var duplicateChk
		Client.findById(clientData._id).then(function(result) {
			duplicateChk = result;
			console.log(duplicateChk);
			if(duplicateChk === null) {
				var newClient = new Client({
					_id: clientData._id,
					firstName: clientData.firstName,
					lastName: clientData.lastName,
					eMail: clientData.eMail,
					date: clientData.date
				})
				newClient.save();
				ClientInfo.findById(clientData._id).then(function(result2) {
					if( result2 === null ) {
						var newClientInfo = new ClientInfo({
							_id: clientData._id,
							firstName: clientData.firstName,
							lastName: clientData.lastName,
							eMail: clientData.eMail 
						})
						newClientInfo.save();
						console.log('New Client Info Saved To Database')
					}
				})
				transporter.sendMail({
					from: '"James Accounting" <janodemailer@gmail.com>',
					to: clientData.eMail +' ,verna@jamesaccounting.com',
					subject: 'James Accounting Appointment Confirmation',
					text: 'Your appointment with James Accounting has been scheduled for ' + clientData.date[0].split('2')[0] + ' '+ getOrdinal(clientData.date[1]) + ' ' + 'at' + ' ' + convertTimeString(clientData.date[2]+''), 
				}, function(error, info) {
					if(error) {
						console.log(error)
					} else {
						console.log(info)
					}
				});
				nexmo.message.sendSms(15186460734, '1' + clientData._id, 'Your appointment with James Accounting has been scheduled for ' + clientData.date[0].split('2')[0] + ' '+ getOrdinal(clientData.date[1]) + ' ' + 'at' + ' ' + convertTimeString(clientData.date[2]+''), function(err, responseData) {
					if(err) {
						console.log(err);
					} else {
						console.log('1' + clientData._id + ': Sent Confirmation Notice')
					}
				});
				res.send('Client Data Saved|'+clientData.date);
			} else {
				res.send(clientData.date);
			}
			res.end()
		})
	}
	if(protocol.includes('cancelAppointment') ) {
		console.log('Serving ',protocol,' request from Client ');
		var phoneNumber = JSON.parse(protocol.split('|')[1]);
		var duplicateChk 
		Client.findById(phoneNumber).then(function(result) {
			duplicateChk = result;
			if(duplicateChk === null) {
				res.send('No Appointment')
			} else {
				var dateToEdit = result.date.split(',');
				console.log(duplicateChk)
				console.log(dateToEdit);
				Schedule.findByIdAndUpdate(dateToEdit[0]).then(function(result) {
					var scheduleToEdit = result
					scheduleToEdit.scheduleArray[dateToEdit[1]-1].forEach(function(time) {
						if(time.includes('!') && time.includes(dateToEdit[2]) ) {
							time = time.split('!')[1];
						} 
					})
					Schedule.findByIdAndUpdate(dateToEdit[0],{scheduleArray: scheduleToEdit.scheduleArray} ).then(function(result) {
						console.log('Updated')
					})
				})
					Client.findByIdAndDelete(phoneNumber).then(function(result) {
					console.log(result);
					transporter.sendMail({
						from: '"James Accounting" <janodemailer@gmail.com>',
						to: result.eMail +' ,verna@jamesaccounting.com',
						subject: 'James Accounting Appointment Cancelled',
						text: 'Your appointment with James Accounting for ' + dateToEdit[0].split('2')[0] + ' '+ getOrdinal(dateToEdit[1]) + ' ' + 'at' + ' ' + convertTimeString(dateToEdit[2]+ ' has been cancelled') 
					}, function(error, info) {
						if(error) {
							console.log(error)
						} else {
							console.log(info)
						}
					});
					nexmo.message.sendSms(15186460734, '1' + phoneNumber , 'Your appointment with James Accounting for ' + dateToEdit[0].split('2')[0] + ' '+ getOrdinal(dateToEdit[1]) + ' ' + 'at' + ' ' + convertTimeString(dateToEdit[2])+ ' has been cancelled', function(err, responseData) {
						if(err) {
							console.log(err);
						} else {
							console.log('1' + phoneNumber + ': Sent cancellation notice');
						}
					})	
					res.send('Cancelled')
				})
			
			}
		})
	}
});


router.use('/', express.static(path.join(__dirname, 'App')));
router.use('/admin', express.static(path.join(__dirname, 'Admin')));
router.use('/login', express.static(path.join(__dirname, 'Login')));

// router.get('/', function(req, res, next) {

// })

// router.get('/admin', function(req, res, next) {

// })

//use router for paths
app.use('/', router);

//path.join(__dirname, 'App')

app.listen(port, function() {
	console.log('Server Initialized at localhost: ' + port);

})

//console.log(thisMonth, nextMonth)




// var http = require('http');
// var fs = require('fs');

// var hostname = 'localhost';

// var port = 4777;

// var server = http.createServer(function(req, res) {
//   fs.readFile('client.HTML', function(err, data) {
// 	res.writeHead(200, {'Content-Type': 'text/html'})
// 	res.write(data);
// 	res.end();
// }) 
// });

// server.listen(port, hostname, function() {
// 	console.log('Sever Initialized at ' + hostname +':'+ port);
// })

