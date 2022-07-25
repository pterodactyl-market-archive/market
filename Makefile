.ONESHELL:
.PHONY: statik

statik:
	rm -rf ./statik
	cd ../market_frontend && yarn build-ci
	statik -src=../market_frontend/dist
	
build:
	../goreleaser --snapshot

clean:
	rm -rf ./statik

lint:
	golangci-lint run -c ./golangci.yml ./...

test:
	go test -v --cover ./...

test-report:
	go test -v --cover -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out
