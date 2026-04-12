import { Card, CardHeader, CardTitle } from "@components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@components/ui/carousel";

import AutoScroll from "embla-carousel-auto-scroll"

export interface HeroProjectItem {
  id: string;
  img: string;
  img_alt?: string;
}

interface HeroCarrouselProps {
  projects: HeroProjectItem[];
  direction?: "forward" | "backward";
  speed?: number;
}

export default function HeroCarrousel({ projects, direction, speed }: HeroCarrouselProps) {

  return (
    <Carousel
      opts={{
        align: "center",
        dragFree: false,
        loop: true,

      }}
      draggable={false}
      plugins={[
        AutoScroll({
          stopOnInteraction: false,
          stopOnMouseEnter: false,
          stopOnFocusIn: false,
          speed: speed,
          startDelay: 50,
        }),
      ]}
      className="w-full "
    >
      <CarouselContent className="" >
        {projects.map((project, index) => {
          return (
            <>
              <CarouselItem key={index} className="   basis-10/12  md:basis-1/2 lg:basis-3/12  ">
                <div className="p-1 h-full">
                  <Card className="overflow-hidden h-full  ">
                    <CardHeader className="p-0">
                      <img className="aspect-[14/10]" src={project.img} alt={project.img_alt} width={1000} height={714} />
                    </CardHeader>

                  </Card>
                </div>

              </CarouselItem>
              <CarouselItem key={index + 1} className="   basis-10/12  md:basis-1/2 lg:basis-3/12  ">
                <div className="p-1 h-full">
                  <Card className="overflow-hidden h-full  ">
                    <CardHeader className="p-0">
                      <img className="aspect-[14/10]" src={project.img} alt={project.img_alt} width={1000} height={714} />
                    </CardHeader>

                  </Card>
                </div>

              </CarouselItem>
            </>


          );
        })}

      </CarouselContent>


    </Carousel>
  );
}
