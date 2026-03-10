export default function DonutSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="donut-spinner" />
    </div>
  );
}
