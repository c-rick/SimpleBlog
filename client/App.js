
import ReactDOM from 'react-dom';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

/* css */
import './styles/app.scss';

/* redux */
import { createStore } from 'redux';

import { Provider } from 'react-redux';
import reducer from './reducer/index';
import { showList } from './actions';

/* router */
import List from './components/List';
import Header from './components/Header'
import Detail from './components/Detail';



const store = createStore(reducer);
ReactDOM.render(
    <Provider store={store}>
      <Router >
        <div>
          <Route exact={false} path="/" component={Header} />
          <Route path="/list" component={List}/>
          <Route path="/detail" component={Detail}/>
        </div>
      </Router>
    </Provider>,
  document.getElementById('app')
);
