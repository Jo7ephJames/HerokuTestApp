//mongoDB & express for sever

var calendarData = {
	currentMonthSwitch: true, //  displays data for current month if true and for next month if false
	monthsInYear: ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October', 'November', 'December'],
	daysInAMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // index matched to monthsInYear array
	daysArray: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	serverDate: '',
	//date: new Date(), date property added by function which pull date from server
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
	nextCellArray: [],
	nameOfDayArray: [],
	nextNameOfDayArray: []
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
					calendarData.cellArray[i].classList.add('availableDate');
				} else {
					//color code next month
					calendarData.nextCellArray[i].classList.add('availableDate');
				}
			}
		})
	}
	var resp
	function getSchedules(select) {
		(function reqFn() {
			return new Promise(function(resolve, reject) {
			var request = new XMLHttpRequest();
			request.open('POST', '/admin');
			
			request.onload = function() {
		  		resp = request.response;
		  		resp = JSON.parse(resp)
		  		console.log(resp);
		  		appointmentData[resp._id] = resp.scheduleArray
		  		resolve(resp)
		  		if(calendarData.currentMonthSwitch ===  true) {
		  			calendarData.cellArray[todayIndex-1].click();
					colorCodeAvailability(appointmentData[appointmentData.thisMonthRef]);
		  		} else {
		  			calendarData.nextCellArray[0].click();
					colorCodeAvailability(appointmentData[appointmentData.nextMonthRef]);
		  		}
		  	};	
		  	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		  	request.send('sendScheduleData|'+select);
			})
		})();
	}

	function runUpdateWithConfig(appointment, prompt) {
		if(arguments.length === 0) {
			if(calendarData.currentMonthSwitch === true) {
				select = appointmentData.thisMonthRef;
				updatedData = appointmentData[appointmentData.thisMonthRef];
				updateServer(select, updatedData);
			} else {
				select = appointmentData.nextMonthRef;
				updatedData = appointmentData[appointmentData.nextMonthRef];
				updateServer(select, updatedData);
			}
		} else {
				if(calendarData.currentMonthSwitch === true) {
				select = appointmentData.thisMonthRef;
				updatedData = appointmentData[appointmentData.thisMonthRef];
				updateServer(select, updatedData, appointment, prompt);
					} else {
				select = appointmentData.nextMonthRef;
				updatedData = appointmentData[appointmentData.nextMonthRef];
				updateServer(select, updatedData, appointment, prompt);
			}
		}
	}

	function updateServer(select, updatedData, appointment, prompt) {
		if(arguments.length === 2) {
			(function reqFn() {
				return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open('POST', '/admin');
				
			  	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			  	request.send('updateScheduleData|'+select+'|'+JSON.stringify(updatedData) );
				})
			})()
		} else {
			(function reqFn() {
				return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open('POST', '/admin');
				
			  	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			  	request.send('updateAndCancelScheduleData|'+select+'|'+JSON.stringify(updatedData)+'|'+JSON.stringify(appointment)+'|'+prompt);
				})
			})()
		}
	}




var appointmentData = {
	setCurrentMonth: function() { 
		var year = calendarData.date.getFullYear();
		var monthIndex = calendarData.date.getMonth();
		var totalDays = calendarData.daysInAMonth[monthIndex]
		var month = calendarData.monthsInYear[monthIndex];
		function createDayIndexes() {
			dayObjectsArray = [];
			for(var i = 0; i < totalDays; i++) {
				dayObjectsArray.push([]);
			}
			return dayObjectsArray;
		};
		appointmentData.thisMonthRef = month+year;
		appointmentData[month+year] = createDayIndexes();
		matchIndexToDay[month+year] = {
			dayByIndex: [],
			indexesForDay: {},
			indexesInWeek: {}
		}

	},
	setNextMonth: function() {
		var year = calendarData.nextMonthDate.getFullYear();
		var monthIndex = calendarData.nextMonthDate.getMonth();
		var totalDays = calendarData.daysInAMonth[monthIndex]
		month = calendarData.monthsInYear[monthIndex] //converts month idex to corresponding string
		function createDayIndexes() {
			dayObjectsArray = [];
			for(var i = 0; i < totalDays; i++) {
				dayObjectsArray.push([]);
			}
			return dayObjectsArray;
		};
		appointmentData.nextMonthRef = month+year;
		appointmentData[month+year] = createDayIndexes();
		matchIndexToDay[month+year] = {
			dayByIndex: [],
			indexesForDay: {},
			indexesInWeek: {}
		}	
	},
	timeArraySketch: []
};

