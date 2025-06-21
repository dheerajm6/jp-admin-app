import { supabase } from '../lib/supabase'

export interface RepresentativeStats {
  total: number
  by_type: { type: string; count: number }[]
  by_party: { party: string; count: number }[]
  by_gender: { gender: string; count: number }[]
  by_state: { state: string; count: number }[]
  by_area: { area: string; count: number }[]
}

export interface ConstituencyStats {
  state: string
  total_constituencies: number
  covered_constituencies: number
  coverage_percentage: number
  representatives: number
}

export interface PartyWorkerStats {
  party: string
  total_workers: number
  active_workers: number
  inactive_workers: number
  activity_rate: number
}

export interface SentimentData {
  date: string
  positive: number
  neutral: number
  negative: number
  total_sentiments: number
}

export interface EngagementMetrics {
  social_media_activity: number
  public_response_rate: number
  meeting_attendance: number
  scheme_participation: number
}

class PoliticalIntelligenceService {
  async getRepresentativeStats(filters?: {
    state?: string
    party?: string
    gender?: string
    dateRange?: [string, string]
  }): Promise<RepresentativeStats> {
    try {
      let query = supabase
        .from('representatives')
        .select(`
          id,
          type,
          party,
          gender,
          status,
          constituencies (
            state
          )
        `)
        .eq('status', 'active')

      if (filters?.state && filters.state !== 'all') {
        query = query.eq('constituencies.state', filters.state)
      }

      if (filters?.party && filters.party !== 'all') {
        query = query.eq('party', filters.party)
      }

      if (filters?.gender && filters.gender !== 'all') {
        query = query.eq('gender', filters.gender)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching representative stats:', error)
        throw error
      }

      // Process the data to create stats
      const stats: RepresentativeStats = {
        total: data?.length || 0,
        by_type: this.groupByField(data || [], 'type') as { type: string; count: number }[],
        by_party: this.groupByField(data || [], 'party') as { party: string; count: number }[],
        by_gender: this.groupByField(data || [], 'gender') as { gender: string; count: number }[],
        by_state: this.groupByField(data || [], 'constituencies.state') as { state: string; count: number }[],
        by_area: this.calculateRuralUrbanStats(data || [])
      }

      return stats
    } catch (error) {
      console.error('Error in getRepresentativeStats:', error)
      // Return mock data as fallback
      return this.getMockRepresentativeStats()
    }
  }

  async getConstituencyStats(filters?: {
    state?: string
  }): Promise<ConstituencyStats[]> {
    try {
      // Get constituency data with representative counts
      let constituencyQuery = supabase
        .from('constituencies')
        .select('state, type')

      if (filters?.state && filters.state !== 'all') {
        constituencyQuery = constituencyQuery.eq('state', filters.state)
      }

      const { data: constituencies, error: constituencyError } = await constituencyQuery

      if (constituencyError) throw constituencyError

      // Get representative counts by state
      let representativeQuery = supabase
        .from('representatives')
        .select(`
          id,
          constituencies (
            state
          )
        `)
        .eq('status', 'active')

      if (filters?.state && filters.state !== 'all') {
        representativeQuery = representativeQuery.eq('constituencies.state', filters.state)
      }

      const { data: representatives, error: repError } = await representativeQuery

      if (repError) throw repError

      // Process data to create constituency stats
      const stateGroups = this.groupByField(constituencies || [], 'state')
      const repByState = this.groupByField(representatives || [], 'constituencies.state')

      const stats: ConstituencyStats[] = stateGroups.map(state => {
        const reps = repByState.find(r => r.field === state.field)
        const covered = reps?.count || 0
        const total = state.count
        
        return {
          state: state.field,
          total_constituencies: total,
          covered_constituencies: covered,
          coverage_percentage: total > 0 ? Math.round((covered / total) * 100) : 0,
          representatives: covered
        }
      })

      return stats
    } catch (error) {
      console.error('Error in getConstituencyStats:', error)
      // Return mock data as fallback
      return this.getMockConstituencyStats()
    }
  }

  async getPartyWorkerStats(): Promise<PartyWorkerStats[]> {
    try {
      // This would require a party_workers table which might not exist yet
      // For now, return mock data
      return this.getMockPartyWorkerStats()
    } catch (error) {
      console.error('Error in getPartyWorkerStats:', error)
      return this.getMockPartyWorkerStats()
    }
  }

  async getSentimentData(dateRange?: [string, string]): Promise<SentimentData[]> {
    try {
      // This would require a sentiment_analysis table which might not exist yet
      // For now, return mock data
      return this.getMockSentimentData()
    } catch (error) {
      console.error('Error in getSentimentData:', error)
      return this.getMockSentimentData()
    }
  }

