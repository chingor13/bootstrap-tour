all:
	coffee -c js/tour.coffee
	uglifyjs -o js/tour-min.js js/tour.js
