
import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { InlineIndexTemplate } from './layout-container/inline-block-layout.jsx';
import { IndexTemplate } from './layout-container/absolute-layout.jsx';

ReactDOM.render(
    <HashRouter>
      <Switch>
        <Route path="/inline-block" component={InlineIndexTemplate} />
        <Route path="/" component={IndexTemplate} />
      </Switch>
    </HashRouter>
  ,
  document.getElementById('container'),
);
