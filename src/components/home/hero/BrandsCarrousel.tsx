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
}


export default function bCarrousel({ brands }: BrandsCarrouselProps) {
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
                    direction: 'backward',

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
                        <CarouselItem key={index} className=" flex justify-center basis-10/12  md:basis-1/2 lg:basis-3/12 w-auto ">
                            <div className="p-1 h-full w-fit flex items-center">
                                <img className="" src={brand.src} alt={brand.alt} width={brand.width} height={brand.height} />
                            </div>

                        </CarouselItem>
                    );
                })}
            </CarouselContent>

        </Carousel>
    );
}
