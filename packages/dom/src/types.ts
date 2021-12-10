export type NodeScroll = {
  scrollLeft: number;
  scrollTop: number;
};

export {
  arrow,
  autoPlacement,
  flip,
  hide,
  offset,
  shift,
  limitShift,
  size,
  detectOverflow,
} from '@floating-ui/core';

export {computePosition} from './';
export {makeInlineAware} from './makeInlineAware';
export {getScrollParents} from './utils/getScrollParents';
