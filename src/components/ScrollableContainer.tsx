import { memo, useRef, useState, useEffect, ReactNode } from "react";

interface ScrollableContainerProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
  theme?: string;
}

export const ScrollableContainer = memo(function ScrollableContainer({
  children,
  className = "",
  maxHeight = "max-h-96",
  theme = "dark",
}: ScrollableContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const checkScrollable = () => {
      const isScrollableContent =
        container.scrollHeight > container.clientHeight;
      setIsScrollable(isScrollableContent);
      setShowScrollHint(isScrollableContent);
    };

    // Check on mount
    checkScrollable();

    // Check on window resize
    window.addEventListener("resize", checkScrollable);

    // Check when content changes (using MutationObserver)
    const observer = new MutationObserver(checkScrollable);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      window.removeEventListener("resize", checkScrollable);
      observer.disconnect();
    };
  }, []);

  // Hide hint when user scrolls
  const handleScroll = () => {
    setShowScrollHint(false);
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className={`${maxHeight} overflow-y-auto ${className}`}
        onScroll={handleScroll}
      >
        {children}
      </div>

      {/* Scroll Indicator - appears at bottom if content is scrollable */}
      {isScrollable && showScrollHint && (
        <div
          className={`absolute bottom-0 left-0 right-0 h-12 pointer-events-none bg-gradient-to-t ${
            theme === "dark"
              ? "from-gray-900 via-gray-900/70 to-transparent"
              : "from-white via-white/70 to-transparent"
          } transition-opacity duration-500`}
        >
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1">
            {/* Scroll indicator text */}
            <span
              className={`text-xs font-medium opacity-70 ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {typeof window !== "undefined" && navigator.language.startsWith("th")
                ? "เลื่อนเพื่อดูเพิ่มเติม"
                : "Scroll to see more"}
            </span>

            {/* Animated chevron down */}
            <svg
              className="w-4 h-4 animate-bounce opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                color: theme === "dark" ? "#9ca3af" : "#4b5563",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
});
