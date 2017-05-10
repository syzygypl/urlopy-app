import R from 'ramda';

import { isLoaded } from 'react-redux-firebase';

export default toLoad =>
  (toLoad
    .filter(R.identity)
    .filter(isLoaded).length === toLoad.length);
