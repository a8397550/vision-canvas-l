import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Big from 'big.js';
import Layer from '../layer/index';
import './style.less';

class UnitsChoice extends Component {
  static propTypes = {
    units: PropTypes.array,
    onChange: PropTypes.func,
    selected: PropTypes.string,
  };
  render() {
    const menus = this.props.units.map(unit => <div
      key={unit.type}
      className="ve-unit-item"
      onClick={() => {
        this.props.onChange(unit);
        this.layer.hide();
      }}
    >{unit.type}</div>);

    return (
      <div className="ve-units">
        <span
          ref={ref => { this.trigger = ref; }}
          className="ve-units-selected"
          onClick={() => this.layer && this.layer.toggle()}
        >{this.props.selected || '-'}</span>
        {menus.length > 0 && <Layer
          ref={ref => { this.layer = ref; }}
          className="ve-units-layer"
          target={() => this.trigger}
          closeOnClickOutside
        >{menus}</Layer>}
      </div>
    );
  }
}

function isEmpty(v) {
  return !v && v !== 0;
}

function isValidNumber(v) {
  return !isEmpty(v) && /^-?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/.test(v);
}

function isInteger(v) {
  return !isEmpty(v) && /^-?\d+$/.test(v);
}

function toString(v) {
  return v != null && v.toString ? v.toString() : '';
}

function trim(v) {
  return toString(v).trim();
}

