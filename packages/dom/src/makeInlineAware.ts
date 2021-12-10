import type {
  ComputePosition,
  ComputePositionConfig,
  ComputePositionReturn,
  Coords,
  VirtualElement,
} from '@floating-ui/core';
import {getBoundingClientRect} from './utils/getBoundingClientRect';

export const makeInlineAware = (
  computePosition: ComputePosition,
  {x, y}: Partial<Coords> = {}
) => {
  return async (
    reference: Element,
    floating: HTMLElement,
    options: ComputePositionConfig
  ): Promise<ComputePositionReturn> => {
    let placement = options.placement ?? 'bottom';

    const inlineAwareReference: VirtualElement = {
      contextElement: reference,
      getBoundingClientRect() {
        const fallback = getBoundingClientRect(reference);
        const clientRects = Array.from(reference.getClientRects());

        // There are two rects and they are disjoined
        if (
          clientRects.length === 2 &&
          clientRects[0].left > clientRects[1].right &&
          x != null &&
          y != null
        ) {
          // Find the first rect in which the point is fully inside; add 2px
          // to account artifacts between the mouse client coords and the rect
          return (
            clientRects.find(
              (rect) =>
                x > rect.left - 2 &&
                x < rect.right + 2 &&
                y > rect.top - 2 &&
                y < rect.bottom + 2
            ) ?? fallback
          );
        }

        // There are 2 or more connected rects
        if (clientRects.length >= 2 && ['top', 'bottom'].includes(placement)) {
          const firstRect = clientRects[0];
          const lastRect = clientRects[clientRects.length - 1];
          const isTop = placement === 'top';

          const top = firstRect.top;
          const bottom = lastRect.bottom;
          const left = isTop ? firstRect.left : lastRect.left;
          const right = isTop ? firstRect.right : lastRect.right;
          const width = right - left;
          const height = bottom - top;

          return {
            top,
            bottom,
            left,
            right,
            width,
            height,
            x: left,
            y: top,
          };
        }

        return fallback;
      },
    };

    ({placement} = await computePosition(reference, floating, options));
    return computePosition(inlineAwareReference, floating, options);
  };
};
