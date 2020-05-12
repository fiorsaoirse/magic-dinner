lint:
	npx eslint .

dev:
	 DEBUG=rest:* npm start

build:
	rm -rf dist
	npm run build

test:
	npm test