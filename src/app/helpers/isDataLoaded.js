import { isLoaded } from 'react-redux-firebase';

export default toLoad => toLoad.filter(isLoaded).length === toLoad.length;
