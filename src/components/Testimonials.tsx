"use client";

import { Star, Quote } from "lucide-react";
import { useEffect, useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";

const testimonials = [
  {
    name: "Priya Sharma",
    college: "AIIMS Delhi - MBBS",
    rank: "AIR 156",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote:
      "The college predictor was incredibly accurate and saved me so much time during counselling.",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    college: "JIPMER Puducherry - MBBS",
    rank: "AIR 423",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote:
      "The expert counselling support made everything simple and stress-free.",
    rating: 5,
  },
  {
    name: "Sneha Reddy",
    college: "GMC Mumbai - MBBS",
    rank: "AIR 892",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote:
      "The cutoff tracking feature is insanely useful and super accurate.",
    rating: 5,
  },
  {
    name: "Rahul Kumar",
    college: "AFMC Pune - MBBS",
    rank: "AIR 1245",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote:
      "I was surprised by how accurate the AI suggestions were.",
    rating: 5,
  },
];

export function Testimonials() {
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const centerColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const leftAnimationRef = useRef(0);
  const centerAnimationRef = useRef(0);
  const rightAnimationRef = useRef(0);

  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const leftColumn = leftColumnRef.current;
    const centerColumn = centerColumnRef.current;
    const rightColumn = rightColumnRef.current;
    
    if (!leftColumn || !centerColumn || !rightColumn) return;

    let leftPosition = 0;
    let centerPosition = -200;
    let rightPosition = 0;
    
    const cardHeight = 280;
    const totalHeight = testimonials.length * cardHeight;

    const animateLeft = () => {
      leftPosition -= 0.15;
      
      if (Math.abs(leftPosition) >= totalHeight) {
        leftPosition = 0;
      }
      
      leftColumn.style.transform = `translateY(${leftPosition}px)`;
      leftAnimationRef.current = requestAnimationFrame(animateLeft);
    };

    const animateCenter = () => {
      centerPosition += 0.15;
      
      if (centerPosition >= 0) {
        centerPosition = -totalHeight;
      }
      
      centerColumn.style.transform = `translateY(${centerPosition}px)`;
      centerAnimationRef.current = requestAnimationFrame(animateCenter);
    };

    const animateRight = () => {
      rightPosition -= 0.15;
      
      if (Math.abs(rightPosition) >= totalHeight) {
        rightPosition = 0;
      }
      
      rightColumn.style.transform = `translateY(${rightPosition}px)`;
      rightAnimationRef.current = requestAnimationFrame(animateRight);
    };

    leftAnimationRef.current = requestAnimationFrame(animateLeft);
    centerAnimationRef.current = requestAnimationFrame(animateCenter);
    rightAnimationRef.current = requestAnimationFrame(animateRight);

    return () => {
      cancelAnimationFrame(leftAnimationRef.current);
      cancelAnimationFrame(centerAnimationRef.current);
      cancelAnimationFrame(rightAnimationRef.current);
    };
  }, []);

  return (
    <section className="py-24 bg-gradient-to-br from-primary-light/30 via-accent-light/30 to-primary-light/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <AnimatedTitle className="text-4xl md:text-5xl font-bold text-foreground mb-3" text="What Our Students Say" />
          <p className="text-foreground-muted text-lg">
            Real students. Real results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative min-h-[600px]">
          
          <div className="hidden md:block relative h-[600px] overflow-hidden rounded-lg">
            <div 
              ref={leftColumnRef}
              className="absolute inset-0 space-y-4 will-change-transform"
              style={{ transform: 'translateY(0px)' }}
            >
              {duplicatedTestimonials.map((t, index) => (
                <div 
                  key={`left-${index}`} 
                  className="bg-card backdrop-blur-sm border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
                      <img 
                        src={t.image} 
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground text-sm truncate">{t.name}</div>
                      <div className="text-xs text-foreground-muted truncate">{t.college}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-foreground-muted text-xs leading-relaxed line-clamp-2 mb-2">
                    "{t.quote}"
                  </p>
                  
                  <div className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                    {t.rank}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary-light/30 to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary-light/30 to-transparent pointer-events-none z-10"></div>
          </div>

          <div className="relative h-[600px] overflow-hidden rounded-lg md:col-span-1">
            <div 
              ref={centerColumnRef}
              className="absolute inset-0 space-y-4 will-change-transform"
              style={{ transform: 'translateY(-200px)' }}
            >
              {duplicatedTestimonials.map((t, index) => (
                <div 
                  key={`center-${index}`} 
                  className="bg-card backdrop-blur-sm border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-300 relative"
                >
                  <Quote className="absolute top-3 right-3 w-5 h-5 text-primary/30" />
                  
                  <div className="flex flex-col">
                    <p className="text-foreground-muted text-xs leading-relaxed line-clamp-3 mb-3 pr-6">
                      "{t.quote}"
                    </p>

                    <div className="flex gap-0.5 mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-border"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-xs truncate">
                        {t.name}
                      </h4>
                      <p className="text-[10px] text-foreground-muted truncate">
                        {t.college}
                      </p>
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3 text-[10px] font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {t.rank}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary-light/30 via-primary-light/30 to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-light/30 via-primary-light/30 to-transparent pointer-events-none z-10"></div>
          </div>

          <div className="hidden md:block relative h-[600px] overflow-hidden rounded-lg">
            <div 
              ref={rightColumnRef}
              className="absolute inset-0 space-y-4 will-change-transform"
              style={{ transform: 'translateY(0px)' }}
            >
              {duplicatedTestimonials.map((t, index) => (
                <div 
                  key={`right-${index}`} 
                  className="bg-card backdrop-blur-sm border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-border">
                      <img 
                        src={t.image} 
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground text-sm truncate">{t.name}</div>
                      <div className="text-xs text-foreground-muted truncate">{t.college}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-foreground-muted text-xs leading-relaxed line-clamp-2 mb-2">
                    "{t.quote}"
                  </p>
                  
                  <div className="inline-block bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
                    {t.rank}
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-primary-light/30 to-transparent pointer-events-none z-10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary-light/30 to-transparent pointer-events-none z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}