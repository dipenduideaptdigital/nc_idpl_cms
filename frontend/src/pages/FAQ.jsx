import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { faqsApi } from '../api/faqs';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import SEOHead from '../components/shared/SEOHead';

export default function FAQ() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [hoveredQuestion, setHoveredQuestion] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

const openQuestion = hoveredQuestion ?? activeQuestion;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError('');
    faqsApi.getPublicFaqs(controller.signal)
      .then(result => { if (active) setCategories(result.data || []); })
      .catch(() => { if (active) setError('Unable to load FAQs. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [attempt]);


  const handleQuestionEnter = (event, id) => {
    if (event.pointerType === 'mouse') {
      setHoveredQuestion(id);
    }
  };

  const handleQuestionLeave = () => {
    setHoveredQuestion(null);
  };

  const handleQuestionClick = (id) => {
    setHoveredQuestion(null);
    setActiveQuestion(prev => prev === id ? null : id);
  };

  const safeAnswer = answer =>
    DOMPurify.sanitize(typeof answer === 'string' ? answer : '');
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: categories.flatMap(category => category.questions.map(item => ({
        '@type': 'Question', name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: safeAnswer(item.answer) },
      }))),
    };
  return (
    <>
      <SEOHead data={{ title: 'Frequently Asked Questions', metaDescription: 'Answers to common questions about NatureCube aquariums, terrariums, living landscapes, maintenance, and Prakriti LAB.' }} />
      {!loading && !error && faqSchema.mainEntity.length > 0 && <Helmet><script type="application/ld+json">{JSON.stringify(faqSchema).replace(/</g, '\\u003c')}</script></Helmet>}
      <section className="min-h-[75vh] bg-white px-6 pb-[clamp(80px,8vw,128px)] pt-[clamp(56px,6vw,96px)] text-[#303632]" aria-labelledby="faq-heading" data-nav-theme="light">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[minmax(0,0.85fr)_minmax(0,1.55fr)] items-start gap-[clamp(48px,7vw,112px)] max-md:grid-cols-1 max-md:gap-9">
          <div>
            <p className="mb-[22px] text-xs font-semibold tracking-[0.18em] text-[#517d32]">
              FREQUENTLY ASKED QUESTIONS (FAQ)
            </p>
            <h1 id="faq-heading" className="m-0 text-[clamp(36px,3.4vw,52px)] font-semibold leading-[1.12] tracking-[-0.04em]">A little clarity.<br />A living start.</h1>
            <p className="mt-6 max-w-[340px] text-base leading-[1.7] text-[#687068]">Practical answers to help you bring a little more nature into your space.</p>
            <Link className="mt-8 inline-block text-sm text-[#517d32] underline-offset-[5px] hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6ca844]" to="/contact">Have another question? Get in touch <span aria-hidden="true">↗</span></Link>
          </div>
          <div>
            {loading && <p role="status" className="py-7 text-[#687068]">Loading frequently asked questions...</p>}
            {!loading && error && <div role="alert" className="py-7 text-[#687068]">{error} <button type="button" className="text-[#517d32] underline" onClick={() => setAttempt(n => n + 1)}>Retry</button></div>}
            {!loading && !error && !categories.length && <p className="py-7 text-[#687068]">No frequently asked questions are available yet.</p>}
            {!loading && !error && categories.flatMap(category =>
              category.questions
            ).map(item => {
              const isOpen = openQuestion === item.id;

              return (
                <div
                  key={item.id}
                  onPointerEnter={(event) =>
                    handleQuestionEnter(event, item.id)
                  }
                  onPointerLeave={handleQuestionLeave}
                  className={`
                    group border-b border-[#dfe6dc]
                    transition-colors duration-300
                    ${isOpen ? 'bg-[#f5f8f2]' : 'bg-transparent'}
                  `}
                >
                  {/* Question */}
                  <h2 className="m-0">
                    <button
                      id={`faq-question-${item.id}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      onClick={() => handleQuestionClick(item.id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                          setHoveredQuestion(null);
                          setActiveQuestion(null);
                          event.currentTarget.focus();
                        }
                      }}
                      className="
                        flex w-full cursor-pointer items-center
                        justify-between gap-6 px-4 py-7 text-left
                        max-md:gap-4 max-md:px-3 max-md:py-[23px]
                        focus-visible:rounded-sm
                        focus-visible:outline-2
                        focus-visible:outline-offset-[-2px]
                        focus-visible:outline-[#6ca844]
                      "
                    >
                      <span
                        className={`
                          m-0 text-[17px] font-medium leading-[1.5]
                          transition-colors duration-300
                          ${isOpen ? 'text-[#517d32]' : 'text-[#303632]'}
                        `}
                      >
                        {item.question}
                      </span>

                      <Plus
                        size={22}
                        aria-hidden="true"
                        className={`
                          shrink-0 text-[#6ca844]
                          transition-transform duration-300 ease-in-out
                          motion-reduce:transition-none
                          ${isOpen ? 'rotate-45' : 'rotate-0'}
                        `}
                      />
                    </button>
                  </h2>

                  {/* Animated Answer */}
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                    aria-hidden={!isOpen}
                    inert={!isOpen ? '' : undefined}
                    onFocusCapture={() => setActiveQuestion(item.id)}
                    className={`
                      grid
                      transition-[grid-template-rows,opacity]
                      duration-[400ms]
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      motion-reduce:transition-none
                      ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }
                    `}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div
                        className="
                          px-4 pb-7 pr-[46px]
                          text-base leading-[1.8] text-[#687068]
                          max-md:px-3
                        "
                      >
                        <div
                          className="
                            prose prose-sm max-w-none
                            prose-p:my-2
                            prose-a:text-[#517d32]
                            prose-a:underline
                            text-inherit
                          "
                          dangerouslySetInnerHTML={{
                            __html: safeAnswer(item.answer),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
