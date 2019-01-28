var calendarData = {
	currentMonthSwitch: true, //  displays data for current month if true and for next month if false
	monthsInYear: ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October', 'November', 'December'],
	daysInAMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // index matched to monthsInYear array
	daysArray: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	date: 'Comes From Server',
	calculateNextMonth: function() {
		if(calendarData.date.getMonth() === 11) {
			var year = calendarData.date.getFullYear();
			} else {
			var year = calendarData.date.getFullYear();
			};
		var month = calendarData.date.getMonth()+1;
		var day = 1
		calendarData.nextMonthDate = new Date(year, month, day);
	},
	nextMonthDate: 'Dynamically set by preceding method',
	displayMonth: function() {
		var monthIndex = this.date.getMonth();
		return this.monthsInYear[monthIndex];
	},
	startDayIndex: function() {
		var year = this.date.getFullYear();
		var month = this.date.getMonth();
		var startDate = new Date(year, month, 1);
		return startDate.getDay();
	},
	lastDayIndex: function() {
		var monthIndex = this.date.getMonth();
		return this.daysInAMonth[monthIndex];
	},
	todayIndex: function() {
		var todaysDate = this.date.toLocaleDateString(); //converts date to mon/day/year format
		monDayYrArray = todaysDate.split('/') // splits mon/day/year into an array
		return todayIndex = parseInt(monDayYrArray[1])
	},
	displayNextMonth: function() {
		var monthIndex = this.nextMonthDate.getMonth();
		return this.monthsInYear[monthIndex];
	},
	nextStartDayIndex: function() {
		var year = this.nextMonthDate.getFullYear();
		var month = this.nextMonthDate.getMonth();
		var startDate = new Date(year, month, 1);
		return startDate.getDay();
	},
	nextLastDayIndex: function() {
		var monthIndex = this.nextMonthDate.getMonth();
		return this.daysInAMonth[monthIndex];
	},
	getOrdinal: function(day) {
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
	},
	selectedDate: document.getElementById('selectedDate'), //Html elements to display selected date dynamically
	cellArray: [],
	nextCellArray: []
};

function serverData() {
		return new Promise(function(resolve,reject) { 	
			var request = new XMLHttpRequest();
			request.open('POST', '/admin');
			
			request.onload = function() {
				response = request.response;
				console.log(response);
				response = JSON.parse(response)
				calendarData.serverDate = response;
				calendarData.date = new Date(calendarData.serverDate)
				resolve(response)
				console.log(calendarData.serverDate);
			}
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send('sendDate');
		})
}

function colorCodeAvailability(array) {
	//Adds color to calendar cells that have available dates called in getSchedules 
	array.forEach(function(day, i) {
		if(day.length === 0) {

		} else {
			if(calendarData.currentMonthSwitch === true) {
				//color code current month
				if(i+1 >= calendarData.date.getDate() ) {
				calendarData.cellArray[i].classList.add('availableDate');
				}
			} else {
				//color code next month
				calendarData.nextCellArray[i].classList.add('availableDate');
			}
		}
	})
}

function getSchedules(select) {
		(function reqFn() {
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open('POST', '/');
			
				request.onload = function() {
					var resp
		  			resp = request.response;
		  			resp = JSON.parse(resp)
		  			console.log(resp);
		  			appointmentData[resp._id] = resp.scheduleArray
		  			resolve(resp)
		  			if(calendarData.currentMonthSwitch ===  true) {
		  				calendarData.cellArray[todayIndex-1].click();
		  				//colorCodeAvailability(appointmentData[appointmentData.thisMonthRef]);
		  			} else {
		  				calendarData.nextCellArray[0].click();
		  				//colorCodeAvailability(appointmentData[appointmentData.nextMonthRef]);
		  			}
		  		};	
		  		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		  		request.send('sendScheduleData|'+select);
			})
		})();
}

