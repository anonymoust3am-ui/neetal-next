'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { CounsellingApiOption, CounsellingApiBody } from '@/lib/api';

export interface CounsellingSelection {
  counselling: CounsellingApiOption;
  body: CounsellingApiBody;
}

interface CounsellingContextValue {
  selection: CounsellingSelection | null;
  setSelection: (s: CounsellingSelection) => void;
}

const CounsellingContext = createContext<CounsellingContextValue>({
  selection: null,
  setSelection: () => {},
});

export function CounsellingProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<CounsellingSelection | null>(null);
  return (
    <CounsellingContext.Provider value={{ selection, setSelection }}>
      {children}
    </CounsellingContext.Provider>
  );
}

export function useCounselling() {
  return useContext(CounsellingContext);
}
