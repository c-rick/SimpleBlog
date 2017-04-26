import { combineReducers } from 'redux';
import blogReducer from './blogReducer';
import loginReducer from './loginReducer';

// import visibilityFilter from './visibilityFilter';
export default combineReducers({
  blogReducer, loginReducer
})
