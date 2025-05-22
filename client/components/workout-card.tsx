import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardMedia,
} from '@mui/material';
import { Workout } from '../app/types/workout';


interface WorkoutCardProps{
  workout:Workout
}

const workout: Workout = {
  name: 'Full Body Burn',
  description: 'A high-intensity full-body workout to improve endurance and strength.',
  duration: 40,
  difficulty: 'Intermediate',
  image: 'https://source.unsplash.com/featured/?fitness,workout',
};

const WorkoutCard: React.FC<WorkoutCardProps> = ({workout}) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      {workout.image && (
        <CardMedia
          component="img"
          height="140"
          image={workout.image}
          alt={workout.name}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {workout.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {workout.description}
        </Typography>
        <Typography variant="subtitle2" color="text.primary" mt={1}>
          Duration: {workout.duration} mins
        </Typography>
        <Typography variant="subtitle2" color="text.primary">
          Difficulty: {workout.difficulty}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
