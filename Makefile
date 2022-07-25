.ONESHELL:
.PHONY: statik

static:
	rm -rf ./statik
	cd ../market_frontend && yarn build-ci
	statik -src=./dist
	mv statik ../market_backend

clean:
	rm -rf ./statik

lint:
	golangci-lint run -c ./golangci.yml ./...

test:
	go test -v --cover ./...

test-report:
	go test -v --cover -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out
