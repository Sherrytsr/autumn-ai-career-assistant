"use client";

import { useMemo, useRef, useState } from "react";
import { interviewNotes, samples, skillDictionary, type InterviewNote } from "./demo-data";

type Step = 1 | 2 | 3 | 4;
type Analysis = {
  hard: string[];
  soft: string[];
  work: string[];
  hidden: string[];
  role: string;
};

const nav = [
  { id: 1 as Step, short: "JD", title: "岗位需求解析", desc: "拆解岗位能力模型" },
  { id: 2 as Step, short: "匹", title: "简历匹配评分", desc: "发现优势与能力差距" },
  { id: 3 as Step, short: "改", title: "针对性修改", desc: "给出可执行改写" },
  { id: 4 as Step, short: "题", title: "面经智能检索", desc: "高频题与回答思路" },
];

const hardCandidates = ["SQL", "Python", "JavaScript", "TypeScript", "React", "Vue", "Node.js", "Figma", "Axure", "Power BI", "Tableau", "Excel", "A/B测试", "数据分析", "用户研究", "竞品分析", "PRD", "原型设计", "指标体系", "性能优化", "组件库", "统计学"];
const softCandidates = ["逻辑", "沟通", "协作", "跨部门", "项目推进", "业务理解", "用户洞察", "学习能力", "责任心", "表达", "主动", "抗压"];

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function extractAnalysis(text: string): Analysis {
  const hard = hardCandidates.filter((item) => text.toLowerCase().includes(item.toLowerCase()));
  const soft = softCandidates.filter((item) => text.includes(item));
  const role = text.match(/(?:岗位[：:]?|招聘)([^\n，。]{2,18})/)?.[1]?.trim() || (text.includes("前端") ? "前端开发工程师" : text.includes("数据") ? "数据分析师" : text.includes("运营") ? "运营" : "产品经理");
  const sentences = text.split(/[。；;\n]/).map((s) => s.trim()).filter(Boolean);
  const work = sentences.filter((s) => /负责|完成|搭建|推动|参与|分析|设计|优化|研发/.test(s)).slice(0, 4);
  const hidden: string[] = [];
  if (/优先|加分|经验/.test(text)) hidden.push("偏好有同类行业或岗位实习经历，能够缩短上手周期");
  if (/独立|主导|推动/.test(text)) hidden.push("看重候选人的主人翁意识与跨团队推进能力");
  if (/数据|指标|A\/B/.test(text)) hidden.push("面试中大概率追问指标口径、分析过程与量化结果");
  if (/内容|社区|年轻/.test(text)) hidden.push("关注内容生态敏感度及对年轻用户需求的理解");
  if (/性能|工程|代码/.test(text)) hidden.push("不仅考察功能实现，也关注工程质量与性能意识");
  return {
    hard: hard.length ? hard : ["岗位专业知识", "数据分析工具", "常用协作工具"],
    soft: soft.length ? soft.map((s) => s === "逻辑" ? "逻辑分析" : s === "沟通" ? "沟通表达" : s) : ["沟通协作", "逻辑分析", "结果导向"],
    work: work.length ? work : ["围绕核心业务目标推进项目落地", "分析用户与业务数据并持续迭代"],
    hidden: hidden.length ? hidden : ["偏好能用量化结果证明产出的候选人", "面试会重点深挖项目中的个人贡献"],
    role,
  };
}

function normalizeRole(input: string) {
  const text = input.toLowerCase();
  if (/前端|react|web/.test(text)) return "前端开发工程师";
  if (/后端|java|服务端/.test(text)) return "后端开发工程师";
  if (/数据|分析|商业分析/.test(text)) return "数据分析师";
  if (/运营|内容运营|用户运营/.test(text)) return "运营";
  if (/产品|pm/.test(text)) return "产品经理";
  if (/算法|推荐/.test(text)) return "算法工程师";
  if (/市场|营销|品牌/.test(text)) return "市场营销";
  return input.trim();
}

async function readDocument(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (["txt", "md", "csv"].includes(ext || "")) return file.text();
  if (ext === "docx") {
    const mammoth = await import("mammoth/mammoth.browser");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }
  if (ext === "pdf") {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => "str" in item ? item.str : "").join(" "));
    }
    return pages.join("\n");
  }
  throw new Error("暂不支持该格式，请上传 PDF、DOCX、TXT 或 MD 文件");
}

