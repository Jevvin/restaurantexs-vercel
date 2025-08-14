// components/city/ClientComponents/FaqAccordion.tsx

"use client"

import * as Accordion from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FaqItem {
  number: number
  question: string
  answer: string
}

interface Props {
  faqs: FaqItem[]
}

export default function FaqAccordion({ faqs }: Props) {
  return (
    <Accordion.Root type="multiple" className="w-full">
      {faqs.map((faq) => (
        <Accordion.Item
          key={faq.number}
          value={`faq-${faq.number}`}
          className="border-b border-gray-200"
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                "flex w-full items-center justify-between py-4 text-left font-semibold text-gray-900 hover:text-gray-700 transition-colors",
                "focus:outline-none"
              )}
            >
              <span>
                {faq.number}. {faq.question}
              </span>
              <ChevronDown
                className="h-5 w-5 text-gray-500 transition-transform duration-200 accordion-chevron"
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className={cn(
              "overflow-hidden text-gray-700 transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
            )}
          >
            <div className="pb-4">{faq.answer}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
