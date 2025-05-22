// components/WorkoutActions.tsx
import * as React from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

interface WorkoutActionsProps {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSearch: () => void;
}

export default function WorkoutActions({ onAdd, onEdit, onDelete, onSearch }: WorkoutActionsProps) {
  const actions = [
    { icon: <AddIcon />, name: 'Add Workout', handler: onAdd },
    { icon: <EditIcon />, name: 'Edit Workout', handler: onEdit },
    { icon: <DeleteIcon />, name: 'Delete Workout', handler: onDelete },
    { icon: <SearchIcon />, name: 'Search Workout', handler: onSearch },
  ];

  return (
    <SpeedDial
      ariaLabel="Workout Actions"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.handler}
        />
      ))}
    </SpeedDial>
  );
}
