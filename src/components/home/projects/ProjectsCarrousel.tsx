import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@components/ui/carousel";

import Autoplay from "embla-carousel-autoplay"
import ClassNames from 'embla-carousel-class-names'

export interface ProjectItem {
  id: string;
  img: string;
  img_alt?: string;
  title: string;
  description: string;
}

interface ProjectsCarrouselProps {
  projects: ProjectItem[];
}

export default function ProjectsCarrousel({ projects }: ProjectsCarrouselProps) {
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}

      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: false,
        }),

        ClassNames({
          snapped: 'is-snapped',
          active: true,
        })
      ]}
      className="w-full  "
    >
      <CarouselContent  >
        {projects.map((project, index) => {
          return (
            <CarouselItem key={index} className="[&:not(.is-snapped)]:opacity-20 basis-10/12  md:basis-1/2 lg:basis-3/12  ">
              <div className="p-1 h-full">
                <a href={`/projects/${project.id}`}>
                  <Card className="overflow-hidden h-full  ">
                    <CardHeader className="p-0">
                      <img className="aspect-[14/10]" loading="lazy" decoding="async" src={project.img} alt={project.img_alt} width={425} height={303} />
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2   p-6">
                      <CardTitle className="text-3xl font-semibold truncate">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-base line-clamp-2 ">
                        {project.description}
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
