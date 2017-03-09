# URLOPY-APP

## Set-up

Run:

* `yarn`

If need be, in separate terminals do (or put in background):

* `yarn run start:server` (or `yarn run start:server:watch` to auto-reload)
* `yarn start` - this sets up client-side application (default address is http://localhost:3000)
* `yarn run build:css` (or `yarn run build:css:watch`)

## Proxying requests

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