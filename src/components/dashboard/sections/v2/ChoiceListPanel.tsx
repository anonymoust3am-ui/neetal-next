import { Heart, Plus } from 'lucide-react';

const SAVED_LISTS = [
  { id: 1, name: 'AIIMS Target', date: 'Apr 10, 2026', count: 12, active: false },
  { id: 2, name: 'Safe Govt Colleges', date: 'Apr 15, 2026', count: 8, active: false },
  { id: 3, name: 'South Zone Preferences', date: 'Apr 20, 2026', count: 24, active: false },
  { id: 4, name: 'Dream Tier', date: 'Apr 22, 2026', count: 5, active: false },
  { id: 5, name: 'Backup Options', date: 'Apr 24, 2026', count: 15, active: false },
  { id: 6, name: 'Deemed Universities', date: 'Apr 24, 2026', count: 6, active: false },
];

export default function ChoiceListPanel() {
  return (
    <div className="flex flex-col w-80 h-[500px] bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
      
      {/* Sticky Header */}
      <div className="p-5 border-b border-border bg-surface shrink-0">
        <h2 className="text-base font-bold text-foreground">Choice Lists</h2>
      </div>

      {/* Scrollable List Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {SAVED_LISTS.map((list) => (
          <button
            key={list.id}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${
              list.active
                ? 'bg-primary-light/30 border border-primary/20'
                : 'hover:bg-muted border border-transparent'
            }`}
          >
            {/* Heart Icon Wrapper */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              list.active 
                ? 'bg-primary/10 text-primary' 
                : 'bg-background border border-border text-foreground-subtle group-hover:text-rose-500 group-hover:border-rose-200 group-hover:bg-rose-50'
            }`}>
              <Heart size={15} className={list.active ? 'fill-primary/20' : ''} />
            </div>

            {/* List Details */}
            <div className="flex-1 min-w-0">
              <p className={`text-s font-semibold truncate ${
                list.active ? 'text-primary' : 'text-foreground group-hover:text-foreground'
              }`}>
                {list.name}
              </p>
              
              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-foreground-subtle">
                <span>{list.date}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="font-medium">{list.count} items</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Sticky Footer Action */}
      <div className="p-4 border-t border-border bg-surface shrink-0">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 hover:shadow-md transition-all active:scale-[0.98]">
          <Plus size={16} strokeWidth={2.5} />
          Create New List
        </button>
      </div>
      
    </div>
  );
}