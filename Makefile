.ONESHELL:
.PHONY: statik

build:
	d=$$(date +%s)\
	; rm -rf ./ui/dist
	npm --prefix=./ui ci && npm --prefix=./ui run build
	rm -rf ./market/dist
	yarn --cwd=./market && yarn --cwd=./market build-ci
	goreleaser --snapshot --rm-dist
	rm ./dist/pocketbase_linux_arm64/pocketbase
	rm ../pocketbase
	mv dist/pocketbase_linux_amd64_v1/pocketbase ../
	chmod +x ../pocketbase \
	&& echo -e "\n\033[33;32mBuild completed in $$(($$(date +%s)-d)) seconds\e[0m"
	
binary:
	d=$$(date +%s)\
	; goreleaser --snapshot --rm-dist
	rm ./dist/pocketbase_linux_arm64/pocketbase
	rm ../pocketbase
	mv dist/pocketbase_linux_amd64_v1/pocketbase ../
	chmod +x ../pocketbase \
	&& echo -e "\n\033[33;32mBuild completed in $$(($$(date +%s)-d)) seconds\e[0m"

copy:
	rm ../pocketbase
	mv dist/pocketbase_linux_amd64_v1/pocketbase ../
	chmod +x ../pocketbase

lint:
	golangci-lint run -c ./golangci.yml ./...

test:
	go test -v --cover ./...

test-report:
	go test -v --cover -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out
