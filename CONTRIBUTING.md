# Contributing to SLO-Tracker

## How to Contribute

- If you'd like to contribute, start by searching through the [issues](https://github.com/roshan8/slo-tracker/issues) and [pull requests](https://github.com/roshan8/slo-tracker/pulls) to see whether someone else has raised a similar idea or question.
- If you don't see your idea listed, Please raise an issue or open a pull request.
- If you wish to work on an issue reported by other users, Please claim it by commenting on the Github So we can avoid multiple contributors from working on the same issue.
- New contributors can pick up issues marked as `good first issue`.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org) format is required
for all commits.

## Vendoring dependencies

[Go modules](https://github.com/golang/go/wiki/Modules) are used for managing
dependecies. After adding new or removing exitsting depenencies please run

    go mod tidy

to update `go.mod` and `go.sum` files.

## Javascript & CSS assets

UI is written using [React](https://reactjs.org), follow user guide for
[create-react-app](https://github.com/facebook/create-react-app) to make
changes to the UI code.

## Running

```sh    
docker-compose up --build -d      
```    
> `admin:admin` is the default creds for UI, Which can be changed in docker-compose file.

## Steps to compile from source
- Install go(1.16+), mysql-server, npm and yarn
- Start MySQL server (Default password should be set to `SecretPassword`, or export datasource env [variable](https://github.com/roshan8/slo-tracker/blob/450f9184d8fda74e2f99ca9c853691e4e15fbbe5/config/config.go#L40))
- Start both FE and BE
```
go run main.go   
cd ui && yarn install && yarn start
```