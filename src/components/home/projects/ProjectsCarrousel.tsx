import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";
import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";

import Autoplay from "embla-carousel-autoplay"
import ClassNames from 'embla-carousel-class-names'


const projects = (await getCollection("projects")).sort(
  (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
);

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/previews/*.{jpeg,jpg,png,gif}"
);
console.log(images);

const projectImagesResolved = await Promise.all(projects.map( async (project) => {
  const previewImg = images[`${project.data.img}`];
  const img = await previewImg();
  return {
    ...project,
    img: img.default.src,
    img_w: img.default.width,
    img_h: img.default.height,
  };
}));


export default function ProjectsCarrousel() {
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,

      }}
      plugins={[
         Autoplay({
           delay: 3000,
         }),
        ClassNames( {
          snapped: 'is-snapped',
          active: true,
        })
      ]}
      className="w-full  "
    >
      <CarouselContent  >
        {projectImagesResolved.map((project, index) => {
          return (
            <CarouselItem key={index} className="  [&:not(.is-snapped)]:opacity-20 basis-10/12  md:basis-1/2 lg:basis-2/5  ">
              <div className="p-1 h-full">
                <a href={`/projects/${project.slug}`}>
                <Card  className="overflow-hidden h-full  ">
                  <CardHeader className="p-0">
                    <img className="aspect-[14/10]" src={project.img} alt={project.data.img_alt} width={1000} height={714} />
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2   p-6">
                    <CardTitle className="text-3xl font-semibold truncate">
                      {project.data.title}
                    </CardTitle>
                    <CardDescription className="text-base line-clamp-2 ">
                      {project.data.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                </a>
              </div>

            </CarouselItem>
          );
        })}

      </CarouselContent>
      <CarouselPrevious className="-left-2 md:-left-8 lg:-left-12 " />
      <CarouselNext className="-right-2 md:-right-8 lg:-right-12" />

    </Carousel>
  );
}
