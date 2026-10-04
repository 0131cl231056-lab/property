import { useState, useEffect } from "react"; 
import useProperty from "../../property/hook/useProperty";
import { formatPrice } from "../../../utils/formatPrice";

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const HeroCarousel = () => {
  console.log("HeroCarousel Rendered");
  // const [active, setActive]   = useState(0);
  // const [paused, setPaused]   = useState(false);
  // const timerRef              = useRef(null);
  // const total                 = heroSlides.length;

  // // Auto-advance every 3s
  // useEffect(() => {
  //   if (paused) return;
  //   timerRef.current = setInterval(next, 3000);
  //   return () => clearInterval(timerRef.current);
  // }, [active, paused]);

  // const slide = heroSlides[active];

  const { handleGetAllProperties } = useProperty();

  const [heroSlides, setHeroSlides] = useState([]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
  console.log("useEffect Ran");
    async function fetchProperties() {
        try {
            const data = await handleGetAllProperties();

            console.log("API Response:", data);
            console.log("Success:", data.success);
            console.log("Properties:", data.properties);
            console.log(data)

            if (data.success) {
                setHeroSlides(data.properties.slice(0, 5));
            }
        } catch (err) {
            console.log(err);
        }
    }

    fetchProperties();
}, []);

useEffect(() => {
    if (paused || heroSlides.length === 0) return;

    const timer = setInterval(() => {
        setActive(prev => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(timer);
}, [paused, heroSlides]);


  const total = heroSlides.length;
  const slide = heroSlides[active];

  if (total === 0) {
    return (
        <section className="lp-hero">
          console.log("heroSlides:", heroSlides);
console.log("length:", heroSlides.length);
            <h2 style={{ color: "white", textAlign: "center" }}>
                Loading...
            </h2>
        </section>
    );
}

  

const goTo = (idx) => setActive((idx + total) % total);
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);



  return (
    <section
      className="lp-hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Property showcase carousel"
    >
      {/* Slides */}
      {heroSlides.map((s, i) => (
        <div key={s._id} className={`lp-hero__slide${i === active ? ' active' : ''}`}>
          <img
            src={s.propertyImages?.[0]}
            alt={s.title}
            className="lp-hero__img"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="lp-hero__overlay" />
        </div>
      ))}

      {/* Info overlay */}
      <div className="lp-hero__info" aria-live="polite">
        <div className="lp-hero__label">
    {slide.category}
</div>

<h1 className="lp-hero__title">
    {slide.title}
</h1>
        <div className="lp-hero__summary">

    <div className="lp-price"> 
    {formatPrice(slide.price)}
</div>

    <div className="lp-location">
        📍 {slide.city}
    </div>

    <div className="lp-features">
        {slide.bedrooms} BHK •
        {slide.bathrooms} Bath •
        {slide.area} sqft
    </div>

</div>
      </div>

      {/* Arrows */}
      <div className="lp-hero__arrows">
        <button className="lp-hero__arrow" onClick={prev} aria-label="Previous slide">
          <ChevronLeft />
        </button>
        <button className="lp-hero__arrow" onClick={next} aria-label="Next slide">
          <ChevronRight />
        </button>
      </div>

      {/* Dots */}
      <div className="lp-hero__dots" role="tablist" aria-label="Carousel indicators">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`lp-hero__dot${i === active ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            role="tab"
            aria-selected={i === active}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
