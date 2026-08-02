import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import DataTable from '../../components/DataTable/DataTable.jsx'
import Button from '../../components/Button/Button.jsx'
import StatusBadge from '../../components/StatusBadge/StatusBadge.jsx'
import CommunityTabs from './CommunityTabs.jsx'
import { communityService } from '../../services/communityService'
import { useToast } from '../../hooks/useToast'
import { formatDate } from '../../utils/formatDate'
import styles from './Community.module.css'

function CommunityReports() {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  const loadReports = () => {
    setIsLoading(true)
    communityService.getReports().then((result) => {
      setReports(result)
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadReports()
  }, [])

  const handleResolve = async (report) => {
    await communityService.resolveReport(report.id)
    showToast('Report marked as resolved.', 'success')
    loadReports()
  }

  const columns = [
    { key: 'id', header: 'Report ID' },
    { key: 'targetType', header: 'Target Type', render: (r) => (r.targetType === 'post' ? 'Post' : 'Comment') },
    { key: 'targetId', header: 'Target ID' },
    { key: 'reportedBy', header: 'Reported By' },
    { key: 'reason', header: 'Reason' },
    { key: 'createdAt', header: 'Reported On', render: (r) => formatDate(r.createdAt) },
    {
      key: 'resolved',
      header: 'Status',
      render: (r) =>
        r.resolved ? (
          <StatusBadge status="resolved" tone="success" label="Resolved" />
        ) : (
          <StatusBadge status="open" tone="warning" label="Open" />
        ),
    },
    {
      key: 'actions',
      header: '',
      render: (report) =>
        !report.resolved && (
          <Button variant="primary" icon="fa-solid fa-check" onClick={() => handleResolve(report)}>
            Resolve
          </Button>
        ),
    },
  ]

  return (
    <div>
      <PageHeader title="Community" description="Moderate posts, comments, and reports across the HealMind community." />
      <CommunityTabs />
      <DataTable columns={columns} rows={reports} isLoading={isLoading} emptyTitle="No reports found" />
    </div>
  )
}

export default CommunityReports
