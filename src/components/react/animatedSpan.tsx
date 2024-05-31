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
        <span data-state={isOpen ? 'open' : 'closed'} key={index} className={` animate-bg-animation bg-gradient-to-r   from-purple-500 via-yellow-500  to-cyan-500 bg-[500%,500%] bg-clip-text bg-no-repeat font-bold text-transparent duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`}>{arrayText[index]}</span>

    );
};

export default AnimatedSpan;