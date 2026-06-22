// components/SeoKeywords.tsx

import { seoKeywords } from "@/lib/seo";


export default function SeoKeywords() {
  return (
    <div
      className="sr-only"
      aria-label="Medical admission keywords"
    >
      {seoKeywords.join(", ")}
    </div>
  );
}