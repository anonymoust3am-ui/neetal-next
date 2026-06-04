import React from "react";
import { Star } from "lucide-react";

interface AvatarItem {
    src: string;
    alt: string;
    rotationClass: string;
}

const avatars: AvatarItem[] = [
    {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        alt: "Creator 1",
        rotationClass: "-rotate-3 hover:rotate-0"
    },
    {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        alt: "Creator 2",
        rotationClass: "rotate-2 hover:rotate-0"
    },
    {
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        alt: "Creator 3",
        rotationClass: "-rotate-1 hover:rotate-0"
    },
    {
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        alt: "Creator 4",
        rotationClass: "rotate-3 hover:rotate-0"
    },
    {
        src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
        alt: "Creator 5",
        rotationClass: "-rotate-2 hover:rotate-0"
    },
    {
        src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        alt: "Creator 6",
        rotationClass: "rotate-2 hover:rotate-0"
    }
];

export function SocialProof() {
    return (
        <div className="flex flex-col items-center justify-center bg-transparent py-8 px-4 select-none">
            {/* Top Row: Overlapping Avatars + Rating Stars */}
            <div className="flex flex-row items-center gap-4 md:gap-6 flex-wrap justify-center">
                
                {/* Stacked Avatar Group */}
                <div className="flex items-center -space-x-4 md:-space-x-5 pl-4">
                    {avatars.map((avatar, i) => (
                        <div
                            key={i}
                            className={`
                                relative w-10 h-10 md:w-12 md:h-12
                                rounded-[22px] overflow-hidden 
                                border-[3px] border-white bg-zinc-800 
                                shadow-lg transition-transform duration-200 ease-out cursor-pointer
                                transform ${avatar.rotationClass} hover:scale-110 hover:z-30
                            `}
                            style={{ zIndex: i + 10 }}
                        >
                            <img
                                src={avatar.src}
                                alt={avatar.alt}
                                className="w-full h-full object-cover pointer-events-none"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

            </div>

            {/* 5-Star Rating Icons */}
                <div className="flex pt-4 items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                        <Star 
                            key={index} 
                            size={24} 
                            className="fill-[#FFAA00] stroke-[#FFAA00] drop-shadow-[0_2px_4px_rgba(255,170,0,0.2)] md:w-7 md:h-7" 
                        />
                    ))}
                </div>

            {/* Bottom Row: Descriptive Subtext */}
            <p className="mt-4 text-foreground-muted text-sm md:text-base font-medium tracking-wide text-center max-w-xs md:max-w-none">
                Trusted by 27,000+ Students
            </p>
        </div>
    );
}