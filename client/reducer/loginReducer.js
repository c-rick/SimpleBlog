import { login, logout, rigestIn, Rigest_In } from '../actions'

import common from '../common.js';
var initState = { user: null, nowUser: 'rick' }

function loginReducer (state = initState, action){
  switch (action.type) {
    case 'Rigest_In':
      return { user: action.name, nowUser: action.nowname };
    case 'Log_In':
      return { user: action.name, nowUser: action.nowname };
    case 'Change_Now':
      return Object.assign({}, state, { nowUser: action.nowname });
    case 'Log_Out':
      return { user: null, nowUser: null };
    default:
      return state;
  }
}
export default loginReducer;
