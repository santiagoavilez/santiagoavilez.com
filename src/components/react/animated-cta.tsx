import { useState, useEffect } from 'react';

export interface IanimatedCta {
    arrayText: {
        text: string;
        highlight?: boolean;
    }[]
}

const AnimatedCta = ({ arrayText }: IanimatedCta) => {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState<JSX.Element[]>([]);
    const [typingSymbolVisible, setTypingSymbolVisible] = useState(true);



    useEffect(() => {
        let i = 0; //index for the current word
        const typingInterval = setInterval(() => {
            if (i < arrayText[index].text.length) {
                setDisplayText((prev) => [
                    ...prev.filter((_, idx) => idx !== prev.length - 1), // Remove the last element (typing symbol) before adding a new letter
                    <span key={`${index}-${i}`} className={arrayText[index].highlight ? 'dark:text-[#3E88CF] text-[#3E88CF]/70 ' : ''}>
                        {arrayText[index].text[i]}
                    </span>,
                    <span key={`${index}-typing-symbol`} className="typing-symbol animate-pulse dark:text-gray-50 text-gray-900">|  </span> // Add the typing symbol at the end
                ]);
                i++;
            } else {
                clearInterval(typingInterval);
                // wait for a while and then start the next word
                setDisplayText((prev) => prev.filter((_, idx) => idx !== prev.length - 1)); // Remove the typing symbol after finishing typing

                setTimeout(() => {
                    if (index < arrayText.length - 1) {
                        setIndex(index + 1); // update the index to the next word
                    } else {
                        // optional: restart the animation
                        // setIndex(0);
                        // setDisplayText([]); // clean the display text
                    }
                    i = 0; // reset the index for the next word
                }, 35); // adjust this value to control the speed of the animation
            }
        }, 35); // adjust this value to control the speed of the animation

        return () => clearInterval(typingInterval); // cleanup the interval
    }, [index,  arrayText]);
    return (
        <span className="animate-bg-animation">
            {displayText}
        </span>
    );
};

export default AnimatedCta;