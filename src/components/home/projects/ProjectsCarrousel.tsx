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

const projects = (await getCollection("projects")).sort(
  (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
);

const images = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/*/*.{jpeg,jpg,png,gif}"
);
console.log(images);

const projectImagesResolved = await Promise.all(projects.map( async (project) => {
  const preview = images[`${project.data.img}`];
  const img = await preview();
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
      }}
      className="w-full "
    >
      <CarouselContent >

        {projectImagesResolved.map((project, index) => {


          return (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3  ">
              <div className="p-1">

                <Card className="overflow-hidden ">
                  <CardHeader className="p-0">
                    <img className="aspect-[14/10]" src={project.img} alt={project.data.img_alt} width={700} height={500} />
                  </CardHeader>
                  <CardContent className="flex flex-col  aspect-video gap-2   p-6">
                    <CardTitle className="text-3xl font-semibold">
                      {project.data.title}
                    </CardTitle>
                    <CardDescription className="text-base line-clamp-3 ">
                      {project.data.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}

      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
