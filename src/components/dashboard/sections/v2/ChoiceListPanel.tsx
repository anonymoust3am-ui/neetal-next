'use client';

import { useEffect, useState } from 'react';
import { Heart, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getChoiceLists } from '@/lib/api';
import type { ChoiceListSummary } from '@/lib/api';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ChoiceListPanel() {
  const { firebaseUser } = useAuth();
  const [lists, setLists]     = useState<ChoiceListSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser) { setLoading(false); return; }
    firebaseUser.getIdToken()
      .then(token => getChoiceLists(token, { limit: 20 }))
      .then(r => setLists(r.choiceLists))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [firebaseUser]);

  return (
    <div className="flex flex-col w-80 h-[500px] bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-5 border-b border-border bg-surface shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Choice Lists</h2>
          {lists.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-light text-primary">
              {lists.length}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1" style={{ scrollbarWidth: 'thin' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={18} className="animate-spin text-foreground-subtle" />
          </div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Heart size={22} className="text-foreground-subtle mb-2" />
            <p className="text-xs font-semibold text-foreground-muted">No lists yet</p>
            <p className="text-[10px] text-foreground-subtle mt-0.5">Create a choice list to get started</p>
          </div>
        ) : (
          lists.map(list => (
            <button
              key={list.id}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group border border-transparent hover:bg-muted hover:border-border"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-background border border-border text-foreground-subtle group-hover:text-rose-500 group-hover:border-rose-200 group-hover:bg-rose-50 transition-colors">
                <Heart size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-s font-semibold truncate text-foreground">{list.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-foreground-subtle">
                  <span>{formatDate(list.createdAt)}</span>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="font-medium">{list.detailsCount} items</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-surface shrink-0">
        <button className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 hover:shadow-md transition-all active:scale-[0.98]">
          <Plus size={16} strokeWidth={2.5} />
          Create New List
        </button>
      </div>
    </div>
  );
}
