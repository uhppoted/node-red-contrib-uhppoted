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
	# npm audit fix

update-release:
	npm update
	# npm audit fix

build:
	npx eslint --fix nodes/*.js  

test: 
	npx eslint --fix test/*.js  
	npm test
	node-red-dev validate

integration-tests: build
	node-red ./integration-tests/integration-tests.json

build-all: build test

release: build-all
	npm pack

publish: release
	echo "Releasing version $(VERSION)"
	# gh release create "$(VERSION)" *.tgz --draft --prerelease --title "$(VERSION)-beta" --notes-file release-notes.md
	# npm --dry-run publish

examples: build
	node-red ./examples/examples.json

dashboard: build
	node-red ./examples/dashboard.json
