import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import SEOHead from '../components/shared/SEOHead';

const questions = [
  {
    question: 'What is the difference between an aquarium and a terrarium?',
    answer: 'An aquarium is an underwater environment for aquatic plants and animals. A terrarium is a planted land environment, usually in a glass container. A paludarium combines land and water. The right choice depends on your space, the conditions you can provide, and the kind of living landscape you enjoy.',
  },
  {
    question: 'Can I have a living ecosystem in a small space?',
    answer: 'Yes. A compact planted aquarium or terrarium can suit a smaller space. Before choosing one, consider the available light, a stable supporting surface, access for maintenance, and any power requirements. Share your space with our team so we can discuss a suitable setup.',
  },
  {
    question: 'How much maintenance does a planted aquarium need?',
    answer: 'Maintenance depends on the size, planting, equipment, and livestock. Typical care includes checking water conditions, changing some of the water, cleaning the glass and filter, and trimming plants. We can help you understand the routine for the setup you choose.',
  },
  {
    question: 'Do I need experience to get started?',
    answer: 'You can start as a beginner. Choosing a setup that suits your space and the time you can give it makes a difference. Our team can guide you through the essentials of lighting, planting, and ongoing care before you begin.',
  },
  {
    question: 'Can NatureCube design a setup for my home or workplace?',
    answer: 'We offer design consultation, production and setup, and maintenance support for living landscapes. Tell us about your space, your ideas, and your budget so we can discuss the possibilities and the next steps.',
  },
  {
    question: 'How can I find out about workshops and Prakriti LAB?',
    answer: 'Visit Prakriti LAB on our website to explore its activities and upcoming events. For availability, participation details, or a group enquiry, contact our team before planning your visit.',
  },
];

export default function FAQ() {
  return (
    <>
      <SEOHead data={{ title: 'Frequently Asked Questions', metaDescription: 'Answers to common questions about NatureCube aquariums, terrariums, living landscapes, maintenance, and Prakriti LAB.' }} />
      <section className="min-h-[75vh] bg-white px-6 pb-[clamp(80px,8vw,128px)] pt-[clamp(56px,6vw,96px)] text-[#303632]" aria-labelledby="faq-heading" data-nav-theme="light">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)] items-start gap-[clamp(48px,7vw,112px)] max-md:grid-cols-1 max-md:gap-9">
          <div>
            <p className="mb-[22px] text-xs font-semibold tracking-[0.18em] text-[#517d32]">QUESTIONS, ANSWERED</p>
            <h1 id="faq-heading" className="m-0 text-[clamp(36px,3.4vw,52px)] font-semibold leading-[1.12] tracking-[-0.04em]">A little clarity.<br />A living start.</h1>
            <p className="mt-6 max-w-[340px] text-base leading-[1.7] text-[#687068]">Practical answers to help you bring a little more nature into your space.</p>
            <Link className="mt-8 inline-block text-sm text-[#517d32] underline-offset-[5px] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844]" to="/contact">Have another question? Get in touch <span aria-hidden="true">↗</span></Link>
          </div>
          <div>
            {questions.map(({ question, answer }, index) => (
              <details className="group border-b border-[#dfe6dc]" key={question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden max-md:gap-4 max-md:py-[23px] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844]">
                  <h2 className="m-0 text-[17px] font-medium leading-[1.5] group-hover:text-[#517d32]">{question}</h2>
                  <Plus className="shrink-0 text-[#6ca844] transition-transform duration-[180ms] group-open:rotate-45 motion-reduce:transition-none" size={22} aria-hidden="true" />
                </summary>
                <div className="pb-7 pr-[46px] text-base leading-[1.8] text-[#687068] max-md:pr-0">
                  <p className="m-0">{answer}</p>
                  {index === questions.length - 1 && <Link className="mt-3 inline-block text-[#517d32] underline-offset-[5px] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844]" to="/prakriti-lab">Explore Prakriti LAB</Link>}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
