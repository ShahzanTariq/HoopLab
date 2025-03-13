import React, { useEffect, useState } from 'react';
import Dropdown from './dropdown';

const Workout: React.FC = () => {
  const [workouts, setWorkouts] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const levelMap = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced',
    4: 'Professional'
  };

  // Fetches workouts from the database
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://localhost:5000/workouts');
        const data = await response.json();
        const workoutsWithCategorySet = data.map((workout: any) => {
          const categorySet = new Set(workout.category || []); // Handle empty categories
          return {
            ...workout,
            category: categorySet
          };
        });
        setWorkouts(workoutsWithCategorySet);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  // Filters workouts based on selected level and category
  const filteredWorkouts = workouts.filter((workout: any) => {
    const levelText = levelMap[workout.level as keyof typeof levelMap]; // Convert Level number to text
    const levelMatch = selectedLevel.length === 0 || selectedLevel.includes(levelText);
    const categoryMatch = selectedCategory.length === 0 || 
      selectedCategory.some(c => workout.category.has(c.toLowerCase()));
    return levelMatch && categoryMatch;
  });

  return (
    <div>
      <h2>Workouts</h2>

      <Dropdown
        options={['Beginner', 'Intermediate', 'Advanced', 'Professional']}
        label="Select Level"
        onSelect={(level) => setSelectedLevel(level)}
      />
      
      <Dropdown
        options={['Dribbling', 'Shooting', 'Finishing', 'Passing']}
        label="Select Category"
        onSelect={(category) => setSelectedCategory(category)}
      />
      
      <h3>Filtered Workouts</h3>
      <ul>
        {filteredWorkouts.map((workout: any) => (
          <li key={workout.workoutID}>
            <strong>{workout.workoutName}</strong> - {workout.sets} x {workout.reps} reps
            <br />
            Level: {levelMap[workout.level as keyof typeof levelMap]}
            <br />
            Categories: {[...workout.category].join(', ')}
            <br />
            Description: {workout.description}
            <br />
            <a href={workout.videoURL} target="_blank" rel="noopener noreferrer">
              Watch Video
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workout;