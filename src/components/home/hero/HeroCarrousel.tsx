import { Card, CardHeader, CardTitle } from "@components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@components/ui/carousel";
import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";

import AutoScroll from "embla-carousel-auto-scroll"



const projects = (await getCollection("projects")).sort(
  (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
);

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/previews/*.{jpeg,jpg,png,gif}"
);
console.log(images);

const projectImagesResolved = await Promise.all(projects.map(async (project) => {
  const previewImg = images[`${project.data.img}`];
  const img = await previewImg();
  return {
    ...project,
    img: img.default.src,
    img_w: img.default.width,
    img_h: img.default.height,
  };
}));

interface HeroCarrouselProps {
  direction?: "forward" | "backward";
  speed?: number;
}

export default function HeroCarrousel({ direction, speed }: HeroCarrouselProps) {

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
        {projectImagesResolved.map((project, index) => {
          return (
            <>
              <CarouselItem key={index} className="   basis-10/12  md:basis-1/2 lg:basis-3/12  ">
                <div className="p-1 h-full">
                  <Card className="overflow-hidden h-full  ">
                    <CardHeader className="p-0">
                      <img className="aspect-[14/10]" src={project.img} alt={project.data.img_alt} width={1000} height={714} />
                    </CardHeader>

                  </Card>
                </div>

              </CarouselItem>
              <CarouselItem key={index + 1} className="   basis-10/12  md:basis-1/2 lg:basis-3/12  ">
                <div className="p-1 h-full">
                  <Card className="overflow-hidden h-full  ">
                    <CardHeader className="p-0">
                      <img className="aspect-[14/10]" src={project.img} alt={project.data.img_alt} width={1000} height={714} />
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
