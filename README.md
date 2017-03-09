# URLOPY-APP

## Set-up

Run:

* `yarn`
* `yarn run start:server` (or `yarn run start:server:watch` to auto-reload)
* `yarn start` (in another terminal) - this sets up client-side application

## Proxying requests:

https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development

## Server/client code sharing

Look for `common` folder under root directory

## Structure

* public - create-react-app development bundle
* common - client/server shared code
* src - client sources
* srcServer - server sources

## Testing

Run `yarn test`