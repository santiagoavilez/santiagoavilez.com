import { useState, useEffect } from 'react';

const AnimatedSpan = ({ arrayText }: { arrayText: string[] }) => {

    const [index, setIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsOpen(false);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % arrayText.length);
                setIsOpen(true);
            }, 100);
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <span data-state={isOpen ? 'open' : 'closed'} key={index} className={` animate-bg-animation bg-gradient-to-r    from-purple-500 via-yellow-500  to-cyan-500 bg-[500%,500%] bg-clip-text bg-no-repeat font-bold text-transparent `}>{arrayText[index]}</span>

    );
};

export default AnimatedSpan;