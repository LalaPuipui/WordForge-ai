"use client";

import { useEffect, useRef, useState } from "react";

const TOOLS = [
  {
    id: "ad-copy",
    icon: "◈",
    label: "Ad Copy",
    description: "Facebook, Google & Instagram ads",
    color: "#f59e0b",
    fields: [
      { id: "product", label: "Product / Service", placeholder: "e.g. Organic dog food for senior dogs", type: "input" },
      { id: "audience", label: "Target Audience", placeholder: "e.g. Dog owners aged 30-55 who care about health", type: "input" },
      { id: "tone", label: "Tone", placeholder: "e.g. Urgent, friendly, professional", type: "input" },
    ],
    prompt: (f) => `Write 3 high-converting ad copy variations for the following. Each variation should have a hook, body (2-3 sentences), and a clear CTA. Format each as "Variation 1:", "Variation 2:", "Variation 3:".

Product/Service: ${f.product}
Target Audience: ${f.audience}
Tone: ${f.tone}

Make them punchy, persuasive, and emotionally compelling. No generic filler.`,
  },
  {
    id: "cold-email",
    icon: "✉",
    label: "Cold Email",
    description: "High-reply outreach emails",
    color: "#6366f1",
    fields: [
      { id: "sender_role", label: "Your Role / Business", placeholder: "e.g. Freelance web designer", type: "input" },
      { id: "prospect", label: "Prospect Type", placeholder: "e.g. SaaS startup founders", type: "input" },
      { id: "offer", label: "Your Offer / Value Prop", placeholder: "e.g. I redesign landing pages that double conversion rates", type: "input" },
    ],
    prompt: (f) => `Write a cold email that gets replies. It should feel human, not salesy. Keep it under 120 words. Include: subject line, personalized opener, one-sentence value prop, soft CTA.

Sender: ${f.sender_role}
Prospect: ${f.prospect}
Offer/Value Prop: ${f.offer}

Avoid clichés like "I hope this finds you well." Be direct and specific.`,
  },
  {
    id: "product-desc",
    icon: "◎",
    label: "Product Description",
    description: "Amazon, Shopify & Etsy listings",
    color: "#10b981",
    fields: [
      { id: "product", label: "Product Name", placeholder: "e.g. Himalayan Salt Lamp Set", type: "input" },
      { id: "features", label: "Key Features / Benefits", placeholder: "e.g. Natural pink salt, warm amber glow, reduces stress, 3 sizes", type: "textarea" },
      { id: "platform", label: "Platform", placeholder: "e.g. Amazon, Shopify, Etsy", type: "input" },
    ],
    prompt: (f) => `Write a compelling product description optimized for ${f.platform}. Include: a captivating opening line, key benefits (not just features), emotional appeal, and a closing CTA. Format with a short intro paragraph, then 4-5 bullet points of benefits, then a closing sentence.

Product: ${f.product}
Features/Benefits: ${f.features}

Make it scannable, persuasive, and SEO-friendly.`,
  },
  {
    id: "social-captions",
    icon: "◉",
    label: "Social Captions",
    description: "Instagram, LinkedIn & Twitter/X",
    color: "#ec4899",
    fields: [
      { id: "topic", label: "Topic / Post Idea", placeholder: "e.g. Sharing a client success story", type: "input" },
      { id: "platform", label: "Platform", placeholder: "e.g. Instagram, LinkedIn, Twitter/X", type: "input" },
      { id: "brand_voice", label: "Brand Voice", placeholder: "e.g. Motivational, witty, authoritative", type: "input" },
    ],
    prompt: (f) => `Write 3 ${f.platform} caption variations for the following topic. Match the platform's culture (${f.platform}). Include relevant hashtags. Vary the hook style across the 3 variations.

Topic: ${f.topic}
Brand Voice: ${f.brand_voice}
Platform: ${f.platform}

Label them "Caption 1:", "Caption 2:", "Caption 3:". Make them scroll-stopping.`,
  },
  {
    id: "landing-page",
    icon: "▣",
    label: "Landing Page",
    description: "Headlines, subheads & CTA copy",
    color: "#f97316",
    fields: [
      { id: "product", label: "Product / Service", placeholder: "e.g. AI-powered invoice tool for freelancers", type: "input" },
      { id: "pain_point", label: "Main Pain Point You Solve", placeholder: "e.g. Freelancers waste hours on invoicing and chasing payments", type: "textarea" },
      { id: "cta_goal", label: "CTA Goal", placeholder: "e.g. Free trial signup, book a demo, buy now", type: "input" },
    ],
    prompt: (f) => `Write complete landing page copy sections for this product. Include:
1. Hero Headline (bold, benefit-driven)
2. Hero Subheadline (1-2 sentences expanding on the headline)
3. 3 Feature/Benefit blocks (title + 2-sentence description each)
4. Social proof placeholder sentence
5. CTA Button text + surrounding copy (urgency/reassurance)

Product: ${f.product}
Pain Point: ${f.pain_point}
CTA Goal: ${f.cta_goal}

Use proven copywriting frameworks (PAS, AIDA). Make it conversion-focused.`,
  },
  {
    id: "bio",
    icon: "◐",
    label: "Professional Bio",
    description: "LinkedIn, website & speaker bios",
    color: "#8b5cf6",
    fields: [
      { id: "name", label: "Name", placeholder: "e.g. Sarah Mitchell", type: "input" },
      { id: "role", label: "Role / Title", placeholder: "e.g. UX Designer & Brand Consultant", type: "input" },
      { id: "highlights", label: "Key Achievements & Background", placeholder: "e.g. 8 years experience, worked with Nike & Airbnb, helped 50+ startups, based in NYC", type: "textarea" },
    ],
    prompt: (f) => `Write 3 professional bio versions for ${f.name}: a short Twitter/X bio (under 160 chars), a medium LinkedIn summary (3-4 sentences), and a long website/speaker bio (2 paragraphs). Make each feel authoritative, human, and memorable.

Name: ${f.name}
Role: ${f.role}
Background/Highlights: ${f.highlights}

Label them "Short Bio:", "LinkedIn Bio:", "Full Bio:". Avoid generic phrases like "passionate about" or "results-driven."`,
  },
];

