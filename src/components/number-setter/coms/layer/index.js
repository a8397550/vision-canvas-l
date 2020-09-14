import React, { Component } from 'react';
import classNames from 'classnames';
// import Icons from '@ali/ve-icons';
import './style.less';
import { resolveLayerPosition, getTarget, getRect, getBoundsParent } from './util';
import PropTypes from 'prop-types';

export default class Layer extends Component {
  static propTypes = {
    className: PropTypes.string,
    target: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]).isRequired,
    style: PropTypes.object,
    closeOnClickOutside: PropTypes.bool,
    position: PropTypes.string,
    visible: PropTypes.bool,
    showClose: PropTypes.bool,
    syncTargetWidth: PropTypes.bool,
    children: PropTypes.node,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
    offset: PropTypes.object,
    noLimitOnMaxHeight: PropTypes.bool,
    maxHeight: PropTypes.number,
  };

  static defaultProps = {
    showClose: false,
    position: 'bottom right',
    visible: false,
    closeOnClickOutside: true,
  };

  static displayName = 'Layer';

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  componentDidMount() {
    this.update();
  }

  componentWillReceiveProps(props) {
    if (props.visible !== this.props.visible) {
      this.setState({
        visible: props.visible,
      });
    }
  }

  componentDidUpdate() {
    this.update();
  }

  componentWillUnmount() {
    if (this.willDetach) {
      this.willDetach.forEach(off => off());
    }
  }

  update() {
    if (this.willDetach) {
      this.willDetach.forEach(off => off());
    }
    this.willDetach = [];
    if (this.target) {
      this.target.classList.remove('vu-layer-active');
    }
    const shell = this.shell;
    if (!shell) return;

    shell.classList.remove('vu-visible');

    const { target, closeOnClickOutside } = this.props;

    this.target = getTarget(target) || this.target;
    if (!this.target) return;

    this.target.classList.add('vu-layer-active');

    const boundsParent = getBoundsParent(shell) || document;
    this.boundsParent = boundsParent;

    this.updatePosition();
    shell.classList.add('vu-visible');

    if (closeOnClickOutside) {
      const down = (e) => {
        if (e.target && !shell.contains(e.target) && !this.target.contains(e.target)) {
          this.hide();
        }
      };
      document.addEventListener('mousedown', down);
      this.willDetach.push(() => {
        document.removeEventListener('mousedown', down);
      });
    }
  }

  updatePosition() {
    const { offset } = this.props;

    if (!this.target) return;

    const shell = this.shell;
    const bounds = getRect(this.boundsParent);
    const targetRect = this.target.getBoundingClientRect();
    const { position, syncTargetWidth } = this.props;
    if (syncTargetWidth) {
      shell.style.width = `${targetRect.width}px`;
    }
    const shellRect = shell.getBoundingClientRect();
    const { left, top, height } = resolveLayerPosition(shellRect, targetRect, bounds, position);

    shell.style.top = `${parseInt(top, 10) + (offset ? offset.top : 0)}px`;
    shell.style.left = `${parseInt(left, 10) + (offset ? offset.left : 0)}px`;
    if (!this.props.noLimitOnMaxHeight) {
      shell.style.maxHeight = `${height < (this.props.maxHeight || 300)
        ? height : (this.props.maxHeight || 300)}px`;
    }
  }

  hide() {
    this.setState({
      visible: false,
    });
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  show() {
    this.setState({
      visible: true,
    });
    if (this.props.onShow) {
      this.props.onShow();
    }
  }

  toggle() {
    if (this.state.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  render() {
    if (!this.state.visible) {
      return null;
    }
    const className = classNames('vu-layer', this.props.className);
    return (
      <div className={className} ref={(ref) => { this.shell = ref; }} style={this.props.style}>
        {/* {this.props.showClose && <Icons.Button
          className="vu-layer-close"
          name="close"
          size="12px"
          onClick={() => this.hide()}
        />} */}
        <div className="vu-layer-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
