import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
    alt: "Mountain lake landscape",
  },
  {
    image: "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
    alt: "City street at sunset",
  },
  {
    image: "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
    alt: "Forest path with sunlight",
  },
  {
    image: "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
    alt: "Cozy interior room",
  },
];

export default function CaroCart() {
  const [activeSlide, setActiveSlide] = useState(0);

  const showNextSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === slides.length - 1 ? 0 : currentSlide + 1
    );
  };

  useEffect(() => {
    const intervalId = setInterval(showNextSlide, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const showPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? slides.length - 1 : currentSlide - 1
    );
  };

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-box md:h-96">
      {slides.map((slide, index) => (
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.alt}
          aria-hidden={activeSlide !== index}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            activeSlide === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
        <button
          type="button"
          onClick={showPreviousSlide}
          className="btn btn-circle"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          onClick={showNextSlide}
          className="btn btn-circle"
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
