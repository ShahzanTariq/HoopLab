import React, { useEffect, useState } from 'react';

const Workout: React.FC = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://localhost:5000/workouts');
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <div>
      <h2>Workouts</h2>
      <ul>
        {workouts.map((workout: any) => (
          <li key={workout.workoutid}>{workout.name} - {workout.reps} reps</li>
        ))}
      </ul>
    </div>
  );
};

export default Workout;