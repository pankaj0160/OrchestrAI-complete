import { useNavigate } from 'react-router-dom'
import { AGENTS } from '../hooks/useSSEStream'
import Navbar from '../components/Navbar'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col overflow-hidden">
      <Navbar />

      {/* ── Background layers ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-40" />

        {/* Radial glow – center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[700px] h-[500px] rounded-full opacity-[0.07] blur-[120px]"
             style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.05] blur-[80px]"
             style={{ background: 'radial-gradient(circle, #f59e0b, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-[0.05] blur-[80px]"
             style={{ background: 'radial-gradient(circle, #14b8a6, transparent)' }} />

        {/* Scan line */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent
                        via-[var(--indigo)] to-transparent opacity-[0.15] animate-scan" />
      </div>

      {/* ── Hero ── */}
      <main className="relative flex-1 flex flex-col items-center justify-center
                       px-6 pt-24 pb-16 text-center">

        {/* System badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                        border border-[var(--border)] bg-[var(--bg-card)] animate-fade-in">
          <div className="flex gap-0.5">
            {['amber', 'teal', 'indigo', 'green'].map(c => (
              <div key={c} className={`w-1.5 h-1.5 rounded-full bg-${c} animate-pulse-slow`} />
            ))}
          </div>
          <span className="text-[10px] font-mono text-[var(--zinc-500)] tracking-widest uppercase">
            Multi-Agent Research Pipeline
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-800 text-5xl md:text-6xl lg:text-7xl
                       leading-[1.05] tracking-tight text-[#e4e4e7] mb-5
                       animate-slide-up max-w-4xl">
          AI Workflows
          <br />
          <span className="bg-gradient-to-r from-indigo via-[#818cf8] to-teal
                           bg-clip-text text-transparent">
            Made Observable
          </span>
        </h1>

        {/* Sub */}
        <p className="max-w-xl text-[var(--zinc-500)] text-base leading-relaxed mb-10
                      animate-fade-in font-body">
          Observe four specialized AI agents collaborating in real time — searching the web,
          extracting knowledge, synthesizing reports, and evaluating quality.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in mb-16">
          <button
            onClick={() => navigate('/research')}
            className="px-8 py-3.5 rounded-xl bg-[var(--indigo)] text-white font-display
                       font-600 text-sm tracking-wide hover:bg-[#7577f3] transition-all
                       duration-200 hover:shadow-[0_0_32px_#6366f130] active:scale-95"
          >
            Start Research →
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl border border-[var(--border)] text-[var(--zinc-400)]
                       font-display font-500 text-sm hover:border-[var(--zinc-600)]
                       hover:text-[var(--zinc-300)] hover:bg-[var(--bg-card)]
                       transition-all duration-200"
          >
            View Source
          </a>
        </div>

        {/* Pipeline preview */}
        <PipelinePreview />

        {/* Feature grid */}
        <div className="mt-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((agent, i) => (
            <AgentFeatureCard key={agent.key} agent={agent} delay={i * 80} />
          ))}
        </div>

        {/* Bottom feature row */}
        <div className="mt-8 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '⟳', title: 'SSE Streaming', desc: 'Watch execution unfold event by event with live server-sent updates.' },
            { icon: '◎', title: 'Full Observability', desc: 'Every agent thought, tool call, and decision surfaced in real time.' },
            { icon: '↯', title: 'Key Failover', desc: 'Automatic rotation across multiple API keys for zero-interruption runs.' },
          ].map((f, i) => (
            <FeatureCard key={i} {...f} delay={i * 80} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-[var(--border)] py-5 px-6
                         flex items-center justify-between">
        <span className="text-[10px] font-mono text-[var(--zinc-700)]">
          OrchestrAI · Multi-Agent Research Engine
        </span>
        <span className="text-[10px] font-mono text-[var(--zinc-700)]">
          Built with LangChain · Groq · FastAPI · React
        </span>
      </footer>
    </div>
  )
}

function PipelinePreview() {
  const colors = { search:'#f59e0b', reader:'#14b8a6', writer:'#6366f1', critic:'#22c55e' }

  return (
    <div className="flex items-center gap-0 animate-fade-in">
      {Object.entries(colors).map(([key, hex], idx, arr) => (
        <div key={key} className="flex items-center">
          {/* Node */}
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-lg border flex items-center justify-center
                         text-[10px] font-mono transition-all duration-300"
              style={{ borderColor: hex + '60', color: hex, background: hex + '10' }}
            >
              {['⌕','◈','✦','◉'][idx]}
            </div>
            <span className="mt-1 text-[8px] font-mono capitalize"
                  style={{ color: hex + 'aa' }}>
              {key}
            </span>
          </div>

          {/* Connector */}
          {idx < arr.length - 1 && (
            <div className="w-8 flex items-center mx-1 mb-4">
              <div className="h-px flex-1 opacity-30" style={{ background: hex }} />
              <div className="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[4px]
                              border-t-transparent border-b-transparent opacity-40"
                   style={{ borderLeftColor: hex }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function AgentFeatureCard({ agent, delay }) {
  const colorHex = { amber:'#f59e0b', teal:'#14b8a6', indigo:'#6366f1', green:'#22c55e' }
  const hex = colorHex[agent.color]

  return (
    <div
      className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]
                 hover:border-current transition-all duration-300 group animate-slide-up"
      style={{ animationDelay: `${delay}ms`, '--tw-text-opacity': 1, color: hex + '80' }}
    >
      <div className="flex items-start gap-3 mb-2">
        <span className="text-xl" style={{ color: hex }}>{agent.icon}</span>
        <div>
          <div className="text-xs font-display font-600 text-[var(--zinc-300)]">{agent.label}</div>
          <div className="text-[10px] font-mono mt-0.5" style={{ color: hex + 'aa' }}>
            {agent.desc}
          </div>
        </div>
      </div>
      {agent.tool && (
        <div className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded
                        border border-[var(--border)] inline-block text-[var(--zinc-600)]">
          tool: {agent.tool}
        </div>
      )}
    </div>
  )
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div
      className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]
                 hover:bg-[var(--bg-hover)] transition-all duration-300 animate-slide-up text-left"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-lg text-[var(--zinc-500)] mb-2">{icon}</div>
      <div className="text-xs font-display font-600 text-[var(--zinc-300)] mb-1">{title}</div>
      <div className="text-[11px] text-[var(--zinc-600)] leading-relaxed">{desc}</div>
    </div>
  )
}
