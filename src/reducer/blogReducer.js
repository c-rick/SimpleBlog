import {Show_Blog, Add_Blog, Update_Blog, Delet_Blog} from '../actions'

import common from '../common.js';
var initState = []

function blogReducer(state=initState, action) {
  
	switch (action.type) {
		case 'Show_Blog':
		return action.text;
		default:
		return state;
	}
}
export default blogReducer;