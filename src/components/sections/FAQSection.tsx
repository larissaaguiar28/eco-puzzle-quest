import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    q: "O que é sustentabilidade ambiental?",
    a: "É a capacidade de utilizar os recursos naturais de forma consciente, garantindo que as gerações futuras também possam usufruir deles. Envolve práticas de preservação, reciclagem e uso eficiente de energia.",
  },
  {
    q: "Como posso contribuir para a sustentabilidade no dia a dia?",
    a: "Você pode separar o lixo para reciclagem, economizar água e energia, usar transporte público ou bicicleta, reduzir o consumo de plásticos descartáveis e apoiar empresas com práticas sustentáveis.",
  },
  {
    q: "Quais são os maiores problemas ambientais atualmente?",
    a: "Os principais são: mudanças climáticas, desmatamento, poluição dos oceanos, perda de biodiversidade, escassez hídrica e uso excessivo de agrotóxicos.",
  },
  {
    q: "O que são energias renováveis?",
    a: "São fontes de energia que se regeneram naturalmente, como solar, eólica, hidrelétrica, biomassa e geotérmica. Elas produzem menos poluição comparadas aos combustíveis fósseis.",
  },
  {
    q: "Como funciona o sistema de quizzes do site?",
    a: "Cada seção do site possui um quiz com 1 pergunta sobre o conteúdo apresentado. Ao acertar, você ganha uma peça do quebra-cabeça do Planeta Terra. Completando todas as 6 peças, você recebe uma mensagem especial de parabéns!",
  },
  {
    q: "O que posso fazer para reduzir minha pegada de carbono?",
    a: "Reduza o consumo de carne, evite viagens aéreas desnecessárias, prefira produtos locais, plante árvores, invista em energia renovável e pratique o consumo consciente.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-extrabold text-foreground mb-8 text-center"
        >
          Dúvidas Frequentes
        </motion.h2>

        <Accordion type="single" collapsible className="space-y-2">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <AccordionItem value={`faq-${i}`} className="shadow rounded-lg bg-card border border-border px-4">
                <AccordionTrigger className="text-left text-foreground font-medium">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
