import React from 'react';
import { ItemLayer } from '../react-dnd/drag-node.jsx';

export class ComponentPanesVisionCanvasL extends React.Component {
    render() {
        const { children } = this.props;
        return (<div>
            { children }
            <ItemLayer />
        </div>)
    }
}