VERSION   = v0.6.x
DIST     ?= development

SERIALNO ?= 405419896
CARD     ?= 65538
DOOR     ?= 3
DEVICEIP ?= 192.168.1.125
DATETIME  = $(shell date "+%Y-%m-%d %H:%M:%S")
LISTEN   ?= 192.168.1.100:60001
DEBUG    ?= --debug

.PHONY: fix
.PHONY: build

fix:
	npx eslint --fix nodes/*.js

build:
	npx eslint nodes/*.js  

run: build
	node-red


