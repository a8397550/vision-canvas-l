import { Component } from 'react';
import { findDOMNode } from 'react-dom';

function resolveDirection(popup, target, bounds, prefers) {
  if (prefers.forceDirection) {
    return prefers.dir;
  }
  const extendWidth = popup.width + popup.extraOffset;
  const extendHeight = popup.height + popup.extraOffset;
  const SY = popup.width * extendHeight;
  const SX = popup.height * extendWidth;
  const mw = popup.width;
  const mh = popup.height;

  const mat = {
    top: () => {
      const s = mw * Math.min(target.top - bounds.top, extendHeight);
      return { s, enough: s >= SY };
    },
    bottom: () => {
      const s = mw * Math.min(bounds.bottom - target.bottom, extendHeight);
      return { s, enough: s >= SY };
    },
    left: () => {
      const s = mh * Math.min(target.left - bounds.left, extendWidth);
      return { s, enough: s >= SX };
    },
    right: () => {
      const s = mh * Math.min(bounds.right - target.right, extendWidth);
      return { s, enough: s >= SX };
    },
  };

  const orders = ['top', 'bottom', 'right', 'left'];
  if (prefers.dir) {
    const i = orders.indexOf(prefers.dir);
    if (i > -1) {
      orders.splice(i, 1);
      orders.unshift(prefers.dir);
    }
  }
  let ms = 0;
  let prefer = orders[0];
  for (let i = 0, l = orders.length; i < l; i++) {
    const dir = orders[i];
    const { s, enough } = mat[dir]();
    if (enough) {
      return dir;
    }
    if (s > ms) {
      ms = s;
      prefer = dir;
    }
  }
  return prefer;
}

function resolvePrefer(prefer) {
  if (!prefer) {
    return {};
  }
  const force = prefer[0] === '!';
  if (force) {
    prefer = prefer.substr(1);
  }
  let [dir, offset] = prefer.split(/\s+/);
  let forceDirection = false;
  let forceOffset = false;
  if (dir === 'center') {
    dir = 'auto';
    if (!offset) {
      offset = 'center';
    }
  }

  if (force) {
    if (dir && dir !== 'auto') {
      forceDirection = true;
    }
    if (offset && offset !== 'auto') {
      forceOffset = true;
    }
  }

  return { dir, offset, forceDirection, forceOffset };
}

export function resolveLayerPosition(popup, target, bounds, prefer) {
  popup = {
    extraOffset: 0,
    top: popup.top,
    right: popup.right,
    left: popup.left,
    bottom: popup.bottom,
    height: popup.height,
    width: popup.width,
  };

  const prefers = resolvePrefer(prefer);

  // 选择方向
  const dir = resolveDirection(popup, target, bounds, prefers);

  let top;
  let left;
  let height;

  // 或得该方位上横向 或 纵向的 偏移
  if (dir === 'top' || dir === 'bottom') {
    if (dir === 'top') {
      top = target.top - popup.extraOffset - popup.height;
      height = target.top - popup.extraOffset;
    } else {
      top = target.bottom + popup.extraOffset;
      height = window.innerHeight - top;
    }

    // 解决横向偏移
    const minLeft = target.right - popup.width;
    const maxLeft = target.left;

    if (prefers.offset === 'left') {
      left = maxLeft;
    } else {
      left = minLeft;
    }

    if (!prefers.forceOffset) {
      left = Math.max(Math.min(bounds.right - popup.width, left), minLeft);
      left = Math.min(Math.max(bounds.left, left), maxLeft);
    }
  } else {
    if (dir === 'left') {
      left = target.left - popup.extraOffset - popup.width;
    } else {
      left = target.right + popup.extraOffset;
    }

    // 解决纵向偏移
    const minTop = target.bottom - popup.height;
    const maxTop = target.top;

    if (prefers.offset === 'top') {
      top = maxTop;
    } else {
      top = minTop;
    }

    if (!prefers.forceOffset) {
      top = Math.max(Math.min(bounds.bottom - popup.height, top), minTop);
      top = Math.min(Math.max(bounds.top, top), maxTop);
    }
    height = window.innerHeight - top;
  }

  return { left, top, height };
}

function computeStyle(node, property) {
  const computed = window.getComputedStyle(node);
  return computed.getPropertyValue(property);
}

function isScroll(computed) {
  const overflowX = computed.getPropertyValue('overflow-x');
  const overflowY = computed.getPropertyValue('overflow-y');
  return (
    !(overflowX === 'visible' || overflowX === '')
    || !(overflowY === 'visible' || overflowY === '')
  );
}

function isFixed(computed) {
  return computed.getPropertyValue('position') === 'fixed';
}

export function getBoundsParent(target) {
  let node = target;
  let computed;
  while (node) {
    if (node === document.body) {
      return null;
    }
    computed = window.getComputedStyle(node);
    if (isFixed(computed)) {
      return null;
    }
    if (isScroll(computed)) {
      return node;
    }
    node = node.parentNode;
  }
  return null;
}

export function getRect(target) {
  const documentElement = document.documentElement;
  return target === document ? {
    left: 0,
    top: 0,
    right: documentElement.clientWidth,
    bottom: documentElement.clientHeight,
    width: documentElement.clientWidth,
    height: documentElement.clientHeight,
  } : target.getBoundingClientRect();
}

export function getTarget(target) {
  const type = typeof target;
  if (type === 'string') {
    target = document.querySelector(target);
  } else if (type === 'function') {
    target = target();
  }
  if (target instanceof Component) {
    target = findDOMNode(target); // eslint-disable-line
  }

  return target;
}
