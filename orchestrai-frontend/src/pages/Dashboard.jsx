import { useCallback } from 'react'
import Navbar from '../components/Navbar'
import TopicInput from '../components/TopicInput'
import PipelineFlow from '../components/PipelineFlow'
import ExecutionLog from '../components/ExecutionLog'
import ReportViewer from '../components/ReportViewer'
import { useSSEStream } from '../hooks/useSSEStream'

export default function Dashboard() {
  const {
    rawLogs,
    milestones,
    collapsedMilestoneCount,
    steps,
    report,
    feedback,
    runStatus,
    error,
    topic,
    isRunning,
    isDone,
    start,
    reset,
    retry,
  } = useSSEStream()

  const handleStart = useCallback((nextTopic) => start(nextTopic), [start])
  const handleReset = useCallback(() => reset(), [reset])
  const completedSteps = Object.values(steps).filter((step) => step.status === 'done').length
  const totalSteps = Object.values(steps).length
  const reportWords = report.split(/\s+/).filter(Boolean).length
  const critiqueWords = feedback.split(/\s+/).filter(Boolean).length

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar onReset={handleReset} />

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="py-2">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">Multi-Agent Research System</p>
              <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                Multi-Agent Research System
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                AI-powered research pipeline with real-time execution, durable report state, quality critique, and readable progress.
              </p>
            </div>
            <RunStatusBadge status={runStatus} isDone={isDone} />
          </div>

        </section>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Research summary">
          <MetricCard label="Pipeline" value={`${completedSteps}/${totalSteps}`} detail="stages completed" />
          <MetricCard label="Report" value={reportWords ? reportWords.toLocaleString() : '0'} detail="words generated" />
          <MetricCard label="Critique" value={critiqueWords ? critiqueWords.toLocaleString() : '0'} detail="review words" />
        </section>

        {error && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            {error}
          </div>
        )}

        <TopicInput
          onStart={handleStart}
          onClear={handleReset}
          onRetry={retry}
          canRetry={runStatus === 'failed'}
          isRunning={isRunning}
          currentTopic={topic}
        />

        <PipelineFlow steps={steps} />

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <ReportViewer
            report={report}
            feedback={feedback}
            status={runStatus}
            error={error}
            topic={topic}
          />

          <ExecutionLog
            milestones={milestones}
            rawLogs={rawLogs}
            collapsedCount={collapsedMilestoneCount}
            isRunning={isRunning}
          />
        </div>
      </main>
    </div>
  )
}

function RunStatusBadge({ status, isDone }) {
  const labelMap = {
    idle: 'Ready',
    loading: 'Loading',
    running: 'Pipeline Running',
    generating_report: 'Generating Report',
    completed: 'Report Ready',
    failed: 'Failed',
  }

  const tone = status === 'failed'
    ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300'
    : isDone
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
      : 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300'

  return (
    <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm ${tone}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {labelMap[status] || 'Ready'}
    </div>
  )
}

function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{detail}</p>
    </div>
  )
}