function Icon({ name }: { name: string }) {
  const icons: Record<string, string> = { upload: "↥", spark: "✦", check: "✓", arrow: "→", lock: "⌁", search: "⌕", quote: "“", info: "i", file: "▤", target: "◎", warn: "!" };
  return <span className={`icon icon-${name}`} aria-hidden="true">{icons[name]}</span>;
}

function UploadBox({ onText, compact = false }: { onText: (text: string, name: string) => void; compact?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const handle = async (file?: File) => {
    if (!file) return;
    setStatus("正在读取…");
    try {
      const text = await readDocument(file);
      if (!text.trim()) throw new Error("没有读取到可用文字，扫描版 PDF 暂不支持");
      onText(text, file.name);
      setStatus(`已读取 ${file.name}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "文档读取失败");
    }
  };
  return (
    <div className={`upload-box ${compact ? "compact" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void handle(e.dataTransfer.files[0]); }} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}>
      <input ref={inputRef} type="file" accept=".pdf,.docx,.txt,.md" hidden onChange={(e) => void handle(e.target.files?.[0])} />
      <span className="upload-icon"><Icon name="upload" /></span>
      <div><strong>{status || "拖拽或点击上传文档"}</strong><small>支持 PDF、DOCX、TXT、MD，最大 10MB</small></div>
    </div>
  );
}

function ResultCard({ index, title, eyebrow, items, tone = "plain" }: { index: string; title: string; eyebrow: string; items: string[]; tone?: string }) {
  return (
    <article className={`result-card ${tone}`}>
      <div className="result-head"><span>{index}</span><div><small>{eyebrow}</small><h3>{title}</h3></div></div>
      <ul>{items.map((item, i) => <li key={`${item}-${i}`}><Icon name="check" /><span>{item}</span></li>)}</ul>
    </article>
  );
}

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [sampleId, setSampleId] = useState("product");
  const selectedSample = samples.find((item) => item.id === sampleId) || samples[0];
  const [jd, setJd] = useState(selectedSample.jd);
  const [resume, setResume] = useState(selectedSample.resume);
  const [jdFile, setJdFile] = useState("");
  const [resumeFile, setResumeFile] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [scored, setScored] = useState(false);
  const [optimized, setOptimized] = useState(false);
  const [role, setRole] = useState(selectedSample.role);
  const [query, setQuery] = useState("");
  const [retrieved, setRetrieved] = useState<InterviewNote[] | null>(null);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [busy, setBusy] = useState(false);

  const loadSample = (id: string) => {
    const sample = samples.find((item) => item.id === id) || samples[0];
    setSampleId(id); setJd(sample.jd); setResume(sample.resume); setRole(sample.role);
    setAnalysis(null); setScored(false); setOptimized(false); setRetrieved(null); setStep(1);
    setJdFile(""); setResumeFile("");
  };

  const runWithPause = (action: () => void) => {
    setBusy(true);
    window.setTimeout(() => { action(); setBusy(false); }, 650);
  };

  const match = useMemo(() => {
    const required = analysis?.hard || extractAnalysis(jd).hard;
    const matched = required.filter((item) => resume.toLowerCase().includes(item.toLowerCase()));
    const missing = required.filter((item) => !resume.toLowerCase().includes(item.toLowerCase()));
    const measurable = /\d+[%万+]|提升|下降|覆盖|增长/.test(resume);
    const experience = /实习|项目|负责人/.test(resume);
    const score = Math.min(96, Math.max(38, Math.round(46 + (matched.length / Math.max(required.length, 1)) * 38 + (measurable ? 7 : 0) + (experience ? 5 : 0))));
    return { required, matched, missing, measurable, experience, score };
  }, [analysis, jd, resume]);

  const searchNotes = () => {
    const normalized = normalizeRole(role || query);
    const tokens = unique(`${normalized}${query}`.toLowerCase().split(/[\s,，、]+/).filter(Boolean));
    const ranked = interviewNotes.map((note) => {
      let points = note.quality / 100;
      if (note.role === normalized) points += 10;
      if (normalized && (note.role.includes(normalized) || normalized.includes(note.role))) points += 5;
      const haystack = `${note.role}${note.title}${note.company}${note.questions.join("")}`.toLowerCase();
      points += tokens.filter((token) => token && haystack.includes(token)).length * 2;
      return { note, points };
    }).filter(({ points }) => points >= 5).sort((a, b) => b.points - a.points).slice(0, 6).map(({ note }) => note);
    setRetrieved(ranked); setActiveQuestion(0);
  };

  const sources = retrieved || [];
  const questionRows = unique(sources.flatMap((note) => note.questions)).slice(0, 8).map((question, index) => ({
    question,
    refs: sources.filter((note) => note.questions.includes(question)).map((note) => note.id),
    heat: index < 3 ? "高频" : index < 6 ? "常见" : "补充",
  }));
  const active = questionRows[activeQuestion];

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">秋</div>
        <div className="brand-copy"><h1>秋招 AI 助手</h1><span>简历优化 · 真实面经</span></div>
        <div className="header-intro">基于脱敏面经知识库，帮你从看懂岗位到拿下面试</div>
        <div className="privacy-pill"><Icon name="lock" /> 本地会话处理 · 不长期保存</div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="side-label">求职准备流程</div>
          <nav aria-label="功能导航">
            {nav.map((item) => {
              const done = (item.id === 1 && !!analysis) || (item.id === 2 && scored) || (item.id === 3 && optimized) || (item.id === 4 && !!retrieved);
              return <button key={item.id} className={`${step === item.id ? "active" : ""} ${done ? "done" : ""}`} onClick={() => setStep(item.id)}><span className="nav-num">{done ? "✓" : item.id}</span><span><strong>{item.title}</strong><small>{item.desc}</small></span></button>;
            })}
          </nav>
          <div className="demo-switcher">
            <label htmlFor="sample">一键体验示例</label>
            <select id="sample" value={sampleId} onChange={(e) => loadSample(e.target.value)}>{samples.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
            <small>切换后将重置当前分析</small>
          </div>
          <div className="prototype-note"><Icon name="info" /><p><strong>使用提示</strong><br />本 Demo 为产品原型，分析结果仅供秋招参考。</p></div>
        </aside>

        <section className="content">
          <div className="content-top">
            <div className="breadcrumbs"><span>秋招准备</span><b>/</b><strong>{nav[step - 1].title}</strong></div>
            <div className="progress-text">准备进度 <b>{[analysis, scored, optimized, retrieved].filter(Boolean).length}/4</b></div>
          </div>

          {step === 1 && <>
            <section className="page-heading"><span className="kicker">STEP 01 · UNDERSTAND THE ROLE</span><h2>先读懂岗位，再投出简历</h2><p>粘贴或上传岗位描述，提炼显性要求和招聘者真正关注的能力。</p></section>
            <div className="two-column input-grid">
              <section className="panel input-panel">
                <div className="panel-title"><div><span className="mini-icon"><Icon name="file" /></span><div><h3>岗位 JD</h3><p>{jdFile ? `已导入：${jdFile}` : "粘贴完整岗位描述，分析会更准确"}</p></div></div><span className="count">{jd.length} 字</span></div>
                <textarea value={jd} onChange={(e) => { setJd(e.target.value); setAnalysis(null); }} placeholder="在这里粘贴岗位职责与任职要求…" aria-label="岗位JD文本" />
                <UploadBox compact onText={(text, name) => { setJd(text); setJdFile(name); setAnalysis(null); }} />
                <button className="primary-button" disabled={!jd.trim() || busy} onClick={() => runWithPause(() => { const result = extractAnalysis(jd); setAnalysis(result); setRole(result.role); })}><Icon name="spark" />{busy ? "正在解析岗位…" : "开始智能解析"}<span>→</span></button>
              </section>
              <section className={`panel output-panel ${analysis ? "has-result" : ""}`}>
                {!analysis ? <div className="empty-state"><div className="empty-orbit"><Icon name="spark" /></div><h3>等待解析岗位</h3><p>AI 会从四个维度构建岗位能力画像<br />预计用时约 5 秒</p><div className="empty-tags"><span>硬技能</span><span>软实力</span><span>工作内容</span><span>隐性偏好</span></div></div> : <div className="results-wrap"><div className="result-summary"><div><span>岗位能力画像</span><h3>{analysis.role}</h3></div><span className="success-label"><Icon name="check" /> 已完成解析</span></div><div className="result-grid"><ResultCard index="01" eyebrow="HARD SKILLS" title="核心硬技能" items={analysis.hard} /><ResultCard index="02" eyebrow="SOFT SKILLS" title="软素质要求" items={analysis.soft} tone="pink" /><ResultCard index="03" eyebrow="CORE WORK" title="核心业务内容" items={analysis.work} tone="wide" /><ResultCard index="04" eyebrow="HIDDEN SIGNALS" title="隐性招聘偏好" items={analysis.hidden} tone="wide amber" /></div><button className="next-link" onClick={() => setStep(2)}>下一步：评估简历匹配度 <Icon name="arrow" /></button></div>}
              </section>
            </div>
          </>}

          {step === 2 && <>
            <section className="page-heading"><span className="kicker">STEP 02 · FIND THE GAP</span><h2>你的简历，和岗位有多匹配？</h2><p>从硬技能、经历相关度与成果表达三个维度，给出可解释的匹配评分。</p></section>
            <div className="two-column input-grid score-layout">
              <section className="panel input-panel">
                {!analysis && <div className="warning-strip"><Icon name="warn" /> 尚未解析 JD，当前将直接从已填写的 JD 提取要求。</div>}
                <div className="panel-title"><div><span className="mini-icon"><Icon name="file" /></span><div><h3>我的简历</h3><p>{resumeFile ? `已导入：${resumeFile}` : "内容只在当前会话中使用"}</p></div></div><span className="count">{resume.length} 字</span></div>
                <textarea value={resume} onChange={(e) => { setResume(e.target.value); setScored(false); }} placeholder="粘贴简历文本…" aria-label="简历文本" />
                <UploadBox compact onText={(text, name) => { setResume(text); setResumeFile(name); setScored(false); }} />
                <button className="primary-button" disabled={!resume.trim() || busy} onClick={() => runWithPause(() => setScored(true))}><Icon name="target" />{busy ? "正在逐项比对…" : "计算匹配度"}<span>→</span></button>
              </section>
              <section className={`panel score-panel ${scored ? "has-result" : ""}`}>
                {!scored ? <div className="empty-state"><div className="empty-orbit"><Icon name="target" /></div><h3>还没有匹配结果</h3><p>导入简历后，将逐项对照岗位能力模型</p><div className="score-preview"><span>硬技能 35%</span><span>经历 30%</span><span>业务 20%</span><span>表达 15%</span></div></div> : <div className="score-results">
                  <div className="score-hero"><div className="score-ring" style={{ "--score": `${match.score * 3.6}deg` } as React.CSSProperties}><div><b>{match.score}</b><span>/ 100</span></div></div><div><span className="match-badge">{match.score >= 80 ? "匹配度优秀" : match.score >= 65 ? "匹配度良好" : "需要重点优化"}</span><h3>核心要求覆盖 {match.matched.length}/{match.required.length}</h3><p>这是基于简历证据的辅助评分，并非企业录用概率。</p></div></div>
                  <div className="dimension-bars">{[["硬技能", Math.min(100, Math.round(match.matched.length / Math.max(match.required.length, 1) * 100))], ["相关经历", match.experience ? 88 : 52], ["成果表达", match.measurable ? 92 : 48], ["软实力证据", /协作|负责人|推动/.test(resume) ? 84 : 55]].map(([label, value]) => <div key={String(label)}><span>{label}<b>{value}</b></span><i><em style={{ width: `${value}%` }} /></i></div>)}</div>
                  <div className="match-columns"><div className="match-box good"><h4><Icon name="check" /> 匹配优势</h4><ul>{match.matched.slice(0, 5).map((x) => <li key={x}><b>{x}</b>：简历中已有明确证据</li>)}{match.measurable && <li><b>结果量化</b>：存在可验证的数字成果</li>}</ul></div><div className="match-box missing"><h4><Icon name="warn" /> 缺失与弱匹配</h4><ul>{match.missing.length ? match.missing.slice(0, 5).map((x) => <li key={x}><b>{x}</b>：未发现直接证明</li>) : <li>核心硬技能已基本覆盖，建议加强业务场景表达</li>}{!match.measurable && <li><b>量化成果</b>：缺少规模、效率或增长数据</li>}</ul></div></div>
                  <button className="next-link" onClick={() => setStep(3)}>下一步：生成修改方案 <Icon name="arrow" /></button>
                </div>}
              </section>
            </div>
          </>}

          {step === 3 && <>
            <section className="page-heading"><span className="kicker">STEP 03 · REWRITE WITH EVIDENCE</span><h2>把“做过”，改成“做成了什么”</h2><p>不虚构经历，只调整顺序、表达和证据密度，让招聘者更快看见匹配点。</p></section>
            {!optimized ? <section className="panel optimize-start"><div className="optimize-visual"><span>01</span><i /><span>02</span><i /><span>03</span></div><h3>已准备好生成定向修改方案</h3><p>将基于当前 JD 与简历，输出经历排序、STAR 改写和删减建议。</p><div className="guardrail"><Icon name="lock" /><span><b>真实性护栏</b> 不会替你编造经历；缺少的数据会用【请补充】标记。</span></div><button className="primary-button narrow" disabled={busy} onClick={() => runWithPause(() => setOptimized(true))}><Icon name="spark" />{busy ? "正在生成建议…" : "生成修改方案"}</button></section> : <section className="optimization-results">
              <div className="recommend-banner"><div><span>优先级建议</span><h3>先呈现最贴近「{analysis?.role || extractAnalysis(jd).role}」的经历</h3></div><div className="order-flow"><span>① 相关实习</span><b>→</b><span>② 核心项目</span><b>→</b><span>③ 教育技能</span></div></div>
              <article className="rewrite-card"><div className="rewrite-head"><div><span className="priority">P1 · 重点改写</span><h3>第一段相关经历</h3></div><span className="keyword-count">补充 {Math.min(3, match.missing.length || 2)} 个 JD 关键词</span></div><div className="before-after"><div><label>原表达</label><p>{resume.split("\n").find((line) => line.trim().startsWith("-"))?.replace(/^[-•]\s*/, "") || "负责项目相关工作，并协助团队完成上线。"}</p></div><div className="arrow-divider">→</div><div className="after"><label>STAR 建议版本</label><p><b>围绕【业务目标】</b>，通过{match.matched.slice(0, 2).join("与") || "用户研究与数据分析"}定位【关键问题】，独立完成方案设计并协同团队落地，最终使<b>【核心指标提升，请补充数据】</b>。</p><div className="keyword-tags">{unique([...match.matched.slice(0, 2), ...match.missing.slice(0, 2)]).map((x) => <span key={x}>{x}</span>)}</div></div></div><div className="star-grid">{[["S", "场景", "交代业务阶段、目标用户与关键问题"], ["T", "任务", "说清个人负责范围，不使用模糊的‘参与’"], ["A", "行动", `加入${match.missing.slice(0, 2).join("、") || "分析与协作"}的具体方法`], ["R", "结果", "用转化率、效率、覆盖量或质量数据收尾"]].map(([letter, title, copy]) => <div key={letter}><b>{letter}</b><span><strong>{title}</strong>{copy}</span></div>)}</div></article>
              <div className="advice-grid"><article className="advice-card"><span className="advice-icon">↕</span><div><small>顺序调整</small><h3>让相关内容在首屏被看见</h3><ul><li>将与岗位最相关的实习放在教育背景之后</li><li>同一经历内按“成果强度”而非时间排序</li><li>技能栏将 {match.matched.slice(0, 3).join("、") || "岗位技能"} 前置</li></ul></div></article><article className="advice-card delete"><span className="advice-icon">−</span><div><small>建议删减</small><h3>把篇幅留给有效证据</h3><ul><li>删除“学习能力强、认真负责”等无证据自评</li><li>压缩与目标岗位无关的课程和校园活动</li><li>同义技能不重复罗列，控制一页内完成阅读</li></ul></div></article></div>
              <button className="next-link standalone" onClick={() => setStep(4)}>下一步：准备岗位面试 <Icon name="arrow" /></button>
            </section>}
          </>}

          {step === 4 && <>
            <section className="page-heading interview-heading"><span className="kicker">STEP 04 · PRACTICE WHAT MATTERS</span><h2>从真实面经里，找到最该练的题</h2><p>在 24 篇脱敏面经中检索、去重与排序，每一条结论都能回到具体来源。</p></section>
            <section className="search-panel"><div className="search-fields"><label><span>目标岗位</span><input value={role} onChange={(e) => setRole(e.target.value)} placeholder="例如：产品经理" /></label><label className="wide"><span>你还想重点准备什么？</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="例如：增长方向、项目深挖、技术一面（可选）" /></label><button onClick={() => runWithPause(searchNotes)} disabled={!role.trim() || busy}><Icon name="search" />{busy ? "检索中…" : "检索面经"}</button></div><div className="search-meta"><span><i /> 知识库：24 篇脱敏面经</span><span>已进行质量过滤与问题去重</span></div></section>
            {retrieved === null ? <section className="panel interview-empty"><div className="source-stack"><span /><span /><span><Icon name="quote" /></span></div><h3>输入岗位，开始检索真实面经</h3><p>我们只基于知识库已有内容作答；没有找到时会明确告诉你。</p><div className="role-chips">{["产品经理", "运营", "数据分析师", "前端开发工程师"].map((item) => <button key={item} onClick={() => { setRole(item); setQuery(""); }}>{item}</button>)}</div></section> : sources.length === 0 ? <section className="panel no-result"><span>未检索到</span><h3>知识库中暂无「{role}」的可靠面经</h3><p>我们不会编造题目。你可以尝试更通用的岗位名称，如产品经理、运营、数据分析师或前端开发工程师。</p></section> : <section className="interview-results">
              <div className="retrieval-summary"><div><span className="pulse" /><p>找到 <b>{sources.length}</b> 篇相关面经，去重后整理出 <b>{questionRows.length}</b> 道高价值问题</p></div><span>检索岗位：{normalizeRole(role)}</span></div>
              <div className="interview-layout"><aside className="question-list"><div className="list-head"><h3>高频问题</h3><span>按相关度排序</span></div>{questionRows.map((item, index) => <button key={item.question} className={activeQuestion === index ? "active" : ""} onClick={() => setActiveQuestion(index)}><span className={`heat ${item.heat === "高频" ? "hot" : ""}`}>{item.heat}</span><strong>{item.question}</strong><small>引用 {item.refs.join(" · ")}</small></button>)}</aside><article className="answer-card">{active && <><div className="answer-top"><span>高分回答框架</span><div>{active.refs.map((ref) => <b key={ref}>{ref}</b>)}</div></div><h3>{active.question}</h3><div className="answer-section"><label>答题思路</label><div className="answer-steps"><span><b>1</b>先给判断与分析框架</span><span><b>2</b>结合个人项目讲具体行动</span><span><b>3</b>用数据验证并补充反思</span></div></div><div className="answer-section template"><label>回答模板</label><p>“我会先明确问题的<b>业务目标和指标口径</b>，再从用户、场景和流程三个层次拆解。以我的【项目名称】为例，当时遇到【具体问题】，我通过【分析或行动】定位到【关键原因】，随后推动【解决方案】落地，最终带来【请补充真实结果】。如果重新做一次，我还会补充【验证或长期指标】。”</p></div><div className="pitfall"><Icon name="warn" /><div><b>面试踩坑提醒</b><p>避免只背框架、不落到自己的经历；不要编造数据。面试官追问时，要能解释指标口径和个人贡献。</p></div></div></>}</article></div>
              <section className="sources-panel"><div className="sources-title"><div><h3>本次引用来源</h3><p>以下为 Demo 内置的脱敏面经索引，回答仅依据这些记录整理。</p></div><span>{sources.length} 个来源</span></div><div className="source-grid">{sources.map((note) => <article key={note.id}><span>{note.id}</span><div><h4>{note.title}</h4><p>{note.company} · {note.round} · {note.date}</p></div><b>{note.quality}%</b></article>)}</div></section>
            </section>}
          </>}
        </section>
      </div>
      <footer><span>秋招 AI 助手 · 产品原型 Demo</span><span>请勿输入身份证号、住址等敏感信息</span></footer>
    </main>
  );
}

