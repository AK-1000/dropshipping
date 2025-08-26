import { SupabaseClient } from '@supabase/supabase-js'

export class QueryOptimizer {
  private supabase: SupabaseClient
  private cache: Map<string, { data: any; timestamp: number }>
  private cacheTTL: number = 5 * 60 * 1000 // 5 minutes

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
    this.cache = new Map()
  }

  // Batch fetch with caching
  async batchFetch<T>(
    table: string,
    ids: string[],
    cacheKey?: string
  ): Promise<T[]> {
    const key = cacheKey || `${table}:${ids.join(',')}`
    const cached = this.getFromCache(key)
    
    if (cached) return cached

    const { data, error } = await this.supabase
      .from(table)
      .select('*')
      .in('id', ids)
      .limit(100) // Prevent large queries

    if (error) throw error
    
    this.setCache(key, data)
    return data as T[]
  }

  // Paginated fetch with cursor
  async paginatedFetch<T>(
    table: string,
    options: {
      pageSize?: number
      cursor?: string
      filters?: Record<string, any>
      orderBy?: { column: string; ascending?: boolean }
    }
  ): Promise<{ data: T[]; nextCursor?: string }> {
    let query = this.supabase.from(table).select('*')

    // Apply filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      })
    }

    // Apply pagination
    const pageSize = options.pageSize || 20
    query = query.limit(pageSize + 1)

    if (options.cursor) {
      query = query.gt('id', options.cursor)
    }

    const { data, error } = await query

    if (error) throw error

    const hasMore = data && data.length > pageSize
    const items = hasMore ? data.slice(0, -1) : data

    return {
      data: items as T[],
      nextCursor: hasMore ? items[items.length - 1].id : undefined
    }
  }

  // Debounced search
  private searchDebounceTimers: Map<string, NodeJS.Timeout> = new Map()

  async debouncedSearch<T>(
    table: string,
    searchTerm: string,
    columns: string[],
    debounceMs: number = 300
  ): Promise<T[]> {
    const key = `search:${table}:${searchTerm}`

    return new Promise((resolve, reject) => {
      const existingTimer = this.searchDebounceTimers.get(key)
      if (existingTimer) {
        clearTimeout(existingTimer)
      }

      const timer = setTimeout(async () => {
        try {
          const searchQuery = columns
            .map(col => `${col}.ilike.%${searchTerm}%`)
            .join(',')

          const { data, error } = await this.supabase
            .from(table)
            .select('*')
            .or(searchQuery)
            .limit(50)

          if (error) throw error
          resolve(data as T[])
        } catch (error) {
          reject(error)
        } finally {
          this.searchDebounceTimers.delete(key)
        }
      }, debounceMs)

      this.searchDebounceTimers.set(key, timer)
    })
  }

  // Cache helpers
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > this.cacheTTL
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private setCache(key: string, data: any): void {
  this.cache.set(key, { data, timestamp: Date.now() })
  
  // Limit cache size
  if (this.cache.size > 100) {
    const firstKeyIteratorResult = this.cache.keys().next()
    if (!firstKeyIteratorResult.done) {
      const firstKey = firstKeyIteratorResult.value
      this.cache.delete(firstKey)
    }
  }
}

  // Bulk operations with transaction-like behavior
  async bulkInsert<T>(
    table: string,
    items: T[],
    batchSize: number = 100
  ): Promise<T[]> {
    const results: T[] = []
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      const { data, error } = await this.supabase
        .from(table)
        .insert(batch)
        .select()

      if (error) throw error
      results.push(...(data as T[]))
    }

    return results
  }

  // Optimistic updates
  async optimisticUpdate<T>(
    table: string,
    id: string,
    updates: Partial<T>,
    rollbackFn?: () => void
  ): Promise<T> {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as T
    } catch (error) {
      if (rollbackFn) rollbackFn()
      throw error
    }
  }
}