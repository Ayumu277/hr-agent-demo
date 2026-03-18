import { Stack, Chip } from '@mui/material';
import { scenarios } from '../scenarios';

interface Props {
  onSelect: (trigger: string) => void;
  disabled?: boolean;
}

export default function ScenarioChips({ onSelect, disabled }: Props) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        flexWrap: { xs: 'nowrap', md: 'wrap' },
        overflowX: { xs: 'auto', md: 'visible' },
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        gap: 1,
      }}
    >
      {scenarios.map((s) => (
        <Chip
          key={s.id}
          label={s.label}
          onClick={() => onSelect(s.trigger)}
          disabled={disabled}
          color="primary"
          variant="outlined"
          clickable
        />
      ))}
    </Stack>
  );
}
