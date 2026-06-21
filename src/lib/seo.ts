export const SITE_URL = 'https://neetell.in';
export const SITE_NAME = 'Neetell';
export const SITE_LOGO = `${SITE_URL}/logo-outline.png`;
export const OG_ONE = `${SITE_URL}/og-one.png`;
export const OG_TWO = `${SITE_URL}/og-two.png`;

export const socialProfileUrls = [
  'https://www.instagram.com/neetell/',
  'https://www.facebook.com/NEETell/',
  'https://neetellblog.quora.com/',
  'https://x.com/NEETell_India',
];

export const siteDescription =
  'Neetell helps NEET aspirants make smarter counselling decisions with rank-aware college prediction, cutoff trends, fees, bonds, seat matrix, AIQ and state counselling guidance, and choice filling tools.';

export const seoKeywords = [
  'Neetell',
  'NEET counselling',
  'NEET UG counselling',
  'NEET PG counselling',
  'NEET 2026 counselling',
  'NEET college predictor',
  'NEET rank predictor',
  'medical college predictor',
  'MBBS college predictor',
  'NEET cutoff',
  'NEET closing rank',
  'NEET seat matrix',
  'AIQ counselling',
  'state quota counselling',
  'MCC counselling',
  'medical college fees',
  'MBBS fees',
  'medical college bond',
  'choice filling',
  'NEET choice filling strategy',
  'government medical colleges',
  'private medical colleges',
  'deemed medical colleges',
  'AIIMS cutoff',
  'JIPMER cutoff',
  'NEET admission guidance',
];

export const faqItems = [
  {
    question: 'What is Neetell?',
    answer:
      'Neetell is a NEET counselling intelligence platform that helps students explore medical colleges, compare fees and bonds, study cutoff trends, and plan AIQ and state counselling choices.',
  },
  {
    question: 'Does Neetell help with NEET UG and NEET PG counselling?',
    answer:
      'Neetell is built for NEET counselling workflows, including college discovery, cutoff analysis, rank-aware prediction, choice filling, and counselling guidance for medical admissions.',
  },
  {
    question: 'Can I find medical colleges based on my NEET rank?',
    answer:
      'Yes. Neetell includes rank-aware tools to help students identify realistic safe, target, and dream college options using historical cutoff and counselling data.',
  },
  {
    question: 'What data can I compare for medical colleges?',
    answer:
      'You can compare key decision factors such as fees, seat matrix, cutoff trends, bond requirements, college type, state, quota, and other counselling parameters.',
  },
  {
    question: 'Is Neetell a replacement for official counselling websites?',
    answer:
      'No. Neetell helps students understand and plan counselling decisions, but students should always verify final dates, eligibility, allotments, and notices on official counselling authority websites.',
  },
];

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: SITE_LOGO,
  email: 'support@neetell.in',
  description: siteDescription,
  sameAs: socialProfileUrls,
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: siteDescription,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/dashboard/colleges?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'NEET Counselling Guidance Program',
  description:
    'A structured counselling guidance program for NEET aspirants covering rank-based college prediction, cutoff trends, fees, bonds, seat matrix, AIQ and state counselling, and choice filling strategy.',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    sameAs: SITE_URL,
  },
  educationalLevel: 'Medical entrance counselling',
  audience: {
    '@type': 'EducationalAudience',
    educationalRole: 'student',
  },
};

export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ],
};

const ratingValue = process.env.NEXT_PUBLIC_SCHEMA_RATING_VALUE;
const reviewCount = process.env.NEXT_PUBLIC_SCHEMA_REVIEW_COUNT;

export const reviewJsonLd =
  ratingValue && reviewCount
    ? {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Neetell NEET Counselling Guidance',
        serviceType: 'NEET counselling guidance and college prediction',
        provider: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
        areaServed: {
          '@type': 'Country',
          name: 'India',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue,
          reviewCount,
          bestRating: '5',
          worstRating: '1',
        },
      }
    : null;

export const rootJsonLd = [
  organizationJsonLd,
  websiteJsonLd,
  faqJsonLd,
  courseJsonLd,
  breadcrumbJsonLd,
  ...(reviewJsonLd ? [reviewJsonLd] : []),
];
