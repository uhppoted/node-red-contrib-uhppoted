SERIALNO ?= 405419896
CARD     ?= 65538
DOOR     ?= 3
DEVICEIP ?= 192.168.1.125
DATETIME  = $(shell date "+%Y-%m-%d %H:%M:%S")
LISTEN   ?= 192.168.1.100:60001
DEBUG    ?= --debug

.PHONY: build
.PHONY: test

update:
	npm update
	npm i --lockfile-version 1 --package-lock-only 
	# npm audit fix

update-release:
	npm update
	npm i --lockfile-version 1 --package-lock-only 
	# npm audit fix

format:
	npx prettier --write nodes/*.js
	npx prettier --write test/*.js

build: format
	npx eslint --fix nodes/**/*.js  

debug: build
#	npx eslint --fix test/**/*.js
#	npm run test
	node-red ./examples/debug.json

test: 
	npx eslint --fix test/**/*.js  
	npm test
	node-red-dev validate

integration-tests: build
	node-red ./integration-tests/integration-tests.json

build-all: build test

release: build-all
	npm pack

publish: release
	echo "Releasing version $(VERSION)"
	gh release create "$(VERSION)" *.tgz --draft --latest --title "$(VERSION)" --notes-file release-notes.md

publish-npm: release
	echo "Publishing version $(VERSION) to npm"
	npm --dry-run publish
	npm publish

examples: build
	node-red ./examples/examples.json

dashboard: build
	node-red ./examples/dashboard.json