function validateFormData() {
	var form = document.getElementById('clientData');
	var formData = {
		_id: form.phoneNumber.value,
		firstName: form.firstName.value.trim(),
		lastName: form.lastName.value.trim(),
		eMail: form.eMail.value,
		date: clientInterface.selectedDate
	}
	if(formData.eMail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) !== null && formData._id.match(/^(1?(-?\d{3})-?)?(\d{3})(-?\d{4})$/) !== null && formData.date.constructor === Array && formData.firstName.trim() !== '' && formData.lastName.trim() !== '') {
		sendFormData(formData);	
	} else {
		var enterFirst = 'Please enter your first name in the appropriate field \n'
		var enterLast = 'Please enter your last name in the appropriate field \n'
		var invalidEmail = 'Enter your e-mail address in the correct format  \n'
		var invalidNumber = 'Enter the your phone number in one of the following formats XXX-XXX-XXXX and XXXXXXXXXX \n'
		var selectDate = 'Select a date for your appoinment \n'
		var errorMessage = 'In order to schedule an appointment \n' 
		if(formData.firstName.trim() === '') {
			errorMessage = errorMessage + enterFirst
		}
		if(formData.lastName.trim() === '') {
			errorMessage = errorMessage + enterLast
		}
		if(formData.eMail.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) === null) {
			errorMessage = errorMessage + invalidEmail
		}
		if(formData._id.match(/^(1?(-?\d{3})-?)?(\d{3})(-?\d{4})$/) === null) {
			errorMessage = errorMessage + invalidNumber
		}
		if(formData.date.constructor !== Array) {
			errorMessage = errorMessage + selectDate
		}
		alert(errorMessage);
	}
	
	//else promt corrections
}

function cancelAppointment() {
	if(validCaptcha() === true) {
		var phoneNumber = prompt('Enter the phone number that was used to schedule the appointment');
		(function reqFn() {
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open('POST', '/')

				request.onload = function() {
					var resp = request.response;
					resolve(resp);
					if(resp === 'No Appointment') {
						alert('There is no appointment scheduled in association with this phone number')					
					}
					if(resp === 'Cancelled') {
						alert('Your appointment has been cancelled');
						reload();
					}
				}
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send('cancelAppointment|'+JSON.stringify(phoneNumber));
			})
		})();
	} else {
		alert('Please Enter CAPTCHA code');
	}
}

function sendFormData(data) {
	if(validCaptcha() === true) {
		(function reqFn() {
			return new Promise(function(resolve, reject) {
				console.log(data);
				var request = new XMLHttpRequest();
				request.open('POST', '/');

				request.onload = function() {
					var resp = request.response;
					console.log('This is the response', resp)
			  			
					if(resp.includes('Client Data Saved') ) {
						console.log(resp);
						resolve(resp)
						console.log('success!')
						var confirm = resp.split('|')[1].split(',')
						alert('Your appointment for ' + ' ' + confirm[0].split('2')[0] + ' '+calendarData.getOrdinal(confirm[1]) + ' ' + 'at' + ' ' + clientInterface.convertTimeString(confirm[2]) + ' has been scheduled');
						reload();
					} else {
						resp = JSON.parse(resp)
						console.log(resp);
						resolve(resp)
						console.log('duplicate')
						alert('An appoinment was already scheduled with this phone number for ' + ' ' + resp[0].split('2')[0] + ' '+calendarData.getOrdinal(resp[1]) + ' ' + 'at' + ' ' + clientInterface.convertTimeString(resp[2]))
					}
				}
				request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				request.send('processClientData|'+JSON.stringify(data));
			})
		})();
	} else {
		alert('Please Enter CAPTCHA code')
	}
};

var appointmentData = {
	setCurrentMonth: function() {
		var year = calendarData.date.getFullYear();
		var monthIndex = calendarData.date.getMonth();
		var totalDays = calendarData.daysInAMonth[monthIndex]
		month = calendarData.monthsInYear[monthIndex] //converts month idex to corresponding string
		appointmentData[month+year] = [];
		appointmentData.thisMonthRef = month+year;
	},
	setNextMonth: function() {
		var year = calendarData.nextMonthDate.getFullYear();
		var monthIndex = calendarData.nextMonthDate.getMonth();
		var totalDays = calendarData.daysInAMonth[monthIndex]
		month = calendarData.monthsInYear[monthIndex] //converts month idex to corresponding string
		appointmentData[month+year] = [];
		appointmentData.nextMonthRef = month+year;
	},
	groupCellsByWeek: [],
	groupCellsByDay: function() {}
};

