
import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { InlineIndexTemplate } from './demo/inline-block-layout.jsx';
import { IndexTemplate } from './demo/absolute-layout.jsx';

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
