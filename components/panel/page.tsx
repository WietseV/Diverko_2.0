type PanelProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Panel({ children, className }: PanelProps) {
  return (
    <div
      className={`rounded-3xl border border-primary_dark/10 bg-primary_light p-6 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
