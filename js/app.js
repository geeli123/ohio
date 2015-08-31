var app = angular.module('hack', ['duScroll']);

var views = {
	faq : 'repeat/faq.html',
	events : 'views/events.html',
	sponsors : 'views/sponsors.html',
	judges : 'viewsjudges.html'
};


(function() {
	var nav = document.getElementById('nav');
	var mb = document.getElementById('mb');
	mb.onclick = function() {
		if (nav.className == "open") {
			nav.className	 = "";
		} else {
			nav.className = "open"
		}
	}
})();

var gReader = function($q) {

	var urls = {
		faq: 'https://docs.google.com/spreadsheets/d/1QDJP4So8Tz8z1DF9YtOuSq78OyQ6qAw5A9PB3MWZUqY/edit#gid=0',
		judges: 'https://docs.google.com/spreadsheets/d/13KQCh_nSdkj0yTnQMDa9SvwVjmMJgPgUz-vLxcHY4-o/edit#gid=0',
		sponsors: 'https://docs.google.com/spreadsheets/d/1jOI_cv9HSmby8pUB5tnu0J_mX684enJ0j0kN16vz6lg/edit#gid=0',
		events: 'https://docs.google.com/spreadsheets/d/1GHVNdyb1WzbasZSJzmo1q7LHEVGM0VnMSXTLeQhr-RA/edit#gid=0'
	};

	var res = {};

	res.faq = function() {
		
		return $q(function(resolve, reject) {
			
			sheetrock({
				url: urls.faq,
				query: 'SELECT A, B',
				
				callback: function(error, options, response) {

					if (!error) {
						var rows = response.rows;
						var QUESTION = 0, ANSWER = 1, faqs = []; 
						
						for (var i = 1; i < rows.length; i++) {
							
							faqs.push({
								question: rows[i].cellsArray[QUESTION],
								answer: rows[i].cellsArray[ANSWER],
							});

							resolve(faqs);
						}
					} else {
						reject(error);
					}
				}
			});
		});
	}

	res.events = function() {

		return $q(function(resolve, reject) {

			sheetrock({
				url: urls.events,
				query: 'SELECT A,B,C,D, E',
				callback: function(error, options, response) {
					if (!error) {
						var rows = response.rows;
						var DATE = 0, NAME = 1, HOST = 2, HOST_URL=3, DESC = 4;
						var events = [];

						for (var i = 1; i < rows.length; i++) {
							events.push({
								date: rows[i].cellsArray[DATE],
								name: rows[i].cellsArray[NAME],
								host: rows[i].cellsArray[HOST],
								hostUrl: rows[i].cellsArray[HOST_URL],
								desc: rows[i].cellsArray[DESC]
							});
						}

						resolve(events);

					} else {
						reject(error);
					}
				}
			});
		});
	}

	res.sponsors = function() {
		return $q(function(resolve, reject) {
			sheetrock({
				url: urls.sponsors,
				query: 'SELECT A,B,C',
				callback: function(error, options, response) {
					if (!error) {
						var rows = response.rows;
						var NAME = 0, IMG = 1, WEBSITE = 2;
						var sponsors = [];

						for (var i = 1; i < rows.length; i++) {
							sponsors.push({
								name: rows[i].cellsArray[NAME],
								img: rows[i].cellsArray[IMG],
								website: rows[i].cellsArray[WEBSITE]
							});
						}

						resolve(sponsors);

					} else {
						reject(error);
					}
				}
			});
		});
	}

	res.judges = function() {
		return $q(function(resolve, reject) {
			sheetrock({
				url: urls.judges,
				query: 'SELECT A,B,C',
				callback: function(error, options, response) {
					if (!error) {
						var rows = response.rows;
						var NAME = 0, IMG = 1, DESC = 2;
						var judges = [];

						for (var i = 1; i < rows.length; i++) {

							
							judges.push({
								name: rows[i].cellsArray[NAME],
								img: '../img/' + rows[i].cellsArray[IMG],
								desc: rows[i].cellsArray[DESC]
							});
						}

						resolve(judges);

					} else {
						reject(error);
					}
				}
			});
		});
	}

	return res;
}

var Controller = function($scope, $document, Reader) {
		
	$scope.scrollIt = function(ID) {
		$document.scrollToElementAnimated(document.getElementById(ID));
	}	

	Reader.faq().then(
		function(faqs) {	$scope.faqs = faqs;	},
		function(error) {	console.log("faq", error);	}
	);
	Reader.events().then(
		function(events) { $scope.events = events; },
		function(error) {	console.log("events", error);	}
	);
	Reader.sponsors().then(
		function(sponsors) { $scope.sponsors = sponsors; },
		function(error) {	console.log("sponsors", error);	}
	);
	Reader.judges().then(
		function(judges) { $scope.judges = judges; },
		function(error) {	console.log("judges", error);	}
	);

}

app.factory('Reader', gReader);
app.controller('Controller', ['$scope', '$document', 'Reader', Controller]);