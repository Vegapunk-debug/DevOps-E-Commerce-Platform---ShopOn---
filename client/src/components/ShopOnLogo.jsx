export default function ShopOnLogo({ width = 32, height = 32, className = "" }) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M9 2H21L14 11H21L3 22L10 13H3L9 2Z" 
        fill="currentColor" 
      />
    </svg>
  );
}
