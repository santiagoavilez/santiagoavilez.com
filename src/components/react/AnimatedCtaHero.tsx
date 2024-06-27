import { useState, useEffect } from 'react';
import type { IanimatedCta } from './animated-cta';
import AnimatedCta from './animated-cta';

const animatedTextsArray = [
    [{
        text: "Transforma tu visión en un MVP, ",
    },
    {
        text: " impactante ",
        highlight: true,
    },
    {
        text: " sin desperdiciar inversión.",
    },],
    [
        {
            text: "Te acompaño a crear, ",
        },
        {
            text: " una vision clara ",
            highlight: true,
        },
        {
            text: " sin desperdiciar inversión.",
        }
    ]
];


const AnimatedCtaHero = ({ ctaArray }: { ctaArray: IanimatedCta[] }) => {

    const [index, setIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsOpen(false);
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % ctaArray.length);
                setIsOpen(true);
            }, 100);
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <span data-state={isOpen ? 'open' : 'closed'} key={index} className={` animate-bg-animation bg-gradient-to-r  dark:from-slate-50 dark:via-gray-300 dark:to-zinc-400 from-gray-900 via-slate-900/80  to-zinc-700/90 bg-[500%,500%] bg-clip-text bg-no-repeat font-bold text-transparent duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`}>
            <AnimatedCta arrayText={ctaArray[index].arrayText} />
        </span>

    );
};

export default AnimatedCtaHero;