import { useState, useEffect } from 'react';

export interface IanimatedCta {
    arrayText: {
        text: string;
        highlight?: boolean;
    }[]
    isDeleting?: boolean;
}

const AnimatedCta = ({ arrayText , isDeleting }: IanimatedCta) => {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState<JSX.Element[]>([]);
    const [typingSymbolVisible, setTypingSymbolVisible] = useState(true);




    useEffect(() => {
        let i = 0; // index for the current character
        let typingInterval;

        if (!isDeleting) {
            typingInterval = setInterval(() => {
                if (i < arrayText[index].text.length) {
                    setDisplayText((prev) => [
                        ...prev.filter((_, idx) => idx !== prev.length - 1), // Remove the last element (typing symbol) before adding a new letter
                        <span key={`${index}-${i}`} className={arrayText[index].highlight ? 'text-cerulean-400  ' : ''}>
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


                        }// reset the index for the next word
                    }, 35); // adjust this value to control the speed of the animation
                }
            }, 20); // adjust this value to control the speed of the animation

            return () => clearInterval(typingInterval); // adjust this value to control the speed of the animation
        } else {
            typingInterval = setInterval(() => {
                if (displayText.length > 0) {
                    setDisplayText((prev) => prev.slice(0, -2));

                    setDisplayText((prev) => [
                        ...prev, // Remove the last element (typing symbol) before adding a new letter

                        <span key={`${index}-typing-symbol`} className="typing-symbol animate-pulse dark:text-gray-50 text-gray-900">|  </span> // Add the typing symbol at the end
                    ]);
                } else {
                    clearInterval(typingInterval);
                    if (index < arrayText.length - 1) {
                        setIndex(index + 1); // Move to the next word
                    } else {
                        setIndex(0); // Restart from the first word
                    }
                }
            }, 25); // adjust this value for deletion speed
        }

        return () => clearInterval(typingInterval); // cleanup the interval
    }, [index, arrayText, isDeleting]);
    return (
        <span className="animate-bg-animation">
            {displayText}
        </span>
    );
};

export default AnimatedCta;