function generateCalendar() {
	calendarData.calculateNextMonth();
	// variables for the HTML elements used to construct calendar
	if(document.getElementById('calendarUL') === null) { //create calendarUL if it doesn't exist 
		var calendarUL = document.createElement('ul');
		calendarUL.id = 'calendarUL';
		document.body.appendChild(calendarUL);
	} else {
		var calendarUL = document.getElementById('calendarUL'); //if calendarUL already exists
	};
	calendarUL.innerHTML = ''; // clears CalendarUL
	calendarData.cellArray = [] // clears cell data storage for current months
	var calendarTbl = document.createElement('table');
	calendarTbl.className = 'calendarTable';
	var calendarStructure = document.createElement('tbody');
	calendarStructure.id = 'thisMonth';

	// variables to dynamically fill display information on calendar for current month
	var daysArray = calendarData.daysArray;
	var startDayIndex = calendarData.startDayIndex();
	var lastDayIndex = calendarData.lastDayIndex();
	var cellDate = 1
	var todayIndex = calendarData.todayIndex();
	var monthIndex = calendarData.date.getMonth();
	var daysInThisMonth = calendarData.daysInAMonth[monthIndex];
	if( (daysInThisMonth + startDayIndex) > 35) {
		var totalrows = 7;
	};
	if( (daysInThisMonth + startDayIndex) <= 35) {
		var totalrows = 6;
	};
	if( (daysInThisMonth + startDayIndex) <= 28) {
		var totalrows = 5;
	};
		
	for(var i = 0; i < totalrows; i++) { // loop to create table rows // !!dynamically set based on month
		var row = document.createElement('tr')

		for(var j = 0; j < 7; j++) { // loop to create table cells
			if(i === 0) { 
				var cell = document.createElement('th'); // makes row 0 cells table headers
				var dayText = document.createTextNode(daysArray[j]); // sets text values in row 0 to days of the week 
				cell.appendChild(dayText);
				row.appendChild(cell);
			} else if(i === 1) { // 
				var cell = document.createElement('td');
				if(j >= startDayIndex) {
					var cellText = document.createTextNode(cellDate); //creates textNode and sets it to cell date
					cell.id = cellDate; //creates an id === cellDate, for the cell being created,
					calendarData.cellArray.push(cell);	
					if(cellDate === todayIndex) { // checks if the cell represents today
							cell.className = 'selected'
							calendarData.selectedDate.textContent = calendarData.monthsInYear[calendarData.date.getMonth()] + '  ' + calendarData.getOrdinal(todayIndex) + '  '+  calendarData.date.getFullYear();
					};
					if(cellDate < todayIndex) { // greys out cell if date is past
							cell.className = 'pastDate'
					};
					cell.appendChild(cellText);
					row.appendChild(cell)
					cellDate++; //increments cellDate so following cell is the next days number
				} else {
					var cellText = document.createTextNode('');
					cell.appendChild(cellText);
					cell.className = 'noDate'; // greys out previous month cells
					row.appendChild(cell);
				}
			} else {
				var cell = document.createElement('td');
				if(cellDate <= lastDayIndex) {
					var cellText = document.createTextNode(cellDate);
					cell.id = cellDate;
					calendarData.cellArray.push(cell);	
					if(cellDate === todayIndex) { // checks if the cell represents today
							cell.className = 'selected'
					};
					if(cellDate < todayIndex) { // greys out cell if date is past
							cell.className = 'pastDate'
					};
					cell.appendChild(cellText);
					row.appendChild(cell);
					cellDate++;
				} else {
					var cellText = document.createTextNode(' ');
					cell.appendChild(cellText);
					cell.className = 'noDate' // greys out next month cells
					row.appendChild(cell)
				}
			}
		}
		calendarStructure.appendChild(row);
	}
	calendarTbl.appendChild(calendarStructure); 
	calendarUL.appendChild(calendarTbl);
	var calendarCaption = calendarTbl.createCaption();
	calendarCaption.innerHTML = calendarData.displayMonth() + ' ' + calendarData.date.getFullYear();
	calendarData.currentMonthSwitch = true;
	appointmentData.setCurrentMonth();
	getSchedules(appointmentData.thisMonthRef);
};

