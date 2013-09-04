all:
	coffee -c js/bootstrap-tour.coffee
	uglifyjs -o js/bootstrap-tour-min.js js/bootstrap-tour.js
