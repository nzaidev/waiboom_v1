'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'

// Define types for our data
type Workspace = {
  id: string
  name: string
  owner_id: string
  created_at: string
}

type Agent = {
  id: string
  name: string
  workspace_id: string
  created_at: string
}

export default function DashboardPage() {
  // State for managing data and loading states
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current user's session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        if (!session?.user) throw new Error('No user session found')

        // Get the user's workspace
        const { data: workspaceData, error: workspaceError } = await supabase
          .from('workspaces')
          .select('*')
          .eq('owner_id', session.user.id)
          .single()

        if (workspaceError) throw workspaceError
        if (!workspaceData) throw new Error('No workspace found')

        setWorkspace(workspaceData)

        // Get all agents for this workspace
        const { data: agentsData, error: agentsError } = await supabase
          .from('agents')
          .select('*')
          .eq('workspace_id', workspaceData.id)
          .order('created_at', { ascending: false })

        if (agentsError) throw agentsError
        setAgents(agentsData || [])

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading your workspace data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-red-500">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Workspace Info */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace: {workspace?.name}</CardTitle>
        </CardHeader>
      </Card>

      {/* Agents List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Agents</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <p className="text-center text-muted-foreground">No agents found. Create your first agent to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{format(new Date(agent.created_at), 'PPP')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 