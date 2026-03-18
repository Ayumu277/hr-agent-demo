import {
  Box, Typography, Chip, Paper, Stack, LinearProgress,
  useMediaQuery, useTheme, Card, CardContent,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import staffsData from '../../data/staffs.json';
import jobsData from '../../data/jobs.json';
import contractsData from '../../data/contracts.json';

const statusLabel: Record<string, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
  working: { label: '稼働中', color: 'success' },
  available: { label: '待機中', color: 'default' },
  expiring: { label: '契約終了間近', color: 'warning' },
  active: { label: '稼働中', color: 'success' },
  renewal_pending: { label: '更新待ち', color: 'warning' },
  expiring_soon: { label: '期限切れ間近', color: 'error' },
  open: { label: '募集中', color: 'error' },
  partially_filled: { label: '一部充足', color: 'warning' },
  filled: { label: '充足', color: 'success' },
};

const staffColumns: GridColDef[] = [
  { field: 'name', headerName: '氏名', width: 120 },
  {
    field: 'skills',
    headerName: 'スキル',
    width: 200,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', py: 0.5 }}>
        {(params.value as string[]).map((s) => (
          <Chip key={s} label={s} size="small" />
        ))}
      </Stack>
    ),
  },
  {
    field: 'status',
    headerName: '稼働状況',
    width: 130,
    renderCell: (params) => {
      const s = statusLabel[params.value as string];
      return s ? <Chip label={s.label} color={s.color} size="small" /> : null;
    },
  },
  { field: 'currentClient', headerName: '派遣先', width: 150 },
];

const jobColumns: GridColDef[] = [
  { field: 'clientName', headerName: 'クライアント', width: 150 },
  { field: 'location', headerName: '勤務地', width: 150 },
  { field: 'requiredCount', headerName: '必要人数', width: 90, type: 'number' },
  {
    field: 'fulfillment',
    headerName: '充足率',
    width: 150,
    renderCell: (params) => {
      const row = params.row;
      const rate = row.requiredCount > 0 ? (row.assignedCount / row.requiredCount) * 100 : 0;
      return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress variant="determinate" value={rate} sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} color={rate >= 100 ? 'success' : rate > 0 ? 'warning' : 'error'} />
          <Typography variant="caption">{Math.round(rate)}%</Typography>
        </Box>
      );
    },
  },
  {
    field: 'status',
    headerName: 'ステータス',
    width: 120,
    renderCell: (params) => {
      const s = statusLabel[params.value as string];
      return s ? <Chip label={s.label} color={s.color} size="small" /> : null;
    },
  },
];

const contractColumns: GridColDef[] = [
  { field: 'staffName', headerName: 'スタッフ', width: 120 },
  { field: 'clientName', headerName: 'クライアント', width: 150 },
  { field: 'startDate', headerName: '開始日', width: 110 },
  { field: 'endDate', headerName: '終了日', width: 110 },
  {
    field: 'status',
    headerName: 'ステータス',
    width: 130,
    renderCell: (params) => {
      const s = statusLabel[params.value as string];
      return s ? <Chip label={s.label} color={s.color} size="small" /> : null;
    },
  },
];

function countByStatus<T extends { status: string }>(data: T[]) {
  const counts: Record<string, number> = {};
  data.forEach((d) => { counts[d.status] = (counts[d.status] || 0) + 1; });
  return counts;
}

type StaffItem = { id: string; name: string; skills: string[]; status: string; currentClient: string | null; qualifications: string[] };
type JobItem = { id: string; clientName: string; location: string; requiredCount: number; assignedCount: number; skills: string[]; hourlyRate: number; status: string };
type ContractItem = { id: string; staffId: string; staffName: string; clientName: string; startDate: string; endDate: string; status: string };

function SectionChips({ counts }: { counts: Record<string, number> }) {
  return (
    <>
      {Object.entries(counts).map(([status, count]) => {
        const s = statusLabel[status];
        return s ? <Chip key={status} label={`${s.label} ${count}`} size="small" color={s.color} variant="outlined" /> : null;
      })}
    </>
  );
}

