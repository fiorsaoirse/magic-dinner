lint:
	npx eslint .

dev:
	 DEBUG=rest:* npm start dev

build:
	rm -rf dist
	npm run build

test:
	npm test
