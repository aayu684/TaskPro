import React, { useState, useRef, useEffect, ButtonHTMLAttributes } from 'react';

interface Sparkle {
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
}

interface InteractiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const colors = ['#f1c40f', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71', '#ffffff'];

export default function InteractiveButton({ children, className = '', onClick, ...props }: InteractiveButtonProps) {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newSparkles: Sparkle[] = [];
            for (let i = 0; i < 8; i++) {
                newSparkles.push({
                    id: Date.now() + i,
                    x: x + (Math.random() - 0.5) * 40,
                    y: y + (Math.random() - 0.5) * 40,
                    size: Math.random() * 10 + 5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }

            setSparkles((prev) => [...prev, ...newSparkles]);
        }

        if (onClick) {
            onClick(e);
        }
    };

    useEffect(() => {
        if (sparkles.length > 0) {
            const timer = setTimeout(() => {
                setSparkles((prev) => prev.slice(8));
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [sparkles]);

    return (
        <button
            ref={buttonRef}
            onClick={handleClick}
            className={`relative overflow-hidden group ${ className }`}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {sparkles.map((sparkle) => (
                <span
                    key={sparkle.id}
                    className="sparkle pointer-events-none"
                    style={{
                        left: sparkle.x,
                        top: sparkle.y,
                        width: sparkle.size,
                        height: sparkle.size,
                        background: sparkle.color,
                        boxShadow: `0 0 ${ sparkle.size * 2 }px ${ sparkle.color }`
                    }}
                />
            ))}
            {/* Glossy overlay effect built into button */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-inherit"></div>
        </button>
    );
}
