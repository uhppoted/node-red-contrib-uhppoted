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
#	npm audit fix

update-release:
	npm update
#	npm audit fix

build:
	npx eslint --fix nodes/*.js  

test: build
	npx eslint --fix test/*.js  
	npm test

integration-tests: build
	node-red ./integration-tests/integration-tests.json

build-all: build

release:
	npm pack

examples: build
	node-red ./examples/examples.json

examples-deprecated: build
	node-red ./examples/examples-deprecated.json

dashboard: build
	node-red ./examples/dashboard.json

dashboard-deprecated: build
	node-red ./examples/dashboard-deprecated.json

