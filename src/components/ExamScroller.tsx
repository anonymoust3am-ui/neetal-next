'use client';

type Exam = {
  name: string;
  date: string;
};

interface Props {
  exams: Exam[];
  speed?: number; // lower = slower
}

export default function ExamScroller({ exams, speed = 20 }: Props) {
  const loopData = [...exams, ...exams];

  return (
    <div className="relative w-full overflow-hidden pt-4">
      {/* Edge fade */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10" />

      <div className="group overflow-hidden">
        <div
          className="flex w-max gap-4 animate-scroll"
          style={{
            animationDuration: `${speed}s`,
          }}
        >
          {loopData.map((exam, index) => (
            <div
              key={index}
              className="
                flex items-center gap-3 
                min-w-[220px] flex-shrink-0 
                rounded-lg 
                border border-primary-light 
                bg-primary-light 
                px-4 py-2 
                shadow-sm 
                hover:shadow-md 
                transition-all
              "
            >
              <span className="h-2 w-2 rounded-full bg-primary" />

              <span className="text-sm font-medium text-primary whitespace-nowrap">
                {exam.name}
              </span>

              <span className="text-primary/70 text-xs">•</span>

              <span className="text-xs text-primary/80 whitespace-nowrap">
                {exam.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}