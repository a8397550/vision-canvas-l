import React from 'react';
import {eventBus} from '../../component-dispatch-center-bus/eventBus.jsx'; 

class DemoA extends React.Component {
  update(options) {
    console.log(options);
  }

  onClick = () => {
    console.log(this.props);
    if (this.props.onClick) {
      this.props.onClick('666');
    }
  }

  render() {
    const { title, selectValue } = this.props;
    return (<div
     onClick={this.onClick}
    >{title}<br/>{selectValue}
      <button onClick={()=>{
        eventBus.trigger('click', {
          a: 1,
        });
      }}>按钮</button>
    </div>);
  }
}

export default DemoA;