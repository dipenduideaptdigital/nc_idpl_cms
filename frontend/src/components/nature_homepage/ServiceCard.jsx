import DOMPurify from 'dompurify';

export default function ServiceCard({ service, index }) {
  return (
    <article className="relative w-full overflow-hidden shadow-xl bg-[#06232b] lg:aspect-[1.9/1] lg:h-full">
      <div className="relative h-[240px] sm:h-[300px] lg:absolute lg:inset-0 lg:h-full overflow-hidden">
        <img
          src={service.image}
          alt={service.title || 'Service'}
          decoding="async"
          className={'absolute inset-0 w-full h-full object-cover object-left-top ' + (index === 2 ? 'lg:w-[78%]' : '')}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_35%_0%,transparent_35%,rgba(6,35,43,0.35)_65%,#06232b_100%)] lg:bg-[radial-gradient(ellipse_75%_90%_at_8%_50%,rgba(6,35,43,0.05)_25%,rgba(6,35,43,0.12)_48%,rgba(6,35,43,0.6)_70%,#06232b_92%)] pointer-events-none" />
      </div>

      <div className="relative z-10 px-6 pb-8 sm:px-8 lg:py-8 lg:px-0 lg:absolute lg:inset-y-0 lg:right-[8%] lg:w-[32%] flex flex-col justify-center text-white">
        <div className="font-outfit text-4xl sm:text-5xl lg:text-[clamp(36px,3vw,48px)] leading-none font-normal text-right mb-6 lg:mb-8">
          {service.number || `0${index + 1}`}
        </div>
        <h3 className="font-outfit text-xl sm:text-2xl lg:text-[clamp(18px,1.9vw,32px)] lg:w-[125%] lg:-ml-[25%] lg:whitespace-nowrap font-semibold leading-tight text-right uppercase mb-5 lg:mb-6">
          {service.title}
        </h3>
        <div
          className="font-outfit text-base sm:text-lg lg:text-[clamp(16px,1.5vw,20px)] font-normal leading-[1.3] text-left [&>p]:m-0"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}
        />
      </div>
    </article>
  );
}
