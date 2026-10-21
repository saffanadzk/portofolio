import { useEffect, useRef } from 'react';

type Axis = { x: number; y: number };
export type ScrollPositionEffectProps = { prevPos: Axis; currPos: Axis };

export function useScrollPosition(
  effect: (props: ScrollPositionEffectProps) => void,
  deps: React.DependencyList = [],
  element?: any,
  useWindow: boolean = true,
  wait: number = 50,
  boundingElement?: any,
) {
  const position = useRef<Axis>({ x: 0, y: 0 });
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (throttleTimeout.current === null) {
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null;
          const currPos = {
            x: typeof window !== 'undefined' ? -window.scrollX : 0,
            y: typeof window !== 'undefined' ? -window.scrollY : 0,
          };
          effect({ prevPos: position.current, currPos });
          position.current = currPos;
        }, wait);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimeout.current) clearTimeout(throttleTimeout.current);
    };
  }, deps);
}
