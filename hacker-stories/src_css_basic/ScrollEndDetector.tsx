import React, { useEffect, useRef } from 'react';

interface ScrollEndProps {
    onScrollEnd: () => void;
    children: React.ReactNode;
}

export const ScrollEndDetector: React.FC<ScrollEndProps> = ({ onScrollEnd, children }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasScrolledToEnd = useRef(false); // 🛡️ Guard against repeated calls


    useEffect(() => {
        const handleScroll = () => {
            const el = scrollRef.current;
            if (!el) return;

            const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;

            if (isAtBottom && !hasScrolledToEnd.current) {
                hasScrolledToEnd.current = true;
                onScrollEnd();
            } else if (!isAtBottom) {
                hasScrolledToEnd.current = false; // Reset when user scrolls up
            }
        };


        const el = scrollRef.current;
        el?.addEventListener('scroll', handleScroll);

        return () => {
            el?.removeEventListener('scroll', handleScroll);
        };
    }, [onScrollEnd]);

    return (
        <div ref={scrollRef} className='app-container-remaining'>
            {children}
        </div>
    );
};
