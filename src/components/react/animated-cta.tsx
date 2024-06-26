import { useState, useEffect } from 'react';

export interface IanimatedCta {
    arrayText: {
        text: string;
        highlight?: boolean;
    }[]
}

const AnimatedCta = ({ arrayText }: IanimatedCta) => {
    const [index, setIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(true);
    const [displayText, setDisplayText] = useState<JSX.Element[]>([]);



    useEffect(() => {
        let i = 0; // Índice para las letras de la palabra actual
        const typingInterval = setInterval(() => {
            if (i < arrayText[index].text.length) {
                setDisplayText((prev) => [
                    ...prev,
                    <span key={`${index}-${i}`} className={arrayText[index].highlight ? 'dark:text-[#3E88CF] text-[#3E88CF]/70 ' : ''}
                    >
                        {arrayText[index].text[i]}
                    </span>
                ]);
                i++;
            } else {
                clearInterval(typingInterval);
                // Espera un momento antes de pasar a la siguiente palabra
                setTimeout(() => {
                    if (index < arrayText.length - 1) {
                        setIndex(index + 1); // Actualiza el índice para la siguiente palabra
                    } else {
                        // Opcional: Reiniciar la animación desde el principio
                        // setIndex(0);
                        // setDisplayText([]); // Limpia el texto para empezar de nuevo
                    }
                    i = 0; // Reinicia el contador de letras para la nueva palabra
                }, 25); // Ajusta este tiempo de espera según sea necesario
            }
        }, 25); // Ajusta este valor para controlar la velocidad de la animación

        return () => clearInterval(typingInterval); // Limpieza al desmontar
    }, [index, isOpen, arrayText]);
    return (
        <span className="animate-bg-animation">
            {displayText}
        </span>
    );
};

export default AnimatedCta;