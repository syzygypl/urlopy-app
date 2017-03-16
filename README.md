# URLOPY-APP

## Set-up

Rename .env.default to .env and then run:

* `yarn`

If need be, in separate terminals do (or put in background):

* `yarn run start:server` (or `yarn run start:server:watch` to auto-reload)
* `yarn start` - this sets up client-side application (default address is http://localhost:3000)
* `yarn run build:css` (or `yarn run build:css:watch`)

Create-react-app supports autoprefixer out of the box. There is no need to add it to postCSS plugins list.
    
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

If you encounter any problems, try to `brew install watchman` and then run `yarn test` again