function generateNextMonth() {
	
	calendarData.calculateNextMonth();
	// variables for the HTML elements used to construct calendar
	if(document.getElementById('calendarUL') === null) { //create calendarUL if it doesn't exist 
		var calendarUL = document.createElement('ul');
		calendarUL.id = 'calendarUL';
		document.body.appendChild(calendarUL);
	} else {
		var calendarUL = document.getElementById('calendarUL'); //if calendarUL already exists
	};
	calendarUL.innerHTML = ''; // clears CalendarUL
	calendarData.nextCellArray = []; //clears the cell data storage for next month
	var calendarTbl = document.createElement('table');
	calendarTbl.className = 'calendarTable';
	var calendarStructure = document.createElement('tbody');
	calendarStructure.id = 'nextMonth';

	// variables to dynamically fill display information on calendar for current month
	var daysArray = calendarData.daysArray;
	var startDayIndex = calendarData.nextStartDayIndex();
	var lastDayIndex = calendarData.nextLastDayIndex();
	var cellDate = 1;
	var monthIndex = calendarData.nextMonthDate.getMonth();
	var daysInThisMonth = calendarData.daysInAMonth[monthIndex];
	if( (daysInThisMonth + startDayIndex) > 35) {
		var totalrows = 7;
	};
	if( (daysInThisMonth + startDayIndex) <= 35 && (daysInThisMonth + startDayIndex) > 28) {
		var totalrows = 6;
	};
	if( (daysInThisMonth + startDayIndex) <= 28) {
		var totalrows = 5;
	};
			
	for(var i = 0; i < totalrows; i++) { // loop to create table rows // !!dynamically set based on month
		var row = document.createElement('tr')

		for(var j = 0; j < 7; j++) { // loop to create table cells
			if(i === 0) { 
				var cell = document.createElement('th'); // makes row 0 cells table headers
				var dayText = document.createTextNode(daysArray[j]); // sets text values in row 0 to days of the week 
				cell.appendChild(dayText);
				row.appendChild(cell);
			} else if(i === 1) { // 
				var cell = document.createElement('td');
				if(j >= startDayIndex) {
					var cellText = document.createTextNode(cellDate); //creates textNode and sets it to cell date
					cell.id = cellDate; //creates an id === cellDate, for the cell being created,
					calendarData.nextCellArray.push(cell);	
						if(cellDate === 1) { // checks if the cell represents today
							cell.className = 'selected'
							calendarData.selectedDate.textContent = calendarData.monthsInYear[calendarData.nextMonthDate.getMonth()] + '  ' + calendarData.getOrdinal(cellDate) + '  '+  calendarData.nextMonthDate.getFullYear();
						};
					cell.appendChild(cellText);
					row.appendChild(cell)
					cellDate++; //increments cellDate so following cell is the next days number
				} else {
					var cellText = document.createTextNode('');
					cell.appendChild(cellText);
					cell.className = 'noDate'; // greys out previous month cells
					row.appendChild(cell);
				}
			} else {
				var cell = document.createElement('td');
				if(cellDate <= lastDayIndex) {
					var cellText = document.createTextNode(cellDate);
					cell.id = cellDate;
					calendarData.nextCellArray.push(cell);	
					cell.appendChild(cellText);
					row.appendChild(cell)
					cellDate++;
				} else {
					var cellText = document.createTextNode(' ');
					cell.appendChild(cellText);
					cell.className = 'noDate' // greys out next month cells
					row.appendChild(cell)
				}
			}
		}
		calendarStructure.appendChild(row);
	}
	calendarTbl.appendChild(calendarStructure); 
	calendarUL.appendChild(calendarTbl);
	var calendarCaption = calendarTbl.createCaption();
	calendarCaption.innerHTML = calendarData.displayNextMonth() + ' ' + calendarData.nextMonthDate.getFullYear();
	calendarData.currentMonthSwitch = false;
	appointmentData.setNextMonth();
	getSchedules(appointmentData.nextMonthRef);
};


serverData().then(generateCalendar);

