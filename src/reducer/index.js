import { combineReducers } from 'redux';
import blogReducer from './blogReducer';
import loginReducer from './loginReducer';
// import visibilityFilter from './visibilityFilter';

const reducer = combineReducers({
  blogReducer, loginReducer
});

export default reducer;