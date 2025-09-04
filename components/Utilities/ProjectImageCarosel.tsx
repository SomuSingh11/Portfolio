"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";

import { type CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface ProjectImageCarouselProps {
  images: string[];
  projectName: string;
}

export function ProjectImageCarousel({
  images,
  projectName,
}: ProjectImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleDotClick = (index: number) => {
    api?.scrollTo(index);
  };

  if (!images || images.length === 0) {
    return <div>No images available.</div>;
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-800">
                <Image
                  src={src}
                  alt={`${projectName} screenshot ${index + 1}`}
                  width={1280}
                  height={720}
                  className="w-full h-full object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Show controls only if there is more than one image */}
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
          </>
        )}
      </Carousel>

      {/* Custom Dot Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-4 bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
