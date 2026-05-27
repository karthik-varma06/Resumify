import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";
import { motion } from "framer-motion";

const ScoreBadge = ({ score }: { score: number }) => {
  const isGood = score > 69;
  const isWarn = score > 39 && score <= 69;
  
  return (
      <div
          className={cn(
              "flex flex-row gap-1.5 items-center px-3 py-1 rounded-full border shadow-sm",
              isGood
                  ? "bg-badge-green"
                  : isWarn
                      ? "bg-badge-yellow"
                      : "bg-badge-red"
          )}
      >
        {isGood ? (
           <svg className="w-4 h-4 text-badge-green-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        ) : (
           <svg className="w-4 h-4 text-badge-yellow-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
        )}
        <p
            className={cn(
                "text-sm font-bold",
                isGood
                    ? "text-badge-green-text"
                    : isWarn
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-3">
        <p className="text-xl font-bold text-primary">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
      <div className="flex flex-col gap-6 w-full pt-2 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((tip, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex flex-row gap-3 items-center px-4 py-3 rounded-xl border shadow-sm",
                  tip.type === "good" ? "bg-badge-green" : "bg-badge-yellow"
                )} 
                key={index}
              >
                {tip.type === "good" ? (
                   <svg className="w-5 h-5 flex-shrink-0 text-badge-green-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                   <svg className="w-5 h-5 flex-shrink-0 text-badge-yellow-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                )}
                <p className={cn("text-sm font-medium", tip.type === "good" ? "text-badge-green-text" : "text-badge-yellow-text")}>{tip.tip}</p>
              </motion.div>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index * 0.1) + 0.2 }}
                  key={index + tip.tip}
                  className="flex flex-col gap-3 rounded-2xl p-5 border shadow-sm bg-card border-border"
              >
                <div className="flex flex-row gap-3 items-start">
                  <div className={cn("mt-1 p-1 rounded-full border border-border/50 shadow-sm", tip.type === "good" ? "bg-badge-green" : "bg-badge-yellow")}>
                    {tip.type === "good" ? (
                       <svg className="w-4 h-4 text-badge-green-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                       <svg className="w-4 h-4 text-badge-yellow-text" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className={cn("text-lg font-bold", tip.type === "good" ? "text-badge-green-text" : "text-badge-yellow-text")}>{tip.tip}</p>
                    <p className="text-secondary leading-relaxed">{tip.explanation || "No explanation provided."}</p>
                  </div>
                </div>
              </motion.div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full bg-card rounded-3xl border border-border shadow-sm p-4 md:p-6">
        <Accordion className="w-full">
          <AccordionItem id="tone-style" className="border-border">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback.toneAndStyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback.toneAndStyle.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content" className="border-border">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback.content.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback.content.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure" className="border-border">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback.structure.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback.structure.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills" className="border-transparent">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback.skills.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback.skills.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;
