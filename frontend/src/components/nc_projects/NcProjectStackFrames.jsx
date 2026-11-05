import aqua1 from '../../assets/nc_home/aqua1.png';
import aqua2 from '../../assets/nc_home/aqua2.png';
import gallery1 from '../../assets/nc_home/gallery1.png';
import gallery2 from '../../assets/nc_home/gallery2.png';
import gallery3 from '../../assets/nc_home/gallery3.png';
import { resolveAssetUrl } from '../../utils/assetResolver';
import ScrollCardStack from '../../animations/ScrollCardStack';

const DEFAULT_IMAGES = [aqua1, aqua2, gallery1, gallery2, gallery3];

const resolveImg = (image) => {
  const src = typeof image === 'object' ? image?.src : image;
  if (typeof src !== 'string' || !src.trim()) return null;
  if (/^(data:|blob:|\/assets\/|\/src\/|\/@fs\/)/.test(src)) return src;
  return resolveAssetUrl(src, aqua1);
};

const NcProjectStackFrames = ({ images, project }) => {
  const rawImages = Array.isArray(project?.galleryImages) && project.galleryImages.length > 0
    ? project.galleryImages
    : images;
  const resolvedImages = Array.isArray(rawImages) ? rawImages.map(resolveImg).filter(Boolean) : [];
  const imageList = resolvedImages.length > 0 ? resolvedImages : DEFAULT_IMAGES;

  return (
    <section
      aria-label={`${project?.title || 'Project'} gallery`}
      className="w-full bg-white text-zinc-900 py-10 sm:py-14 md:py-16 px-6 sm:px-12 md:px-16 lg:px-24 font-kanit"
    >
      <div className="w-full max-w-5xl mx-auto">
        <ScrollCardStack>
          {imageList.map((src, index) => (
            <figure
              key={`${src}-${index}`}
              className="relative w-full h-[320px] sm:h-[450px] md:h-[540px] lg:h-full lg:aspect-[1024/620] overflow-hidden rounded-xs border border-zinc-200 shadow-xl bg-zinc-100"
            >
              <img
                src={src}
                alt={`${project?.title || 'Project'} — gallery image ${index + 1} of ${imageList.length}`}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </figure>
          ))}
        </ScrollCardStack>
      </div>
    </section>
  );
};

export default NcProjectStackFrames;