  async getEngagementMetrics(): Promise<EngagementMetrics> {
    try {
      // This would require social media and engagement tracking tables
      // For now, return mock data
      return this.getMockEngagementMetrics()
    } catch (error) {
      console.error('Error in getEngagementMetrics:', error)
      return this.getMockEngagementMetrics()
    }
  }

  // Helper function to group data by field
  private groupByField(data: any[], field: string): { [key: string]: any; count: number }[] {
    const counts: { [key: string]: number } = {}
    
    data.forEach(item => {
      const value = this.getNestedValue(item, field)
      if (value) {
        counts[value] = (counts[value] || 0) + 1
      }
    })

    // Create appropriate field name based on the field being grouped
    const fieldName = field.includes('.') ? field.split('.').pop() || 'field' : field

    return Object.entries(counts).map(([value, count]) => ({ 
      [fieldName]: value, 
      count 
    }))
  }

  // Helper function to get nested object values
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null
    }, obj)
  }

  // Calculate rural/urban distribution based on constituency data
  private calculateRuralUrbanStats(data: any[]): { area: string; count: number }[] {
    // In a real implementation, this would query constituency demographics
    // For now, we'll use a mock distribution based on Indian rural/urban ratios
    const total = data.length
    const ruralCount = Math.floor(total * 0.65) // Approximately 65% rural in India
    const urbanCount = total - ruralCount

    return [
      { area: 'Rural', count: ruralCount },
      { area: 'Urban', count: urbanCount }
    ]
  }

  // Mock data methods (fallbacks)
  private getMockRepresentativeStats(): RepresentativeStats {
    return {
      total: 327,
      by_type: [
        { type: 'MLA', count: 224 },
        { type: 'MP', count: 28 },
        { type: 'MLC', count: 75 }
      ],
      by_party: [
        { party: 'BJP', count: 104 },
        { party: 'Congress', count: 136 },
        { party: 'JD(S)', count: 37 },
        { party: 'Others', count: 50 }
      ],
      by_gender: [
        { gender: 'Male', count: 276 },
        { gender: 'Female', count: 51 }
      ],
      by_state: [
        { state: 'Karnataka', count: 189 },
        { state: 'Tamil Nadu', count: 138 }
      ],
      by_area: [
        { area: 'Rural', count: 213 },
        { area: 'Urban', count: 114 }
      ]
    }
  }

  private getMockConstituencyStats(): ConstituencyStats[] {
    return [
      { state: 'Karnataka', total_constituencies: 224, covered_constituencies: 189, coverage_percentage: 84, representatives: 189 },
      { state: 'Tamil Nadu', total_constituencies: 234, covered_constituencies: 198, coverage_percentage: 85, representatives: 198 },
      { state: 'Andhra Pradesh', total_constituencies: 175, covered_constituencies: 142, coverage_percentage: 81, representatives: 142 },
      { state: 'Telangana', total_constituencies: 119, covered_constituencies: 95, coverage_percentage: 80, representatives: 95 },
      { state: 'Kerala', total_constituencies: 140, covered_constituencies: 124, coverage_percentage: 89, representatives: 124 }
    ]
  }

  private getMockPartyWorkerStats(): PartyWorkerStats[] {
    return [
      { party: 'BJP', total_workers: 12500, active_workers: 10200, inactive_workers: 2300, activity_rate: 82 },
      { party: 'Congress', total_workers: 15600, active_workers: 11800, inactive_workers: 3800, activity_rate: 76 },
      { party: 'JD(S)', total_workers: 8900, active_workers: 7200, inactive_workers: 1700, activity_rate: 81 },
      { party: 'AAP', total_workers: 4500, active_workers: 3600, inactive_workers: 900, activity_rate: 80 },
      { party: 'Others', total_workers: 6800, active_workers: 4900, inactive_workers: 1900, activity_rate: 72 }
    ]
  }

  private getMockSentimentData(): SentimentData[] {
    return [
      { date: '2024-01-01', positive: 450, neutral: 680, negative: 280, total_sentiments: 1410 },
      { date: '2024-01-07', positive: 520, neutral: 720, negative: 310, total_sentiments: 1550 },
      { date: '2024-01-14', positive: 480, neutral: 690, negative: 340, total_sentiments: 1510 },
      { date: '2024-01-21', positive: 610, neutral: 750, negative: 290, total_sentiments: 1650 },
      { date: '2024-01-28', positive: 580, neutral: 710, negative: 320, total_sentiments: 1610 }
    ]
  }

  private getMockEngagementMetrics(): EngagementMetrics {
    return {
      social_media_activity: 85,
      public_response_rate: 72,
      meeting_attendance: 68,
      scheme_participation: 91
    }
  }
}

export const politicalIntelligenceService = new PoliticalIntelligenceService()