matchIndexToDay = {  
	calculateThisMonth: function() {
		var week = [0, 1, 2, 3, 4, 5, 6] // indexes match sunday through monday
		startDayIndex = calendarData.startDayIndex() - 1;
		var lastDayIndex = calendarData.lastDayIndex()
		for(var i = 0; i < week.length; i++) {
			 matchIndexToDay[appointmentData.thisMonthRef].indexesForDay[ calendarData.daysArray[i] ] = [];
			 for(var x = i - startDayIndex; x <= lastDayIndex; (x = x+7)) {
			 	arrayOfMatchedIndexes = matchIndexToDay[appointmentData.thisMonthRef].indexesForDay[ calendarData.daysArray[i] ];
			 	if(x <= 0) {
			 		arrayOfMatchedIndexes.push(null);
				} else {
			 		arrayOfMatchedIndexes.push(x);
			 	}
			}
		}
	},
	calculateNextMonth: function() {
		var week = [0, 1, 2, 3, 4, 5, 6] // indexes match sunday through monday
		startDayIndex = calendarData.nextStartDayIndex() - 1;
		var lastDayIndex = calendarData.nextLastDayIndex()
		for(var i = 0; i < week.length; i++) {
			 matchIndexToDay[appointmentData.nextMonthRef].indexesForDay[ calendarData.daysArray[i] ] = [];
			 for(var x = i - startDayIndex; x <= lastDayIndex; (x = x+7)) {
			 	arrayOfMatchedIndexes = matchIndexToDay[appointmentData.nextMonthRef].indexesForDay[ calendarData.daysArray[i] ];
			 	if(x <= 0) {
			 		arrayOfMatchedIndexes.push(null);
				} else {
			 		arrayOfMatchedIndexes.push(x);
			 	}
			}
		}
	},
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
	calendarStructure.id = 'thisMonth' 

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
		row.id = 'week' + (i);
		
		for(var j = 0; j < 7; j++) { // loop to create table cells
			if(i === 0) { 
				var cell = document.createElement('th'); // makes row 0 cells table headers
				var dayText = document.createTextNode(daysArray[j]); // sets text values in row 0 to days of the week 
				cell.id = (daysArray[j]).toString();
				calendarData.nameOfDayArray.push(cell);
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
	matchIndexToDay.calculateThisMonth();
	getSchedules(appointmentData.thisMonthRef)		
		
	
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
		var row = document.createElement('tr');
		row.id = 'week' + (i);

		for(var j = 0; j < 7; j++) { // loop to create table cells
			if(i === 0) { 
				var cell = document.createElement('th'); // makes row 0 cells table headers
				var dayText = document.createTextNode(daysArray[j]); // sets text values in row 0 to days of the week 
				cell.id = (daysArray[j]).toString(); // sets id of column header to its string ex. cell.id === 'Monday'
				calendarData.nextNameOfDayArray.push(cell); // pushes cell to an array for this month;
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
	matchIndexToDay.calculateNextMonth();
	var todayIndex = 1 //Aka Init index used to set highlighted cell to first of the month
	getSchedules(appointmentData.nextMonthRef);
};

serverData().then(generateCalendar);

var clientInterface = {
	calendarCells: document.getElementById('calendarUL'),
	toggleMonth: document.getElementById('toggleMonth')
}

clientInterface.toggleMonth.addEventListener('click', function() {
	if(calendarData.currentMonthSwitch === true) {
		clientInterface.toggleMonth.textContent = 'this Month';
		generateNextMonth();
	} else {
		clientInterface.toggleMonth.textContent = 'next Month';
		generateCalendar();
	}
})


clientInterface.calendarCells.addEventListener('click', function(event) {
	var setAllButton = document.getElementById('confirmSetAll');
	setAllButton.style.visibility = 'hidden';	

	var monthIndex = calendarData.date.getMonth();
	var year = calendarData.date.getFullYear();
	var day = calendarData.getOrdinal(event.target.id); // add st, nd, or rd dynamically based on date
	var month = calendarData.monthsInYear[monthIndex]
	

	var nextMonthIndex = calendarData.nextMonthDate.getMonth();
	var nextMonthYear = calendarData.nextMonthDate.getFullYear();
	var nextMonthDay = calendarData.getOrdinal(event.target.id);
	var nextMonth = calendarData.monthsInYear[nextMonthIndex]

	var dayIndex = event.target.id - 1 
	var timeDisplay = document.getElementById('timeReadOut')

	if( calendarData.cellArray.includes(event.target) && event.target.className !== 'pastDate' || calendarData.nextCellArray.includes(event.target) && event.target.className !== 'pastDate'  ) { //triggers only if you click on a cell and its not a past date
		scheduleInterface.multiDateSwitch = false;
		calendarData.cellArray.forEach(function(cell) {
			cell.classList.remove("selected");
		}) 
		calendarData.nextCellArray.forEach(function(cell) {
			cell.classList.remove("selected");
		})
		calendarData.nameOfDayArray.forEach(function(cell) {
			cell.classList.remove("selected");
		}) 
		calendarData.nextNameOfDayArray.forEach(function(cell) {
			cell.classList.remove("selected");
		})
		event.target.className = 'selected';
		 

		if(calendarData.currentMonthSwitch === true) { // if current month is disoplayed
			timeDisplay = document.getElementById('timeDisplay')
			calendarData.selectedDate.textContent = 'Appointment Date ' + month +' '+ day +' '+ year;
			scheduleInterface.currentSelection = appointmentData[month+year][dayIndex];
			timeDisplay.innerHTML = '';
			timeInput.value = null
			appointmentData[month+year][dayIndex].forEach(function(element, i) {
				var availableTime = document.createElement('li');
				availableTime.textContent = scheduleInterface.convertTimeString(element);
				availableTime.className = 'availableTime'
				deleteButton = scheduleInterface.createDeleteButton();
				deleteButton.id = i;
				availableTime.appendChild(deleteButton);
				timeDisplay.appendChild(availableTime);
				renderTimes();
			})
		}

		if(calendarData.currentMonthSwitch === false) { // if next month is displayed
			timeDisplay = document.getElementById('timeDisplay')
			calendarData.selectedDate.textContent =  'Appointment Date ' + nextMonth +' '+ nextMonthDay +' '+ nextMonthYear;
			scheduleInterface.currentSelection = appointmentData[nextMonth+nextMonthYear][dayIndex];
			timeDisplay.innerHTML = '';
			timeInput.value = null
			appointmentData[nextMonth+nextMonthYear][dayIndex].forEach(function(element, i) {
				var availableTime = document.createElement('li');
				availableTime.textContent = scheduleInterface.convertTimeString(element);;
				availableTime.className = 'availableTime'
				deleteButton = scheduleInterface.createDeleteButton();
				deleteButton.id = i;
				availableTime.appendChild(deleteButton);
				timeDisplay.appendChild(availableTime);
				renderTimes();
			})
		}
	 } 
	if(calendarData.nameOfDayArray.includes(event.target) || calendarData.nextNameOfDayArray.includes(event.target) ) { // for clicks on column header ex: sunday
		
		scheduleInterface.multiDateArray = [];
		scheduleInterface.multiDateSwitch = true;
		renderTimes();
		

		calendarData.cellArray.forEach(function(cell) {
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
		calendarData.nameOfDayArray.forEach(function(cell) {
			cell.classList.remove("selected");
		}) 
		calendarData.nextNameOfDayArray.forEach(function(cell) {
			cell.classList.remove("selected");
		})
		event.target.className = 'selected';
		calendarData.selectedDate.textContent = 'Every ' + event.target.id + ' in ' + month + ' ' + year;
		if(calendarData.currentMonthSwitch === true) {
			scheduleInterface.currentSelection = event.target.id
			console.log(scheduleInterface.currentSelection);		
		}
		if(calendarData.currentMonthSwitch === false) {
			scheduleInterface.currentSelection = event.target.id
			console.log(scheduleInterface.currentSelection);
		}
	}
});

 


var scheduleSetter = { //times Stored on the month+year reference at appointmentData
	addAvailability: function(timeArray, newTime) {
		if( timeArray.includes(newTime) ) {
			return;
		}
		if(timeArray.length === 0) {
			timeArray.push(newTime);
		} else {
			indexToSplice = null
			for(var i = 0; i < timeArray.length; i++) {
				if(timeArray[i] > newTime) {
					if(indexToSplice === null) {
						indexToSplice = i;
					};
					
				}
			}
			if(indexToSplice === null) {
				timeArray.push(newTime); // convert to object with client slot and display string slot
			} else {
				timeArray.splice(indexToSplice, 0, newTime);
			}
		}

	},
	addAvailabilityToAll: function() {},
	deleteAvailability: function(timeArray, position) {
		timeArray.splice(position, 1);
	},
	noAvailability: function(timeArray) {
		timeArray.splice(0)
	},
	arrayForMultipleDays: [],
}

var scheduleInterface = {
	multiDateSwitch: false, 
	currentSelection: [],
	multiDateArray: [],
	timeInput: document.getElementById('timeInput'),
	addTime: document.getElementById('addTime'),
	timeLabels: document.getElementById('timeLabels'),
	timeDisplay: document.getElementById('timeDisplay'),
	timeDisplayOptions: document.getElementById('timeDisplayOptions'),
	setAllButton: document.getElementById('confirmSetAll'),
	createTimeLi: function() {
		var li = document.createElement('li');
		return li;
	},
	createDeleteButton: function() {
		var deleteButton = document.createElement('button');
		deleteButton.className = 'deleteByX';
		deleteButton.textContent = 'X';
		return deleteButton;
	},
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
		} else {
			var stringSplit = time.split('!');
			var timeSplit = stringSplit[0].split(':');
			var format = new Date(0, 0, 0, timeSplit[0], timeSplit[1]);
			format = format.toLocaleTimeString();
			format = format.split(':');
			ampm = (function() {
				ampm = format[2].split(' ')
				return ' ' +ampm[1]
			})();
			formattedString = format[0].concat(':' + format[1] + ampm)
			return formattedString + ' ' + stringSplit[1]; 
		}
	}
}

//Events
scheduleInterface.addTime.addEventListener('click', function(event) {
	if(scheduleInterface.timeInput.value !== '' && scheduleInterface.multiDateSwitch === false) {
		scheduleSetter.addAvailability(scheduleInterface.currentSelection, scheduleInterface.timeInput.value);
		runUpdateWithConfig();
		renderTimes();
	}
	if(scheduleInterface.timeInput.value !== '' && scheduleInterface.multiDateSwitch === true) {
		scheduleSetter.addAvailability(scheduleInterface.multiDateArray, scheduleInterface.timeInput.value);
		runUpdateWithConfig();
		renderTimes();
	}

}) 

scheduleInterface.timeDisplay.addEventListener('click', function(event) {
	if(scheduleInterface.multiDateSwitch === false) {
		if(event.target.className === 'deleteByX') {
			if (scheduleInterface.currentSelection[event.target.id].includes('!') ) {
				var month = calendarData.currentMonthSwitch ? appointmentData.thisMonthRef : appointmentData.nextMonthRef;
				var day 
				if(calendarData.currentMonthSwitch === true) {
					calendarData.cellArray.forEach(function(cell) {
						if(cell.className === 'selected') {
							day = cell.id
						}
					})
				} else {
					calendarData.nextCellArray.forEach(function(cell) {
						if(cell.className === 'selected') {
							day = cell.id
						}
					})
				}
				var time = scheduleInterface.currentSelection[event.target.id].split('!')[0]	
				var appointment = [month, day, time];
				console.log(appointment)
				var cancelAppointment = prompt('An appointment is scheduled for this time.  Type a reason for the cancellation and click OK to cancel, or click cancel to keep the appointment');
				if(cancelAppointment === null) {
					return;
				} else {
					scheduleSetter.deleteAvailability(scheduleInterface.currentSelection, event.target.id);
					renderTimes();
					runUpdateWithConfig(appointment, cancelAppointment);
				} 
			} else {
				scheduleSetter.deleteAvailability(scheduleInterface.currentSelection, event.target.id);
				renderTimes();
				runUpdateWithConfig();
			}
		}
	}
	if(scheduleInterface.multiDateSwitch === true) {
		if(event.target.className === 'deleteByX') {
			scheduleSetter.deleteAvailability(scheduleInterface.multiDateArray, event.target.id);
			renderTimes();
			runUpdateWithConfig();
		}
	}

})

scheduleInterface.setAllButton.addEventListener('click', function(event) {
	var setAllButton = document.getElementById('confirmSetAll');
	setAllButton.style.visibility = 'hidden';
	renderTimes();

	if(calendarData.currentMonthSwitch === true) {
		if(scheduleInterface.multiDateSwitch === true) {
			var dayIdArray = matchIndexToDay[appointmentData.thisMonthRef].indexesForDay[scheduleInterface.currentSelection];
			console.log(dayIdArray);
			dayIdArray = dayIdArray.filter(function(element) { //removes null place holder
				return element !== null;
			})
			dayIdArray.forEach(function(dayId, i) {
				
				if(calendarData.cellArray[dayId - 1].className === 'pastDate') {
					dayIdArray.splice(i, 1);
				}
				console.log(dayIdArray);
			})
			dateArray = []
			for(var i = 0; i < dayIdArray.length; i++) {
				dateArray.push(appointmentData[appointmentData.thisMonthRef][dayIdArray[i] - 1])
			}
			for(var i = 0; i < dateArray.length; i++) {
				for(var j = 0; j < scheduleInterface.multiDateArray.length; j++) {
					scheduleSetter.addAvailability(dateArray[i], scheduleInterface.multiDateArray[j]);
				}
			}
			timeDisplay.innerHTML = 'Every ' + scheduleInterface.currentSelection + ' has been set to specified schedule';
			runUpdateWithConfig(); 
		}
	} else {
		if(scheduleInterface.multiDateSwitch === true) {
			var dayIdArray = matchIndexToDay[appointmentData.nextMonthRef].indexesForDay[scheduleInterface.currentSelection];
			console.log(dayIdArray);
			dayIdArray = dayIdArray.filter(function(element) { // removes null place holder
				return element !== null;
			})
			dayIdArray.forEach(function(dayId, i) {
				
				if(calendarData.nextCellArray[dayId - 1].className === 'pastDate') {
					dayIdArray.splice(i, 1);
				}
				console.log(dayIdArray);
			})
			dateArray = []
			for(var i = 0; i < dayIdArray.length; i++) {
				dateArray.push(appointmentData[appointmentData.nextMonthRef][dayIdArray[i] - 1])
			}
			for(var i = 0; i < dateArray.length; i++) {
				for(var j = 0; j < scheduleInterface.multiDateArray.length; j++) {
					scheduleSetter.addAvailability(dateArray[i], scheduleInterface.multiDateArray[j]);
				}
			}
			timeDisplay.innerHTML = 'Every ' + scheduleInterface.currentSelection + ' has been set to specified schedule'; 
			runUpdateWithConfig();
		}
	}
})



//renders for clicks
function renderTimes() {
	//
	if(scheduleInterface.multiDateSwitch === false) {
		if(calendarData.currentMonthSwitch === true) {
			timeDisplay.innerHTML = '';
			timeInput.value = null
			scheduleInterface.currentSelection.forEach(function(element, i) {
				var availableTime = document.createElement('li');
				availableTime.textContent = scheduleInterface.convertTimeString(element);;
				availableTime.className = 'availableTime';
				deleteButton = scheduleInterface.createDeleteButton();
				deleteButton.id = i;
				availableTime.appendChild(deleteButton);
				timeDisplay.appendChild(availableTime);
			})
		} else {
			timeDisplay.innerHTML = '';
			timeInput.value = null
			scheduleInterface.currentSelection.forEach(function(element, i) {
				var availableTime = document.createElement('li');
				availableTime.textContent = scheduleInterface.convertTimeString(element);;
				availableTime.className = 'availableTime';
				deleteButton = scheduleInterface.createDeleteButton();
				deleteButton.id = i;
				availableTime.appendChild(deleteButton);
				timeDisplay.appendChild(availableTime);
			})
		}
	}
	if(scheduleInterface.multiDateSwitch === true) {
		var setAllButton = document.getElementById('confirmSetAll');
		scheduleInterface.multiDateArray.length > 0 ?  setAllButton.style.visibility = 'visible' : setAllButton.style.visibility = 'hidden'
		if(calendarData.currentMonthSwitch === true) {
			timeDisplay.innerHTML = '';
			timeInput.value = null
			scheduleInterface.multiDateArray.forEach(function(element, i) {
				var availableTime = document.createElement('li');
				availableTime.textContent = scheduleInterface.convertTimeString(element);;
				availableTime.className = 'availableTime';
				deleteButton = scheduleInterface.createDeleteButton();
				deleteButton.id = i;
				availableTime.appendChild(deleteButton);
				timeDisplay.appendChild(availableTime);
			})
		} else {
			timeDisplay.innerHTML = '';
			timeInput.value = null;
			scheduleInterface.multiDateArray.forEach(function(element, i) {
				var availableTime = document.createElement('li');
				availableTime.textContent = scheduleInterface.convertTimeString(element);;
				availableTime.className = 'availableTime';
				deleteButton = scheduleInterface.createDeleteButton();
				deleteButton.id = i;
				availableTime.appendChild(deleteButton);
				timeDisplay.appendChild(availableTime);
			})
		}
	}
}

function loadMain() {
	window.location.href = '/'
}

function logout() {
	window.location.href = '/logout'
}
