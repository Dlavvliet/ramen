import { useState } from 'react';
import './Accordion.css';

function AccordionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
      <div className="faq-question">
        <span>{question}</span>
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </div>
      <div className="faq-answer">
        <p>{answer}</p>
      </div>
    </div>
  );
}

export default function Accordion({ title = 'Частые вопросы', items }) {
  return (
    <div className='faqSection'>
      <h4 className='faqTitle'>{title}</h4>
      <div className='faqList'>
        {items.map((item, index) => (
          <AccordionItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
  );
}