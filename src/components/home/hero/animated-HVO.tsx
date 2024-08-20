import { useState, useEffect } from 'react';

export interface IanimatedFlickerHVO {
    arrayText: {
        text: string;
        highlight?: boolean;
    }[]
    isDeleting?: boolean;
}

const AnimatedFlickerHVO = ({ arrayText, isDeleting }: IanimatedFlickerHVO) => {
    return (
        <span className="animate-bg-animation fade-in-50 zoom-in-125 transition-all   ">
            {arrayText.map((text, idx) => (
                <span key={idx} className={text.highlight ? 'text-cerulean-400' : ''}>
                    {text.text}
                </span>
            ))}
        </span>
    );
};

export default AnimatedFlickerHVO;


