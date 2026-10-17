import { useMediaQuery } from 'react-responsive';
import { breakpoints } from './breakpoints';

export const useBreakpoints = () => {
  const isXs = useMediaQuery({ maxWidth: breakpoints.xs.maxWidth });
  const isSm = useMediaQuery({ minWidth: breakpoints.sm.minWidth, maxWidth: breakpoints.sm.maxWidth });
  const isMd = useMediaQuery({ minWidth: breakpoints.md.minWidth, maxWidth: breakpoints.md.maxWidth });
  const isLg = useMediaQuery({ minWidth: breakpoints.lg.minWidth, maxWidth: breakpoints.lg.maxWidth });
  const isXl = useMediaQuery({ minWidth: breakpoints.xl.minWidth, maxWidth: breakpoints.xl.maxWidth });
  const isXxl = useMediaQuery({ minWidth: breakpoints.xxl.minWidth });

  const isPhone = isXs || isSm;
  const isTabletOrLandscape = isMd;
  const isDesktop = isLg|| isXl || isXxl;

  const isPortrait = useMediaQuery({ orientation: 'portrait' });

  return { isXs, isSm, isMd, isLg, isXl, isXxl, isPhone, isTabletOrLandscape, isDesktop, isPortrait };
};