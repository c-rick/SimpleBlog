
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
/*css*/
import './src/styles/app.scss';
/*redux*/
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from './src/reducer/index';
import {showList} from './src/actions';
/*router*/
import List from './src/components/list.js';
import Header from './src/components/header.js'
import Detail from './src/components/detail.js';
const store = createStore(reducer);
ReactDOM.render(
    <Provider store={store}>
    <Router >
    <div>
    <Route exact={false} path="/" component={Header}  />
    <Route path="/list" component={List}/>
    <Route path="/detail" component={Detail}/>
    </div>
    </Router>
    </Provider>,
  document.getElementById('app')
);