class NumberControl extends Component {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    value: PropTypes.any,
    units: PropTypes.array,
    compute: PropTypes.func,
    step: PropTypes.number,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    onlyInteger: PropTypes.bool,
    allowEmpty: PropTypes.bool
  };

  static defaultProps = {
    compute() {
      return 0;
    },
    disabled: false,
    readOnly: false,
    onlyInteger: false,
    allowEmpty: true,
  };

  static displayName = 'NumberControl';

  constructor(props) {
    super(props);

    this.setupUnits(this.props.units);
    this.state = {
      focused: false,
    };
    this.setupPlaceholder(this.props.placeholder);
    this.setValue(this.props.value, true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.units !== this.props.units) {
      this.setupUnits(nextProps.units);
    }
    if (nextProps.placeholder !== this.props.placeholder) {
      this.setupPlaceholder(nextProps.placeholder);
    }
    if (nextProps.value !== this.props.value) {
      this.setValue(nextProps.value, false, false, true);
    }
  }

  onKeyDown(e) {
    if (e.keyCode !== 38 && e.keyCode !== 40) {
      return;
    }
    e.preventDefault();
    if (e.keyCode === 40) {
      this.changeValue(true);
    } else {
      this.changeValue(false);
    }
  }

  setupUnits(units) {
    const availableUnits = [];
    const availablePresets = [];
    this.defaultUnit = '';
    this.unitsMap = {};
    this.units = [];
    if (units) {
      this.units = units.map((item, index) => {
        if (typeof item !== 'object') {
          item = {
            type: item,
          };
        }
        if (item.preset) {
          availablePresets.push(item.type);
        } else {
          availableUnits.push(item.type);
        }
        this.unitsMap[item.type] = item;
        if (index === 0) {
          this.defaultUnit = item.type;
        }
        return item.list ? item : null;
      }).filter(item => item != null);
    }

    this.hasUnits = availableUnits.length > 0;
    this.hasPresets = availablePresets.length > 0;

    const allowUnits = this.hasUnits ? `?(${availableUnits.join('|')})?` : '';
    const allowPresets = this.hasPresets ? `|^(${availablePresets.join('|')})$` : '';

    this.pattern = new RegExp(
      `^(?:(-?(?:[0-9]+(?:\\.[0-9]*)?|\\.[0-9]+)) *)${allowUnits}$${allowPresets}`,
      'i'
    );
  }

  setupPlaceholder(placeholder) {
    const parsed = this.parseValue(placeholder);
    if (parsed) {
      this.placeholder = parsed.value;
      this.baseValue = parsed.value;
      this.baseUnit = parsed.unit;
    } else {
      this.placeholder = placeholder;
      this.baseValue = null;
      this.baseUnit = '';
    }
  }

  setValue(value, initial, forceValid, received) {
    let ret = {
      value,
      valid: false,
    };
    const parsed = this.parseValue(value, received);
    if (parsed) {
      if (forceValid) {
        ret = {
          ...this.intoRange(parsed),
          valid: true,
        };
      } else {
        ret = {
          ...parsed,
          valid: this.isInRange(parsed),
        };
      }
    } else {
      // 不允许输入-.0-9以外的字符
      ret.value = ret.value.replace(/[^\-.0-9]/g, '');
    }

    if (initial) {
      this.state = {
        ...this.state,
        ...ret,
      };
    } else {
      this.setState(ret);
      if (ret.valid && this.props.onChange && !received) {
        let n = ret.value;
        const u = ret.unit;
        if (isEmpty(n)) {
          n = '';
        }
        if (!u || u === '-' || n === '') {
          this.props.onChange(n);
        } else {
          this.props.onChange(`${n}${u}`);
        }
      }
    }
  }

  intoRange(parsed) {
    const { value, unit, preset } = parsed;

    if (isEmpty(value) || preset) {
      return parsed;
    }

    const {
      min = this.props.min,
      max = this.props.max,
    } = unit && this.unitsMap[unit] || {};

    let bval = new Big(value);
    if (min != null && bval.lt(min)) {
      bval = new Big(min);
    }
    if (max != null && bval.gt(max)) {
      bval = new Big(max);
    }

    return {
      value: bval.toString(),
      unit,
    };
  }

  isInRange(parsed) {
    const { value, unit, preset } = parsed;

    if (isEmpty(value) || preset) {
      if (this.props.allowEmpty) {
        return true;
      }
      return false;
    }

    const {
      min = this.props.min,
      max = this.props.max,
    } = unit && this.unitsMap[unit] || {};

    const bval = new Big(value);
    if (min != null && bval.lt(min)) {
      return false;
    }
    if (max != null && bval.gt(max)) {
      return false;
    }

    // onlyInteger 仅允许为整数
    if (this.props.onlyInteger && !isInteger(value)) {
      return false;
    }

    return true;
  }

  parseValue(value, received) {
    value = trim(value);
    if (value === '') {
      return {
        value,
        unit: this.state.unit || this.baseUnit || this.defaultUnit || '',
        preset: false,
      };
    }

    const m = this.pattern.exec(value);
    if (!m) {
      return null;
    }

    const presetIndex = this.hasUnits ? 3 : 2;
    const preset = m[presetIndex];

    if (preset) {
      return {
        value: preset,
        unit: '',
        preset: true,
      };
    }

    let unit = '';
    if (this.hasUnits) {
      unit = m[2];
      if (!unit) {
        unit = received && this.defaultUnit === '-'
          ? '-' : this.state.unit || this.baseUnit || this.defaultUnit;
      }
    }

    return {
      value: m[1] || '',
      unit,
      preset: false,
    };
  }

  // up & down change the value
  changeValue(minus) {
    let value = trim(this.state.value);
    let unit;
    // a valid number
    if (isValidNumber(value)) {
      unit = this.state.unit || '';
    } else if (isEmpty(value) && !isEmpty(this.baseValue)) {
      // placeholder has a baseValue & baseUnit
      value = this.baseValue;
      unit = this.baseUnit || '';
    } else if (this.props.compute) {
      // has compute func
      const parsed = this.parseValue(this.props.compute(value));
      value = parsed.value || 0;
      unit = parsed.unit || '';
    } else {
      // fault
      value = 0;
      unit = this.state.unit || this.baseUnit || this.defaultUnit || '';
    }
    const bval = new Big(value);
    const defaultStep = this.props.step || 1;
    const step = unit && this.unitsMap[unit]
      ? (this.unitsMap[unit].step || defaultStep) : defaultStep;
    value = (minus ? bval.minus(step) : bval.plus(step)).toString();
    this.setValue(`${value}${unit}`, false, true);
  }

  changeUnit(nextUnit) {
    const { value, unit } = this.state;

    if (nextUnit.type === (nextUnit.preset ? value : unit)) {
      return;
    }

    const cast = nextUnit.cast || ((number, validNumber) => {
      if (nextUnit.preset) {
        number = '';
      } else if (!validNumber) {
        number = '0';
      }
      return `${number}${nextUnit.type}`;
    });
    this.setValue(cast(value, isValidNumber(value), unit), false, true);
  }

  render() {
    const { focused, valid, unit, value, preset } = this.state;
    const { disabled, readOnly } = this.props;
    const className = classNames('ve-number-control', this.props.className, {
      've-focused': focused,
      've-invalid': !valid,
      've-has-units': this.hasUnits,
      've-disabled': disabled
    });
    const selectUnit = unit || (preset ? '' : this.baseUnit || this.defaultUnit);

    const inputProps = {
      type: "text",
      className: "ve-input",
      value: value == null ? '' : value,
      placeholder: this.placeholder,
      onChange: (e) => this.setValue(e.target.value),
      onBlur: () => this.setState({ focused: false }),
      onFocus: () => this.setState({ focused: true }),
      onKeyDown: this.onKeyDown.bind(this),
      disabled,
      readOnly
    }
    return (
      <div className={className}>
        <input {...inputProps}/>
        {this.hasUnits && <UnitsChoice
          selected={selectUnit}
          units={this.units}
          onChange={this.changeUnit.bind(this)}
        />}
        <div className="ve-ticks">
          {(disabled || readOnly) ? null : <i className="ve-tick ve-tick-up" onClick={() => this.changeValue(false)} />}
          {(disabled || readOnly) ? null : <i className="ve-tick ve-tick-down" onClick={() => this.changeValue(true)} />}
        </div>
      </div>
    );
  }
}

export default NumberControl;