const DEFAULT_MODEL = "gemini-flash-latest";

function useTypewriter(text, speed = 8) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    idx.current = 0;
    if (!text) return;

    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1));
        idx.current++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

function ResultDisplay({ result, onCopy, copied }) {
  const { displayed, done } = useTypewriter(result, 6);

  return (
    <div style={{ position: "relative" }}>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontSize: "13.5px",
          lineHeight: "1.85",
          color: "#e2e8f0",
          margin: 0,
          padding: 0,
          background: "transparent",
        }}
      >
        {displayed}
        {!done && <span style={{ animation: "blink 1s infinite", color: "#f59e0b" }}>▍</span>}
      </pre>
      {done && (
        <button
          onClick={onCopy}
          style={{
            marginTop: "20px",
            background: copied ? "#10b981" : "rgba(245,158,11,0.15)",
            border: `1px solid ${copied ? "#10b981" : "#f59e0b"}`,
            color: copied ? "#fff" : "#f59e0b",
            padding: "8px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.5px",
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ Copied!" : "Copy to Clipboard"}
        </button>
      )}
    </div>
  );
}

export default function Page() {
  const [activeTool, setActiveTool] = useState(TOOLS[0]);
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    setFields({});
    setResult("");
    setError("");
  }, [activeTool]);

  const handleGenerate = async () => {
    const missing = activeTool.fields.find((f) => !fields[f.id]?.trim());
    if (missing) {
      setError(`Please fill in "${missing.label}"`);
      return;
    }

    setError("");
    setLoading(true);
    setResult("");

    try {
      const prompt = activeTool.prompt(fields);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: DEFAULT_MODEL,
          max_tokens: 1000,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      const text = data?.text || "No response generated.";
      setResult(text);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        fontFamily: "'DM Sans', sans-serif",
        color: "#f1f5f9",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Cormorant+Garamond:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        textarea { resize: vertical; }
        textarea:focus, input:focus { outline: none; }
      `}</style>

      <header
        style={{
          borderBottom: "1px solid #1e1e1e",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(12px)",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            W
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            WordForge <span style={{ color: "#f59e0b" }}>AI</span>
          </span>
        </div>
        <div
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "#f59e0b",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            padding: "4px 12px",
            borderRadius: "20px",
            textTransform: "uppercase",
          }}
        >
          Pro Plan
        </div>
      </header>

      <div
        style={{
          textAlign: "center",
          padding: "64px 24px 40px",
          animation: "fadeUp 0.6s ease both",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            color: "#f59e0b",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "2px",
            padding: "5px 14px",
            borderRadius: "20px",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          Powered by Claude AI
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            marginBottom: "16px",
            background: "linear-gradient(135deg, #fff 40%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Words that sell.
          <br />
          Copy that converts.
        </h1>
        <p
          style={{
            color: "#64748b",
            fontSize: "16px",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          6 AI-powered copy tools for ads, emails, products, and more. Generate in seconds. Close deals faster.
        </p>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 80px",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "16px",
            padding: "12px",
            position: "sticky",
            top: "80px",
            animation: "fadeUp 0.6s ease 0.1s both",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "#475569",
              padding: "6px 8px 10px",
              textTransform: "uppercase",
            }}
          >
            Tools
          </div>
          {TOOLS.map((tool) => {
            const active = activeTool.id === tool.id;
            const rgb =
              tool.color === "#f59e0b"
                ? "245,158,11"
                : tool.color === "#6366f1"
                  ? "99,102,241"
                  : tool.color === "#10b981"
                    ? "16,185,129"
                    : tool.color === "#ec4899"
                      ? "236,72,153"
                      : tool.color === "#f97316"
                        ? "249,115,22"
                        : "139,92,246";
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 12px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  background: active ? `rgba(${rgb},0.12)` : "transparent",
                  transition: "all 0.2s",
                  textAlign: "left",
                  marginBottom: "2px",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    color: active ? tool.color : "#475569",
                    minWidth: "20px",
                    transition: "color 0.2s",
                  }}
                >
                  {tool.icon}
                </span>
                <div>
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: active ? 600 : 500,
                      color: active ? "#f1f5f9" : "#94a3b8",
                      transition: "color 0.2s",
                    }}
                  >
                    {tool.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#475569", marginTop: "1px" }}>{tool.description}</div>
                </div>
              </button>
            );
          })}

          <div
            style={{
              margin: "12px 0 4px",
              padding: "12px",
              background: "rgba(245,158,11,0.05)",
              border: "1px solid rgba(245,158,11,0.15)",
              borderRadius: "10px",
            }}
          >
            <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 700, marginBottom: "4px" }}>💡 Pro Tip</div>
            <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.5 }}>
              The more specific your inputs, the more powerful your copy.
            </div>
          </div>
        </div>

        <div style={{ animation: "fadeUp 0.6s ease 0.2s both" }}>
          <div
            style={{
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "16px",
              padding: "28px 32px",
              marginBottom: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: `rgba(245,158,11,0.15)`,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  color: activeTool.color,
                  border: `1px solid ${activeTool.color}30`,
                }}
              >
                {activeTool.icon}
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>{activeTool.label} Generator</h2>
                <p style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>{activeTool.description}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {activeTool.fields.map((field) => (
                <div key={field.id}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.8px",
                      color: "#94a3b8",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={fields[field.id] || ""}
                      onChange={(e) => setFields((p) => ({ ...p, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={3}
                      style={{
                        width: "100%",
                        background: "#0d0d0d",
                        border: "1px solid #2a2a2a",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        color: "#e2e8f0",
                        fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif",
                        lineHeight: 1.6,
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = activeTool.color)}
                      onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                    />
                  ) : (
                    <input
                      type="text"
                      value={fields[field.id] || ""}
                      onChange={(e) => setFields((p) => ({ ...p, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%",
                        background: "#0d0d0d",
                        border: "1px solid #2a2a2a",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        color: "#e2e8f0",
                        fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "border-color 0.2s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = activeTool.color)}
                      onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
                    />
                  )}
                </div>
              ))}

              {error && (
                <div
                  style={{
                    color: "#f87171",
                    fontSize: "13px",
                    background: "rgba(248,113,113,0.08)",
                    border: "1px solid rgba(248,113,113,0.2)",
                    padding: "10px 14px",
                    borderRadius: "8px",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  padding: "14px 28px",
                  background: loading ? "#1a1a1a" : `linear-gradient(135deg, ${activeTool.color}, ${activeTool.color}cc)`,
                  border: "none",
                  borderRadius: "10px",
                  color: loading ? "#475569" : "#000",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "14px",
                  letterSpacing: "0.3px",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                {loading ? (
                  <>
                    <span style={{ animation: "pulse 1s infinite" }}>⊙</span>
                    Generating your copy...
                  </>
                ) : (
                  `✦ Generate ${activeTool.label}`
                )}
              </button>
            </div>
          </div>

          {(result || loading) && (
            <div
              ref={resultRef}
              style={{
                background: "#111",
                border: `1px solid ${activeTool.color}30`,
                borderRadius: "16px",
                padding: "28px 32px",
                animation: "fadeUp 0.4s ease both",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "20px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #1e1e1e",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: result ? activeTool.color : "#475569",
                    borderRadius: "50%",
                    animation: loading ? "pulse 1s infinite" : "none",
                  }}
                ></div>
                <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", color: "#475569", textTransform: "uppercase" }}>
                  {loading ? "Writing your copy..." : "Your Generated Copy"}
                </span>
              </div>
              {result ? (
                <ResultDisplay result={result} onCopy={handleCopy} copied={copied} />
              ) : (
                <div style={{ color: "#475569", fontSize: "14px", fontStyle: "italic" }}>Crafting high-converting copy for you...</div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div
              style={{
                background: "#111",
                border: "1px dashed #1e1e1e",
                borderRadius: "16px",
                padding: "40px 32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.3 }}>{activeTool.icon}</div>
              <div style={{ color: "#475569", fontSize: "14px" }}>Fill in the fields above and click Generate</div>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #1a1a1a",
          padding: "20px 32px",
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          color: "#334155",
          fontSize: "12px",
        }}
      >
        {["6 AI Copy Tools", "Unlimited Generations", "Instant Download"].map((item) => (
          <span key={item} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#f59e0b" }}>✦</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

