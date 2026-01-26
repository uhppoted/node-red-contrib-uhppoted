SERIALNO ?= 405419896
CARD     ?= 65538
DOOR     ?= 3
DEVICEIP ?= 192.168.1.125
DATETIME  = $(shell date "+%Y-%m-%d %H:%M:%S")
LISTEN   ?= 192.168.1.100:60001
DEBUG    ?= --debug

.PHONY: build
.PHONY: test
.PHONY: docker

update:
	npm update
	npm audit fix --omit=dev

update-release:
	npm update
	npm audit fix --omit=dev

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
	npx --yes node-red-dev validate

integration-tests: build
# 	node-red ./integration-tests/integration-tests.json
	cd docker/integration-tests && docker compose up --build

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
# 	node-red ./examples/examples.json
	cd docker/examples && docker compose up --build

simulator:
	docker run --detach --publish 8000:8000 --publish 60005:60000 --publish 60005:60000/udp --name simulator --rm uhppoted/simulator-dev

docker:
	docker run -it --publish 1880:1880 \
	       --volume "$(PWD):/node-red-contrib-uhppoted" \
	       -e FLOWS=/node-red-contrib-uhppoted/examples/examples.json \
	       --name node-red --rm nodered/node-red
