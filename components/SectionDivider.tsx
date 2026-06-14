export default function SectionDivider() {
  return (
    <div className="my-10 md:my-16 max-w-md mx-auto px-4 flex items-center justify-center gap-3">
      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80"></div>
      <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
    </div>
  );
}
