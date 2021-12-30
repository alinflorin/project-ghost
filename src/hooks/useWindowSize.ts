import { useEffect, useState } from 'react';

export const useWindowSize = (timeoutInterval = 100) => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    } as { width: number | undefined, height: number | undefined; });

    let timeout: any;
    useEffect(() => {
        const handleResize = () => {
            if (timeout != null) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
                clearTimeout(timeout);
            }, timeoutInterval);
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
};
export default useWindowSize;