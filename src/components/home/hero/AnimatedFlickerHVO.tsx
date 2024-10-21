import { useState, useEffect } from 'react';
import AnimatedHVO from './animated-HVO';


const AnimatedCtaHero = ({ ctaArray }: {
    ctaArray: {
        text: string;
        highlight?: boolean | undefined;
    }[][]
}) => {

    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsDeleting(true); // Iniciar el borrado antes de cambiar el texto

            setTimeout(() => {
                setIsDeleting(false); // Finalizar el borrado

                setIndex((prevIndex) => (prevIndex + 1) % ctaArray.length);
            }, 500);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            <span key={index} className={`not-sr-only text-gray-50 font-bold transition-all ${isDeleting ? 'animate-zoom-out' : 'animate-zoom-in'}`}>
                <AnimatedHVO arrayText={ctaArray[index]} isDeleting={isDeleting} />
            </span>
        </>
    );
};

export default AnimatedCtaHero;