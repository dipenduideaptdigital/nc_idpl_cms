import { AnimatePresence, LazyMotion, domAnimation } from 'motion/react';
import * as m from 'motion/react-m';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DOMPurify from 'dompurify';
import CarouselSlide from '../../animations/CarouselSlide';
import useTimedCarousel from '../../animations/useTimedCarousel';
import bush3 from '../../assets/nc_logo/bush3.png';

const imageVariants = {
  enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%' }),
  visible: { x: '0%' },
  exit: (direction) => ({ x: direction > 0 ? '-100%' : '100%' }),
};

export default function PrakritiTestimonialCarousel({ testimonials, getAssetUrl }) {
  const { frameRef, index, direction, reduceMotion, select, previous, next, frameEvents } = useTimedCarousel(testimonials.length);
  const current = testimonials[index];

  if (!current) return null;

  return (
    <div
      ref={frameRef}
      {...frameEvents}
      role="region"
      aria-roledescription="carousel"
      aria-label="Prakriti Lab testimonials"
      className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
    >
      <div className="lg:col-span-6 flex justify-center lg:justify-start">
        <div className="bg-white p-4 sm:p-5 rounded-xs shadow-2xl border border-zinc-200/80 w-full max-w-[420px]">
          <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden rounded-xs bg-zinc-100 mb-3">
            <LazyMotion features={domAnimation} strict>
              <AnimatePresence initial={false} custom={direction}>
                <m.img
                  key={index}
                  custom={direction}
                  src={current.image ? getAssetUrl(current.image) : undefined}
                  alt={current.name || 'Workshop participant'}
                  decoding="async"
                  variants={imageVariants}
                  initial={reduceMotion ? false : 'enter'}
                  animate="visible"
                  exit={reduceMotion ? { x: 0 } : 'exit'}
                  transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </AnimatePresence>
            </LazyMotion>
          </div>
          <div className="grid">
            {testimonials.map((item, itemIndex) => (
              <CarouselSlide key={itemIndex} active={itemIndex === index}>
                <span className="font-caveat text-xl sm:text-2xl text-zinc-800 font-medium tracking-wide block px-1">
                  {item.batch}
                </span>
              </CarouselSlide>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 relative flex flex-col justify-between space-y-6 pt-4 lg:pt-0">
        <div className="absolute -top-16 -left-12 sm:-top-20 sm:-left-16 w-[320px] sm:w-[400px] aspect-square pointer-events-none z-0">
          <img src={bush3} alt="" className="w-full h-full object-contain object-left-top opacity-50 filter brightness-105" />
        </div>

        {/* Overlapping grid cells reserve the tallest entry so text and controls stay in place. */}
        <div className="relative z-10 grid">
          {testimonials.map((item, itemIndex) => (
            <CarouselSlide key={itemIndex} active={itemIndex === index}>
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="font-kanit font-bold text-3xl sm:text-4xl text-[#1E293B] leading-tight whitespace-pre-line">
                    {item.name}
                  </h3>
                  <span className="font-kanit text-xs font-semibold tracking-widest text-[#555555] uppercase block pt-1">
                    {item.location}
                  </span>
                </div>
                <div
                  className="font-sans text-sm sm:text-base text-zinc-500 font-normal leading-relaxed max-w-md tiptap-content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.text || '') }}
                />
              </div>
            </CarouselSlide>
          ))}
        </div>

        {testimonials.length > 1 && (
          <div className="relative z-10 flex items-start justify-between gap-6 pt-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous testimonial"
                className="w-11 h-11 sm:w-12 sm:h-12 border border-zinc-300 bg-transparent text-[#555555] flex items-center justify-center hover:border-[#7BA641] hover:bg-[#7BA641] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7BA641] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="w-11 h-11 sm:w-12 sm:h-12 border border-zinc-300 bg-transparent text-[#555555] flex items-center justify-center hover:border-[#7BA641] hover:bg-[#7BA641] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7BA641] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col items-end gap-1 font-serif text-sm font-semibold tracking-widest">
              {testimonials.map((_, itemIndex) => (
                <button
                  key={itemIndex}
                  type="button"
                  onClick={() => select(itemIndex, itemIndex < index ? -1 : 1)}
                  aria-label={`Show testimonial ${itemIndex + 1}`}
                  aria-current={itemIndex === index ? 'true' : undefined}
                  className={`italic cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7BA641] ${itemIndex === index ? 'text-[#7BA641] font-bold text-base' : 'text-zinc-400 hover:text-zinc-600 text-sm'}`}
                >
                  {String(itemIndex + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
