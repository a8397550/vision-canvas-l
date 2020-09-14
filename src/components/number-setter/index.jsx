import React, { Component } from 'react';
import NumberControl from './coms/number-control/index';
import PropTypes from 'prop-types';

class NumberSetter extends Component {
  static propTypes = {
    prop: PropTypes.object,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    precision: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    units: PropTypes.array,
  };

  static displayName = 'NumberSetter';

  // componentWillMount() {
  //   this.willDetach = this.props.prop.onValueChange(() => this.forceUpdate());
  // }

  componentWillUnmount() {
    // if (this.willDetach) {
    //   this.willDetach();
    // }
  }

  render() {
    const { prop, ...props } = this.props;

    return (
      <NumberControl
        {...props}
        value={prop.getHotValue()}
        onChange={(val) => {
          // if it is a number string
          if (/^[0-9]+\.?[0-9]*$/.test(val)) {
            prop.setHotValue(parseFloat(val));
          } else {
            // a string with unit
            prop.setHotValue(val);
          }
        }}
      />
    );
  }
}

export default NumberSetter;
