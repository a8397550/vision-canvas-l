import React from 'react';
import {BaseCanvasLContainer} from '../base-canvas-l-container/index.jsx';
import { GetClassOrStyle } from '../../index.jsx';
import { BaseNode } from '../base-node/index.jsx';

export class LineCanvasLContainer extends BaseCanvasLContainer {
  componentDidMount(){
    console.log(this.props);
  }
}