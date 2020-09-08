
import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { InlineIndexTemplate } from './layout-container/inline-block-layout.jsx';
import { IndexTemplate } from './layout-container/absolute-layout.jsx';
import {ViewTemplate} from './layout-container/view-layout.jsx';

ReactDOM.render(
    <HashRouter>
      <Switch>
        <Route path="/" exact component={IndexTemplate} />
        <Route path="/inline-block" exact component={InlineIndexTemplate} />
        <Route path="/view" exact component={ViewTemplate} />
      </Switch>
    </HashRouter>
  ,
  document.getElementById('container'),
);
