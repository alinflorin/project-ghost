import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
	const isMobile = useMediaQuery({ minWidth: 0, maxWidth: 576 });

	const isLargeOrHigher = useMediaQuery({ minWidth: 992 });

	const isExtraLargeOrHigher = useMediaQuery({ minWidth: 1200 });


	return { isMobile, isExtraLargeOrHigher, isLargeOrHigher };
};

export default useResponsive;
