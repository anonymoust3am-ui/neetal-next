'use client';

import { useState, useEffect } from 'react';

function formatRank(n: any) {
  if (n === null || n === undefined || n === '' || Number.isNaN(Number(n))) return '-';
  return Number(n).toLocaleString('en-IN');
}

function escapeHtml(value: any) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function bucketLabel(bucket: string) {
  if (bucket === 'safe') return 'Safe';
  if (bucket === 'target') return 'Target';
  if (bucket === 'dream') return 'Dream';
  return 'Unknown';
}

interface PredictionResponse {
  success: boolean;
  data: any[];
  summary: any;
  mode: string;
  message?: string;
}

interface OptionsResponse {
  success: boolean;
  data: {
    rounds: Array<{ round_no: string; label: string }>;
    courses: Array<{ course_code: string }>;
    categories: Array<{ candidate_category_code: string }>;
    quotas: Array<{ quota_code: string }>;
    institutes?: Array<{ institute_name: string }>;
  };
  message?: string;
}

export default function PredictorPage() {
  const [inputMode, setInputMode] = useState<'marks' | 'rank'>('marks');
  const [currentScope, setCurrentScope] = useState('ai');
  const [marksInput, setMarksInput] = useState('');
  const [rankInput, setRankInput] = useState('');

  const [aiRoundSelect, setAiRoundSelect] = useState('');
  const [aiCourseSelect, setAiCourseSelect] = useState('');
  const [aiCategorySelect, setAiCategorySelect] = useState('');
  const [aiQuotaSelect, setAiQuotaSelect] = useState('');
  const [aiRangeSelect, setAiRangeSelect] = useState('25000');
  const [aiLimitInput, setAiLimitInput] = useState('30');

  const [stateRoundSelect, setStateRoundSelect] = useState('');
  const [stateCourseSelect, setStateCourseSelect] = useState('');
  const [stateCategorySelect, setStateCategorySelect] = useState('');
  const [stateQuotaSelect, setStateQuotaSelect] = useState('');
  const [stateInstituteSelect, setStateInstituteSelect] = useState('');
  const [stateRangeSelect, setStateRangeSelect] = useState('25000');
  const [stateLimitInput, setStateLimitInput] = useState('30');

  const [aiOptions, setAiOptions] = useState<OptionsResponse['data'] | null>(null);
  const [states, setStates] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [bucketFilter, setBucketFilter] = useState<string | null>(null);
  const [eyebrowText, setEyebrowText] = useState('NEET UG · Unified Predictor');
  const [subtitleText, setSubtitleText] = useState('Switch between All India MCC and State counsellings.');
  const [filterSubtitle, setFilterSubtitle] = useState('Select counselling type first');

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi NCR',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Puducherry', 'Punjab',
    'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  useEffect(() => {
    loadAiOptions();
  }, []);

  const loadAiOptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (aiRoundSelect) params.set('round_no', aiRoundSelect);
      if (aiCourseSelect) params.set('course_code', aiCourseSelect);
      if (aiCategorySelect) params.set('candidate_category_code', aiCategorySelect);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      const res = await fetch(`${baseUrl}/ai/options?${params.toString()}`);
      const json = (await res.json()) as OptionsResponse;

      if (!json.success) throw new Error(json.message || 'All India options failed.');
      setAiOptions(json.data);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadStateOptions = async (stateSlug: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (stateRoundSelect) params.set('round_no', stateRoundSelect);
      if (stateCourseSelect) params.set('course_code', stateCourseSelect);
      if (stateCategorySelect) params.set('candidate_category_code', stateCategorySelect);
      if (stateQuotaSelect) params.set('quota_code', stateQuotaSelect);
      if (stateInstituteSelect) params.set('institute_name', stateInstituteSelect);

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
      const res = await fetch(`${baseUrl}/state/${stateSlug}/options?${params.toString()}`);
      const json = (await res.json()) as OptionsResponse;

      if (!json.success) throw new Error(json.message || 'State options failed.');
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const switchScope = (scope: string) => {
    setCurrentScope(scope);
    setBucketFilter(null);

    if (scope === 'ai') {
      setEyebrowText('MCC All India · NEET UG');
      setSubtitleText('Uses imported MCC R1/R2/R3 All India allotment database.');
      setFilterSubtitle('Rank + round + category + quota');
      loadAiOptions();
    } else {
      const stateName = scope;
      setEyebrowText(`${stateName} · NEET UG`);
      setSubtitleText(`Unified prediction based on ${stateName} allotments.`);
      setFilterSubtitle('Rank + round + course + category + quota');
      loadStateOptions(scope);
    }
  };

  const resetFilters = () => {
    setMarksInput('');
    setRankInput('');

    if (currentScope === 'ai') {
      setAiCourseSelect('');
      setAiCategorySelect('');
      setAiQuotaSelect('');
      setAiRangeSelect('25000');
      setAiLimitInput('30');
      setPrediction(null);
      loadAiOptions();
    } else {
      setStateRoundSelect('');
      setStateCourseSelect('');
      setStateCategorySelect('');
      setStateQuotaSelect('');
      setStateInstituteSelect('');
      setStateRangeSelect('25000');
      setStateLimitInput('30');
      setPrediction(null);
      switchScope(currentScope);
    }
  };

  const predictColleges = async () => {
    let marks = marksInput;
    let rank = rankInput;

    if (inputMode === 'marks' && !marks) {
      alert('Please enter marks.');
      return;
    }

    if (inputMode === 'rank' && !rank) {
      alert('Please enter rank.');
      return;
    }

    setLoading(true);
    let url = '';
    let payload: any = {
      marks: inputMode === 'marks' ? marks : null,
      rank: inputMode === 'rank' ? rank : null,
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

      if (currentScope === 'ai') {
        url = `${baseUrl}/ai/predict`;
        payload = {
          ...payload,
          round_no: aiRoundSelect,
          course_code: aiCourseSelect,
          candidate_category_code: aiCategorySelect,
          quota_code: aiQuotaSelect,
          nearby_range: aiRangeSelect,
          limit: aiLimitInput,
        };
      } else {
        url = `${baseUrl}/state/${currentScope}/predict`;
        payload = {
          ...payload,
          round_no: stateRoundSelect,
          course_code: stateCourseSelect,
          candidate_category_code: stateCategorySelect,
          quota_code: stateQuotaSelect,
          institute_name: stateInstituteSelect,
          nearby_range: stateRangeSelect,
          limit: stateLimitInput,
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as PredictionResponse;

      if (!json.success) {
        throw new Error(json.message || 'Prediction failed.');
      }

      setPrediction(json);
      setBucketFilter(null);
      setLoading(false);
    } catch (error) {
      alert((error as Error).message);
      setLoading(false);
    }
  };

  const renderLoadingModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(15,23,42,0.3)] p-[48px_32px] text-center">
        <div className="w-[60px] h-[60px] border-[4px] border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-[24px]"></div>
        <h2 className="m-0 mb-[8px] text-[20px] font-bold text-slate-900">Loading options...</h2>
        <p className="m-0 text-slate-500 text-[14px]">Please wait while we fetch the filter options</p>
      </div>
    </div>
  );

  const renderWelcome = () => (
    <div className="bg-white/96 border border-slate-200 rounded-[24px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] p-[48px_32px] text-center flex flex-col items-center justify-center h-full max-[600px]:p-[48px_18px]">
      <div className="w-[74px] h-[74px] rounded-[24px] mx-auto mb-[18px] bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-[34px]">
        🎓
      </div>
      <h2 className="m-0 mb-[12px] text-[20px] font-bold text-slate-900">Unified predictor ready</h2>
      <p className="m-0 text-slate-500 text-[14px] max-w-[340px] leading-[1.5]">
        Select counselling type: All India MCC or a State. The filter panel will change automatically.
      </p>
    </div>
  );

  const renderLoading = () => (
    <div className="bg-white/96 border border-slate-200 rounded-[24px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] p-[48px_32px] text-center flex flex-col items-center justify-center h-full max-[600px]:p-[48px_18px]">
      <div className="w-[42px] h-[42px] border-[4px] border-slate-200 border-t-blue-600 rounded-full animate-spin mb-[24px]"></div>
      <h2 className="m-0 mb-[12px] text-[20px] font-bold text-slate-900">Loading...</h2>
      <p className="m-0 text-slate-500 text-[14px] max-w-[340px] leading-[1.5] font-[900]">
        Generating college-wise prediction from MongoDB...
      </p>
    </div>
  );

  const renderResults = () => {
    if (!prediction || !prediction.data || !prediction.data.length) {
      return (
        <div className="bg-white/96 border border-slate-200 rounded-[24px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] p-[48px_32px] text-center flex flex-col items-center justify-center h-full max-[600px]:p-[48px_18px]">
          <h2 className="m-0 mb-[12px] text-[20px] font-bold text-slate-900">No college cards found</h2>
          <p className="m-0 text-slate-500 text-[14px] max-w-[340px] leading-[1.5]">
            Try increasing rank range or reducing filters.
          </p>
        </div>
      );
    }

    const data = prediction.data;
    const summary = prediction.summary || {};
    const filteredData = bucketFilter ? data.filter((c: any) => c.bucket === bucketFilter) : data;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-[12px] mb-[16px] max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">
          <button
            onClick={() => setBucketFilter(null)}
            className={`cursor-pointer transition-all hover:scale-[1.02] bg-white/96 border ${
              !bucketFilter ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200'
            } rounded-[18px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] p-[16px] text-center max-[1100px]:col-span-2 max-[600px]:col-span-1`}
          >
            <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">Cards</span>
            <strong className="block mt-[5px] text-[24px] text-slate-900">{data.length}</strong>
          </button>
          <button
            onClick={() => setBucketFilter('safe')}
            className={`cursor-pointer transition-all hover:scale-[1.02] bg-white/96 border ${
              bucketFilter === 'safe' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200'
            } rounded-[18px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] p-[16px] text-center`}
          >
            <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">Safe</span>
            <strong className="block mt-[5px] text-[24px] text-emerald-600">{summary.safe || 0}</strong>
          </button>
          <button
            onClick={() => setBucketFilter('target')}
            className={`cursor-pointer transition-all hover:scale-[1.02] bg-white/96 border ${
              bucketFilter === 'target' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200'
            } rounded-[18px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] p-[16px] text-center`}
          >
            <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">Target</span>
            <strong className="block mt-[5px] text-[24px] text-amber-600">{summary.target || 0}</strong>
          </button>
          <button
            onClick={() => setBucketFilter('dream')}
            className={`cursor-pointer transition-all hover:scale-[1.02] bg-white/96 border ${
              bucketFilter === 'dream' ? 'border-violet-500 ring-2 ring-violet-500/10' : 'border-slate-200'
            } rounded-[18px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] p-[16px] text-center`}
          >
            <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">Dream</span>
            <strong className="block mt-[5px] text-[24px] text-violet-600">{summary.dream || 0}</strong>
          </button>
          <div className="bg-white/96 border border-slate-200 rounded-[18px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] p-[16px] text-center">
            <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">User rank</span>
            <strong className="block mt-[5px] text-[24px] text-slate-900">{formatRank(summary.userRank)}</strong>
          </div>
        </div>

        <div className="bg-white/80 border border-slate-200 rounded-[18px] p-[13px_16px] flex justify-between gap-[12px] mb-[14px] text-slate-500 font-[800] text-[13px]">
          <p className="m-0">
            <b className="text-blue-600 font-[900]">{escapeHtml(summary.title || 'Prediction')}</b> around rank{' '}
            <b className="text-slate-900 font-[900]">{formatRank(summary.userRank)}</b>{' '}
            {bucketFilter && <span>(Filtering by <b className="capitalize">{bucketFilter}</b>)</span>}
          </p>
          <p className="m-0">Evidence range: ±{formatRank(summary.nearbyRange || summary.rankRange)}</p>
        </div>

        <div className="grid gap-[14px]">
          {filteredData.map((college: any, idx: number) => (
            <CollegeCard key={idx} college={college} summary={summary} mode={prediction.mode} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col pt-12">
      {loading && renderLoadingModal()}
      <header className="px-8 py-4 pb-2 max-[600px]:px-[18px] max-[600px]:py-[14px] max-[600px]:pb-[4px]">
        <div className="mt-2 flex justify-between items-end gap-[18px]">
          <div>
            <h1 className="m-0 text-[34px] tracking-[-.045em] text-slate-900 font-bold">
              NEET UG <span className="text-blue-600">College Predictor</span>
            </h1>
            <p className="m-0 mt-[7px] text-slate-500 text-[14px]">{subtitleText}</p>
          </div>
        </div>
      </header>

      <main className={`flex-1 px-8 py-[18px] pb-8 grid grid-cols-[390px_1fr] gap-[20px] max-w-[1540px] w-full mx-auto min-h-0 max-[1100px]:grid-cols-1 max-[600px]:p-[14px] max-[600px]:pb-[18px] max-[600px]:px-[18px] transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <aside className="bg-white/95 border border-slate-200 rounded-[24px] shadow-[0_10px_28px_rgba(15,23,42,0.06)] overflow-hidden h-[calc(100vh-130px)] flex flex-col sticky top-[18px] max-[1100px]:h-auto max-[1100px]:static">
          <div className="p-[18px] border-b border-slate-200 bg-slate-50/85 flex justify-between items-center">
            <div>
              <h2 className="m-0 text-[15px] font-bold text-slate-900">Refine prediction</h2>
              <p className="m-0 mt-[3px] text-slate-500 text-[11px]">{filterSubtitle}</p>
            </div>
            <button
              onClick={resetFilters}
              className="bg-transparent border-0 text-slate-500 text-[12px] font-[900] cursor-pointer"
            >
              Reset
            </button>
          </div>

          <div className="p-[18px] overflow-y-auto flex-1">
            {/* Counselling Scope */}
            <div className="flex items-center gap-[8px] my-[5px] mb-[14px]">
              <span className="text-slate-400 text-[10px] font-mono font-[900]">00</span>
              <span className="flex-1 h-[1px] bg-slate-200"></span>
              <span className="text-[11px] font-[900] uppercase tracking-[.11em] text-slate-900">Counselling scope</span>
            </div>

            <div className="mb-[14px]">
              <label className="block mb-[6px] text-slate-500 text-[12px] font-[900]">Choose counselling</label>
              <select
                value={currentScope}
                onChange={e => switchScope(e.target.value)}
                disabled={loading}
                className="w-full h-[42px] rounded-[12px] border border-slate-300 bg-white text-slate-900 px-[12px] text-[14px] font-[750] outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2024%2024%22%20stroke=%22%2364748b%22%3E%3Cpath%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222.5%22%20d=%22M19%209l-7%207-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:14px] pr-[36px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="ai">All India MCC</option>
                {INDIAN_STATES.map(state => (
                  <option key={state} value={state.toLowerCase().replace(/\s+/g, '-')}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-[1px] bg-slate-200 my-[18px]"></div>

            {/* Your Score */}
            <div className="flex items-center gap-[8px] my-[5px] mb-[14px]">
              <span className="text-slate-400 text-[10px] font-mono font-[900]">01</span>
              <span className="flex-1 h-[1px] bg-slate-200"></span>
              <span className="text-[11px] font-[900] uppercase tracking-[.11em] text-slate-900">Your score</span>
            </div>

            <div className="grid grid-cols-2 bg-slate-100 rounded-[12px] p-[4px] gap-[4px] mb-[14px]">
              <button
                onClick={() => {
                  setInputMode('marks');
                  setRankInput('');
                }}
                disabled={loading}
                className={`border-0 rounded-[9px] h-[34px] text-[12px] font-[900] cursor-pointer ${
                  inputMode === 'marks'
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.08)]'
                    : 'bg-transparent text-slate-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Marks
              </button>
              <button
                onClick={() => {
                  setInputMode('rank');
                  setMarksInput('');
                }}
                disabled={loading}
                className={`border-0 rounded-[9px] h-[34px] text-[12px] font-[900] cursor-pointer ${
                  inputMode === 'rank'
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.08)]'
                    : 'bg-transparent text-slate-500'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Rank
              </button>
            </div>

            {inputMode === 'marks' && (
              <div className="mb-[14px]">
                <label className="block mb-[6px] text-slate-500 text-[12px] font-[900]">
                  Enter marks <span className="text-slate-400 font-normal">approx rank generated</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="720"
                  value={marksInput}
                  onChange={e => setMarksInput(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. 645"
                  className="w-full h-[42px] rounded-[12px] border border-slate-300 bg-white text-slate-900 px-[12px] text-[14px] font-[750] outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {inputMode === 'rank' && (
              <div className="mb-[14px]">
                <label className="block mb-[6px] text-slate-500 text-[12px] font-[900]">Enter NEET AIR rank</label>
                <input
                  type="number"
                  min="1"
                  value={rankInput}
                  onChange={e => setRankInput(e.target.value)}
                  disabled={loading}
                  placeholder="e.g. 45000"
                  className="w-full h-[42px] rounded-[12px] border border-slate-300 bg-white text-slate-900 px-[12px] text-[14px] font-[750] outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            <div className="h-[1px] bg-slate-200 my-[18px]"></div>

            {/* AI Filters */}
            <div id="aiFilters">
              <div className="flex items-center gap-[8px] my-[5px] mb-[14px]">
                <span className="text-slate-400 text-[10px] font-mono font-[900]">02</span>
                <span className="flex-1 h-[1px] bg-slate-200"></span>
                <span className="text-[11px] font-[900] uppercase tracking-[.11em] text-slate-900">All India filters</span>
              </div>

              <SelectInput label="Round" value={aiRoundSelect} onChange={setAiRoundSelect} options={aiOptions?.rounds || []} />
              <SelectInput label="Course" value={aiCourseSelect} onChange={setAiCourseSelect} options={aiOptions?.courses || []} />
              <SelectInput label="Candidate category" value={aiCategorySelect} onChange={setAiCategorySelect} options={aiOptions?.categories || []} />
              <SelectInput label="Quota" value={aiQuotaSelect} onChange={setAiQuotaSelect} options={aiOptions?.quotas || []} />

              <div className="mb-[14px]">
                <label className="block mb-[6px] text-slate-500 text-[12px] font-[900]">Nearby evidence range</label>
                <select
                  value={aiRangeSelect}
                  onChange={e => setAiRangeSelect(e.target.value)}
                  className="w-full h-[42px] rounded-[12px] border border-slate-300 bg-white text-slate-900 px-[12px] text-[14px] font-[750] outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2024%2024%22%20stroke=%22%2364748b%22%3E%3Cpath%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222.5%22%20d=%22M19%209l-7%207-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:14px] pr-[36px]"
                >
                  <option value="10000">±10K ranks</option>
                  <option value="25000">±25K ranks</option>
                  <option value="50000">±50K ranks</option>
                  <option value="100000">±100K ranks</option>
                </select>
              </div>

              <div className="mb-[14px]">
                <label className="block mb-[6px] text-slate-500 text-[12px] font-[900]">College card limit</label>
                <input
                  type="number"
                  min="5"
                  max="80"
                  value={aiLimitInput}
                  onChange={e => setAiLimitInput(e.target.value)}
                  className="w-full h-[42px] rounded-[12px] border border-slate-300 bg-white text-slate-900 px-[12px] text-[14px] font-[750] outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"
                />
              </div>
            </div>
          </div>

          <div className="p-[16px] border-t border-slate-200 bg-slate-50/90">
            <button
              onClick={predictColleges}
              disabled={loading}
              className="w-full border-0 h-[48px] rounded-[14px] bg-blue-600 text-white text-[14px] font-[950] cursor-pointer shadow-[0_10px_22px_rgba(37,99,235,0.23)] hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              ✨ Predict colleges →
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="space-y-4">{loading ? renderLoading() : !prediction ? renderWelcome() : renderResults()}</div>
        </section>
      </main>
    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: any[];
}) {
  return (
    <div className="mb-[14px]">
      <label className="block mb-[6px] text-slate-500 text-[12px] font-[900]">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-[42px] rounded-[12px] border border-slate-300 bg-white text-slate-900 px-[12px] text-[14px] font-[750] outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus:border-blue-600 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20fill=%22none%22%20viewBox=%220%200%2024%2024%22%20stroke=%22%2364748b%22%3E%3Cpath%20stroke-linecap=%22round%22%20stroke-linejoin=%22round%22%20stroke-width=%222.5%22%20d=%22M19%209l-7%207-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:14px] pr-[36px]"
      >
        <option value="">All {label}</option>
        {options.map((opt: any, idx: number) => {
          let displayValue = '';
          let optionValue = '';

          if (opt.round_no && opt.label) {
            // For rounds
            optionValue = opt.round_no;
            displayValue = opt.label;
          } else {
            // For courses, categories, quotas, institutes
            const key = Object.keys(opt).find(k => k.includes('code') || k.includes('name'));
            optionValue = key ? opt[key] : '';
            displayValue = optionValue;
          }

          return (
            <option key={idx} value={optionValue}>
              {displayValue}
            </option>
          );
        })}
      </select>
    </div>
  );
}

function CollegeCard({ college, summary, mode }: { college: any; summary: any; mode: string }) {
  const initials = (college.shortName || college.name || 'C')
    .split(' ')
    .filter((w: string) => w)
    .map((w: string) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  const name = college.name || 'Unknown College';
  const course = college.courseName || college.course || '-';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080';

  let image = college.image || 'linear-gradient(135deg, #2563eb 0%, #172554 100%)';
  // If image contains /data, extract path and prepend base URL
  if (college.image && college.image.includes('/data')) {
    const match = college.image.match(/url\('([^']+)'\)/);
    if (match && match[1]) {
      image = `url('${baseUrl}${match[1]}')`;
    } else if (college.image.startsWith('/data')) {
      image = `url('${baseUrl}${college.image}')`;
    }
  }

  let logoUrl = college.logoUrl;
  // If logoUrl is relative, prepend base URL
  if (logoUrl && logoUrl.startsWith('/data')) {
    logoUrl = `${baseUrl}${logoUrl}`;
  }

  const logoColor = college.logoColor || '#2563eb';

  const bucketBorders: Record<string, string> = {
    safe: 'border-emerald-400 shadow-[0_10px_28px_rgba(16,185,129,0.08)]',
    target: 'border-amber-400 shadow-[0_10px_28px_rgba(245,158,11,0.08)]',
    dream: 'border-violet-400 shadow-[0_10px_28px_rgba(139,92,246,0.08)]',
  };
  const activeBorder = (college?.bucket && bucketBorders[college.bucket]) || 'border-slate-200 shadow-[0_10px_28px_rgba(15,23,42,0.06)]';

  return (
    <article className={`bg-white/96 border-2 ${activeBorder} rounded-[24px] overflow-hidden transition-all duration-200 hover:translate-y-[-2px] hover:shadow-[0_14px_32px_rgba(15,23,42,0.1)]`}>
      <div className="flex max-[1100px]:flex-col">
        <div
          className="w-[220px] min-h-[275px] max-[1100px]:w-full max-[1100px]:min-h-[165px] text-white shrink-0 relative overflow-hidden bg-cover bg-center cover-pattern"
          style={{ background: image }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[105px] font-[950] text-white/10 select-none">
            {escapeHtml(initials[0] || 'C')}
          </div>

          <div className="absolute top-[13px] right-[13px] bg-white/95 rounded-full px-[11px] py-[6px] text-[12px] font-[950]" style={{ color: logoColor }}>
            ● {bucketLabel(college.bucket)}
          </div>

          <div className="absolute bottom-[14px] left-[14px] right-[14px] flex items-end gap-[10px]">
            <div
              className="w-[46px] h-[46px] rounded-[14px] bg-white flex items-center justify-center font-[950] shadow-[0_8px_18px_rgba(0,0,0,0.18)] overflow-hidden"
              style={{ color: logoColor }}
            >
              {logoUrl ? <img src={logoUrl} alt="logo" className="w-full h-full object-contain p-[4px]" /> : escapeHtml(initials)}
            </div>
            <div>
              <p className="m-0 text-[13px] font-[950] drop-shadow-md text-white">{escapeHtml(college.shortName || name)}</p>
              <small className="text-white/80">{escapeHtml(college.courseCode || college.instituteCode || college.collegeCode || '-')}</small>
            </div>
          </div>
        </div>

        <div className="p-[18px] flex-1 min-w-0">
          <h3 className="m-0 text-[18px] tracking-[-.02em] text-slate-900 font-bold">{escapeHtml(name)}</h3>

          <div className="mt-[7px] flex flex-wrap gap-[8px] text-slate-500 text-[12px] font-[750]">
            <span>🎓 {escapeHtml(course)}</span>
            <span>·</span>
            <span>Rounds: {escapeHtml(college.rounds || '-')}</span>
            {mode !== 'ai' && <span>·</span>}
            {mode !== 'ai' && <span>📍 {escapeHtml(college.state || 'State')}</span>}
          </div>

          <div className="flex flex-wrap gap-[8px] mt-[12px]">
            <span className="px-[9px] py-[6px] rounded-full text-[11px] font-[950] bg-blue-50 text-blue-700">Quota: {escapeHtml(college.quotaCodes || '-')}</span>
            <span className="px-[9px] py-[6px] rounded-full text-[11px] font-[950] bg-emerald-50 text-emerald-700">
              Candidate: {escapeHtml(college.candidateCategoryCodes || '-')}
            </span>
            <span className="px-[9px] py-[6px] rounded-full text-[11px] font-[950] bg-purple-50 text-purple-700">
              Allotted: {escapeHtml(college.allottedCategoryCodes || '-')}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-[10px] my-[16px] max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1">
            <div className="border border-slate-200 rounded-[14px] p-[11px] bg-slate-50 min-w-0">
              <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">Your rank</span>
              <strong className="block mt-[4px] text-[14px] break-words">{formatRank(summary.userRank)}</strong>
            </div>
            <div className="border border-slate-200 rounded-[14px] p-[11px] bg-slate-50 min-w-0">
              <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">Opening rank</span>
              <strong className="block mt-[4px] text-[14px] break-words">{formatRank(college.openingRank)}</strong>
            </div>
            <div className="border border-slate-200 rounded-[14px] p-[11px] bg-slate-50 min-w-0">
              <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">Closing rank</span>
              <strong className="block mt-[4px] text-[14px] break-words">{formatRank(college.closingRank)}</strong>
            </div>
            <div className="border border-slate-200 rounded-[14px] p-[11px] bg-slate-50 min-w-0">
              <span className="block text-[10px] text-slate-500 uppercase tracking-[.08em] font-[950]">Seats</span>
              <strong className="block mt-[4px] text-[14px] break-words">{escapeHtml(college.seats || '-')}</strong>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
