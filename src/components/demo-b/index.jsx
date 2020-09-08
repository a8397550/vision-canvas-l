import React from 'react';
import {eventBus} from '../../component-dispatch-center-bus/eventBus.jsx';

class DemoB extends React.Component {
  constructor(props) {
    super(props);
    console.log('实验重绘');
    this.state = {
      a: 2
    }
  }
  update(options) {
    console.log(options);
  }
  componentDidMount(){
    eventBus.on('click', (data) => {
      console.log(data);
      this.setState({
        a: data.a
      })
    });
  }
  render() {
    const { title } = this.props;
    return (<div>{title}{this.state.a}</div>);
  }
}

export default DemoB;