function StaffCards({ data }: { data: StaffItem[] }) {
  return (
    <Stack spacing={1}>
      {data.map((staff) => {
        const s = statusLabel[staff.status];
        return (
          <Card key={staff.id} variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold">{staff.name}</Typography>
                {s && <Chip label={s.label} color={s.color} size="small" />}
              </Box>
              <Typography variant="caption" color="text.secondary" display="block">
                スキル: {staff.skills.join(', ')}
              </Typography>
              {staff.currentClient && (
                <Typography variant="caption" color="text.secondary" display="block">
                  派遣先: {staff.currentClient}
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

function JobCards({ data }: { data: JobItem[] }) {
  return (
    <Stack spacing={1}>
      {data.map((job) => {
        const s = statusLabel[job.status];
        const rate = job.requiredCount > 0 ? (job.assignedCount / job.requiredCount) * 100 : 0;
        const barColor = rate >= 100 ? 'success' : rate > 0 ? 'warning' : 'error';
        return (
          <Card key={job.id} variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold">{job.clientName}</Typography>
                {s && <Chip label={s.label} color={s.color} size="small" />}
              </Box>
              <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                {job.location}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(rate, 100)}
                  color={barColor}
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption">
                  {job.assignedCount}/{job.requiredCount}名 ({Math.round(rate)}%)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

function ContractCards({ data }: { data: ContractItem[] }) {
  return (
    <Stack spacing={1}>
      {data.map((contract) => {
        const s = statusLabel[contract.status];
        return (
          <Card key={contract.id} variant="outlined">
            <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {contract.staffName} × {contract.clientName}
                </Typography>
                {s && <Chip label={s.label} color={s.color} size="small" />}
              </Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {contract.startDate} 〜 {contract.endDate}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

export default function DashboardPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const staffCounts = countByStatus(staffsData as StaffItem[]);
  const jobCounts = countByStatus(jobsData as JobItem[]);
  const contractCounts = countByStatus(contractsData as ContractItem[]);

  if (isDesktop) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>ダッシュボード</Typography>
        <Stack spacing={3}>
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="h6">スタッフ一覧</Typography>
              <Chip label={`${staffsData.length}名`} size="small" color="primary" />
              <SectionChips counts={staffCounts} />
            </Stack>
            <Box sx={{ height: 400 }}>
              <DataGrid rows={staffsData} columns={staffColumns} pageSizeOptions={[10]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} disableRowSelectionOnClick getRowHeight={() => 'auto'} />
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="h6">案件一覧</Typography>
              <Chip label={`${jobsData.length}件`} size="small" color="primary" />
              <SectionChips counts={jobCounts} />
            </Stack>
            <Box sx={{ height: 400 }}>
              <DataGrid rows={jobsData} columns={jobColumns} pageSizeOptions={[10]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} disableRowSelectionOnClick />
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="h6">契約一覧</Typography>
              <Chip label={`${contractsData.length}件`} size="small" color="primary" />
              <SectionChips counts={contractCounts} />
            </Stack>
            <Box sx={{ height: 400 }}>
              <DataGrid rows={contractsData} columns={contractColumns} pageSizeOptions={[10]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} disableRowSelectionOnClick />
            </Box>
          </Paper>
        </Stack>
      </Box>
    );
  }

  // Mobile layout
  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>ダッシュボード</Typography>
      <Stack spacing={1}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" fontWeight="bold">スタッフ一覧</Typography>
              <Chip label={`${staffsData.length}名`} size="small" color="primary" />
              <SectionChips counts={staffCounts} />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1 }}>
            <StaffCards data={staffsData as StaffItem[]} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" fontWeight="bold">案件一覧</Typography>
              <Chip label={`${jobsData.length}件`} size="small" color="primary" />
              <SectionChips counts={jobCounts} />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1 }}>
            <JobCards data={jobsData as JobItem[]} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" fontWeight="bold">契約一覧</Typography>
              <Chip label={`${contractsData.length}件`} size="small" color="primary" />
              <SectionChips counts={contractCounts} />
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 1 }}>
            <ContractCards data={contractsData as ContractItem[]} />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Box>
  );
}
