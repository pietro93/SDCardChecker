import React, { useState } from 'react';
import { Device } from '../types/devices';
import { useFAQ } from '../hooks/useFAQ';

interface FAQSectionProps {
  device: Device | null;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ device }) => {
  const faqs = useFAQ(device);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!device || faqs.length === 0) {
    return null;
  }

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleExpanded(index)}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-lg text-gray-900">{faq.q}</h3>
              <span
                className={`ml-4 transition-transform ${
                  expandedIndex === index ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            {expandedIndex === index && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: faq.a }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
