import { cn } from "../utils/cn";

interface EllipsisProps {
  children: string;
  // 移除 maxWidth 参数
  className?: string;
}

const Ellipsis: React.FC<EllipsisProps> = ({ children, className }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // 使用 ResizeObserver 自动检测尺寸变化
  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const observer = new ResizeObserver(() => {
        if (textRef.current) {
          let isOverflowing = false;
          // 多行截断检测逻辑
          isOverflowing =
            textRef.current.scrollHeight > textRef.current.clientHeight;
          setShowTooltip(isOverflowing);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []); // 添加依赖项

  return (
    <span
      ref={containerRef}
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      <span ref={textRef} className={cn("overflow-hidden line-clamp-1")}>
        {children}
      </span>
      {isHovering && showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50">
          {children}
          <div className="absolute left-1/2 -bottom-1.5 w-3 h-3 bg-gray-800 transform -translate-x-1/2 rotate-45"></div>
        </div>
      )}
    </span>
  );
};

export default Ellipsis;
