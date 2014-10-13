all: build

build:
	node_modules/.bin/coffee -c *.coffee

clean:
	rm -f *.js
