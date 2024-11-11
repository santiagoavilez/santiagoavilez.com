import { Card, CardHeader } from "@components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@components/ui/carousel";

import Autoplay from "embla-carousel-autoplay"
import AutoScroll from "embla-carousel-auto-scroll"

import ClassNames from 'embla-carousel-class-names'







interface BrandsCarrouselProps {
    brands: {
        src: string;
        alt?: string;
        width: number;
        height: number;
    }[]
    direction?: 'forward' | 'backward'
}


export default function bCarrousel({ brands, direction }: BrandsCarrouselProps) {

    return (
        <Carousel
            opts={{
                align: "center",
                loop: true,

            }}
            plugins={[
                AutoScroll({
                    playOnInit: true,
                    speed: 1,
                    direction: direction,
                    stopOnInteraction: false,
                    stopOnFocusIn: false,
                    stopOnMouseEnter: true,
                }),

                ClassNames({
                    snapped: 'is-snapped',
                    active: false,
                })
            ]}
            className="w-full  "
        >
            <CarouselContent  >
                {brands.map((brand, index) => {
                    return (
                        <CarouselItem key={index} className="flex basis-4/12 justify-center md:basis-3/12 ">
                            <div className="p-1 h-full flex items-center">
                                <img className="md:h-16 md:w-auto " src={brand.src} alt={brand.alt} width={brand.width} height={brand.height} />
                            </div>

                        </CarouselItem>
                    );
                })}
            </CarouselContent>

        </Carousel>
    );
}