var clientInterface = {
	calendarCells: document.getElementById('calendarUL'),
	toggleMonth: document.getElementById('toggleMonth'),
	timeDisplay: document.getElementById('timeDisplay'),
	convertTimeString: function(time) {
		if(time.includes('!') === false) {
			var timeSplit = time.split(':');
			var format = new Date(0, 0, 0, timeSplit[0], timeSplit[1]);
			format = format.toLocaleTimeString();
			format = format.split(':');
			ampm = (function() {
				ampm = format[2].split(' ')
				return ' ' +ampm[1]
			})();
			formattedString = format[0].concat(':' + format[1] + ampm)
			return formattedString;
		// } else {
		// 	var stringSplit = time.split('!');
		// 	var timeSplit = stringSplit[0].split(':');
		// 	var format = new Date(0, 0, 0, timeSplit[0], timeSplit[1]);
		// 	format = format.toLocaleTimeString();
		// 	format = format.split(':');
		// 	ampm = (function() {
		// 		ampm = format[2].split(' ')
		// 		return ' ' +ampm[1]
		// 	})();
		// 	formattedString = format[0].concat(':' + format[1] + ampm)
		// 	return formattedString + ' ' + stringSplit[1]; 
		}	
	},
	revertTimeString: function revertTimeString(string) {
		var ampm = string.split(' ')[1];
		var hour = string.split(':')[0];
		if(hour.length < 2) {
			hour = '0'+ hour
		}
		var min = string.split(' ')[0].split(':')[1];
		var revertedStringArray = [hour, min]
		var revertedString
		if(ampm === 'PM' && hour !== '12') {
			revertedStringArray[0] = parseInt(revertedStringArray[0]) + 12;
			revertedString = revertedStringArray.join(':')
			return revertedString
		}
		if(ampm === 'PM' && hour === '12') {
			revertedStringArray[0] = parseInt(revertedStringArray[0]);
			revertedString = revertedStringArray.join(':')
			return revertedString
		}
		if(ampm === 'AM' && revertedStringArray[0] !== '12') {
			revertedString = revertedStringArray.join(':');
			return revertedString;
		}

		if(ampm === 'AM' && revertedStringArray[0] === '12') {
			revertedStringArray[0] = '00';
			revertedString = revertedStringArray.join(':')
			return revertedString;
		}
},
	selectedDateArray: [],
	selectedCell: 'Filled with date from currently selected cell',
	selectedDate: 'Filled With A Time Selection',  
}

clientInterface.toggleMonth.addEventListener('click', function() {
	if(calendarData.currentMonthSwitch === true) {
		clientInterface.toggleMonth.textContent = 'Current Month';
		generateNextMonth();
	} else {
		clientInterface.toggleMonth.textContent = 'next Month';
		generateCalendar();
	};	
})

clientInterface.calendarCells.addEventListener('click', function(event) {
	var monthIndex = calendarData.date.getMonth();
	var year = calendarData.date.getFullYear();
	var day = calendarData.getOrdinal(event.target.id); // add st, nd, or rd dynamically based on date
	var month = calendarData.monthsInYear[monthIndex]
	

	var nextMonthIndex = calendarData.nextMonthDate.getMonth();
	var nextMonthYear = calendarData.nextMonthDate.getFullYear();
	var nextMonthDay = calendarData.getOrdinal(event.target.id);
	var nextMonth = calendarData.monthsInYear[nextMonthIndex];

	var dayIndex = event.target.id - 1 
	var timeDisplay = document.getElementById('timeReadOut')

	clientInterface.selectedDate = 'Resets value when date is switched'

	if( calendarData.cellArray.includes(event.target) && event.target.className !== 'pastDate' || calendarData.nextCellArray.includes(event.target) && event.target.className !== 'pastDate'  ) { //triggers only if you click on a cell and its not a past date
		calendarData.cellArray.forEach(function(cell, i) {
			cell.classList.remove("selected");

		})
		calendarData.nextCellArray.forEach(function(cell) {
			cell.classList.remove("selected");
		})
		if(calendarData.currentMonthSwitch === true) {
			colorCodeAvailability(appointmentData[appointmentData.thisMonthRef]); 
		} else {
			colorCodeAvailability(appointmentData[appointmentData.nextMonthRef]);
		}
		
		event.target.className = 'selected';
		clientInterface.selectedCell = event.target.id
		if(calendarData.currentMonthSwitch === true) {
			timeDisplay = document.getElementById('timeDisplay')
			calendarData.selectedDate.textContent = month +' '+ day +' '+ year;
			timeDisplay.innerHTML = '';
			clientInterface.selectedDateArray = [];
			appointmentData[month+year][dayIndex].forEach(function(element, i) {
				var availableTime = document.createElement('li');
				availableTime.textContent = clientInterface.convertTimeString(element);
				availableTime.className = 'availableTime';
				availableTime.id = i;
				timeDisplay.appendChild(availableTime);
				clientInterface.selectedDateArray.push(availableTime);
			})
		}
		if(calendarData.currentMonthSwitch === false) {
			calendarData.selectedDate.textContent =  nextMonth +' '+ nextMonthDay +' '+ nextMonthYear;
			timeDisplay = document.getElementById('timeDisplay')
			timeDisplay.innerHTML = '';
			clientInterface.selectedDateArray = [];
			appointmentData[nextMonth+nextMonthYear][dayIndex].forEach(function(element, i) {
				var availableTime = document.createElement('li');
				availableTime.textContent = clientInterface.convertTimeString(element);
				availableTime.className = 'availableTime';
				availableTime.id = i;
				timeDisplay.appendChild(availableTime);
				clientInterface.selectedDateArray.push(availableTime);
			})
		}
	} 
});

