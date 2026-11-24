import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { activityImage } from '../../features/activities/activityData';

export default function ActivityCard({ card, href, onClick, preview = false }) {
  const content = (
    <article className="flex h-full flex-col bg-[#e5eee8] p-4 font-kanit transition-[background-color,box-shadow,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/activity:-translate-y-2 group-hover/activity:bg-[#06232b] group-hover/activity:shadow-[0_18px_32px_rgba(6,35,43,0.26)] group-focus-visible/activity:-translate-y-2 group-focus-visible/activity:bg-[#06232b] group-focus-visible/activity:shadow-[0_18px_32px_rgba(6,35,43,0.26)] motion-reduce:transition-none lg:p-5">
      {card.image && <img src={activityImage(card.image)} alt={card.alt || card.title} className="w-full aspect-square object-cover object-center" />}
      <div className="flex flex-1 flex-col px-2 pb-2 pt-6">
        <h3 className="font-semibold text-2xl text-[#1b2425] leading-tight tracking-tight whitespace-pre-line transition-colors duration-300 group-hover/activity:text-white group-focus-visible/activity:text-white">{card.title}</h3>
        <div className="mt-4 flex flex-1 items-end gap-6">
          <p className="min-w-0 flex-1 self-start text-sm leading-relaxed text-[#515b57] transition-colors duration-[650ms] ease-in-out group-hover/activity:text-[#e5eee8] group-focus-visible/activity:text-[#e5eee8] motion-reduce:transition-none">{card.description}</p>
          <ArrowUpRight aria-hidden="true" className="shrink-0 text-[#6f7974] transition-[color,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/activity:-translate-y-1 group-hover/activity:translate-x-1 group-hover/activity:text-[#a4cf86] group-focus-visible/activity:-translate-y-1 group-focus-visible/activity:translate-x-1 group-focus-visible/activity:text-[#a4cf86] motion-reduce:transition-none" size={44} />
        </div>
      </div>
    </article>
  );
  return preview ? <div className="group/activity h-full">{content}</div> : <Link to={href} onClick={onClick} aria-label={`Explore ${card.title}`} className="group/activity block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#224229]">{content}</Link>;
}
