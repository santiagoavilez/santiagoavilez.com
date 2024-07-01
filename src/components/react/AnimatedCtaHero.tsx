import { useState, useEffect } from 'react';
import type { IanimatedCta } from './animated-cta';
import AnimatedCta from './animated-cta';


const AnimatedCtaHero = ({ ctaArray }: {
    ctaArray: {
        text: string;
        highlight?: boolean | undefined;
    }[][] }) => {

    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsDeleting(true); // Iniciar el borrado antes de cambiar el texto

            setTimeout(() => {
                setIsDeleting(false); // Finalizar el borrado

                setIndex((prevIndex) => (prevIndex + 1) % ctaArray.length);
            }, 1500);
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>

            <span key={index} className={` not-sr-only	text-gray-50 font-bold`}>
                <AnimatedCta arrayText={ctaArray[index]} isDeleting={isDeleting} />
            </span>
        </>


    );
};

export default AnimatedCtaHero;