clientInterface.timeDisplay.addEventListener('click', function(event) {
	if(event.target.className === 'availableTime') {
		var selectId = event.target.id
		var selectedTime = event.target.textContent
		clientInterface.selectedDateArray.forEach(function(element) {
			element.classList.remove('selected');
		})
		clientInterface.selectedDateArray[selectId].classList.add('selected')
		if(calendarData.currentMonthSwitch === true) {
			clientInterface.selectedDate = [appointmentData.thisMonthRef, clientInterface.selectedCell, clientInterface.revertTimeString(selectedTime)]
		} else {
			clientInterface.selectedDate = [appointmentData.nextMonthRef, clientInterface.selectedCell, clientInterface.revertTimeString(selectedTime)]
		}
	}
})

function loadLogin() {
	window.location.href = '/login'
}

function reload() {
	window.location.href = '/'
}



//tests calendar out put
var chkDate = new Date();
function testThrough2019(chkDate) {
	
	if(chkDate.getFullYear() === 2021) {
		console.log('test complete');
		return;
	}

	calendarData.date = chkDate
	setTimeout(function() {
		generateCalendar();
	}, 2000)
	setTimeout(function() {
		generateNextMonth();
	}, 2000)
	
	var year = chkDate.getFullYear();
	var month = chkDate.getMonth()+1;
	var day = 1
	newChkDate = new Date(year, month, day);
	setTimeout(function() {
		testThrough2019(newChkDate);
	}, 2000)

}


// Captcha Script

function checkform(theform) {
	var why = "";

	if(theform.CaptchaInput.value == "") {
		why += "- Please Enter CAPTCHA Code.\n";
	}
	if(theform.CaptchaInput.value != "") {
		if(ValidCaptcha(theform.CaptchaInput.value) == false) {
			why += "- The CAPTCHA Code Does Not Match.\n";
		}
	}
	if(why != "") {
		alert(why);
		return false;
	}
}

var a = Math.ceil(Math.random() * 9)+ '';
var b = Math.ceil(Math.random() * 9)+ '';
var c = Math.ceil(Math.random() * 9)+ '';
var d = Math.ceil(Math.random() * 9)+ '';
var e = Math.ceil(Math.random() * 9)+ '';

var code = a + b + c + d + e;
document.getElementById("txtCaptcha").value = code;
document.getElementById("CaptchaDiv").innerHTML = code;

// Validate input against the generated number
function validCaptcha() {
	var str1 = removeSpaces(document.getElementById('txtCaptcha').value);
	var str2 = removeSpaces(document.getElementById('CaptchaInput').value);
	if (str1 == str2) {
		return true;
	} else {
	return false;
	}
}

// Remove the spaces from the entered and generated code
function removeSpaces(string){
return string.split(' ').join('');
}

 // function loadAdmin() {
 // 	if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
 //    	console.log('XMLH')
 //    	httpRequest = new XMLHttpRequest();
	// } else if (window.ActiveXObject) { // IE 6 and older
	// 	console.log('ActiveXObject')
 //   		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	// }
	// httpRequest.open('GET', 'localhost:4777/admin', true)
 // }
