export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  startTimer(label: string): () => void {
    const start = performance.now()
    
    return () => {
      const duration = performance.now() - start
      this.recordMetric(label, duration)
    }
  }

  recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    
    const values = this.metrics.get(label)!
    values.push(value)
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  getStats(label: string) {
    const values = this.metrics.get(label) || []
    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)

    return {
      mean: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count: values.length
    }
  }

  logAllStats(): void {
    console.group('Performance Metrics')
    for (const [label, _] of this.metrics) {
      const stats = this.getStats(label)
      if (stats) {
        console.log(`${label}:`, stats)
      }
    }
    console.groupEnd()
  }
}

// Global instance
export const perfMonitor = new PerformanceMonitor()