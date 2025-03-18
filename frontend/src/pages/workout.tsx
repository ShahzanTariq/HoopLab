import React, { useEffect, useState } from 'react';
import Select from '../components/multiselect';
import TableSelection from '../components/table';

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

  //Fetches workouts from the database
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
  //Filters workouts based on selected level and category
  const filteredWorkouts = workouts.filter((workout: any) => {
    const levelText = levelMap[workout.level as keyof typeof levelMap]; //Convert Level number to text
    const levelMatch = selectedLevel.length === 0 || selectedLevel.includes(levelText);
    const categoryMatch = selectedCategory.length === 0 || 
    selectedCategory.some(c => workout.category.includes(c.toLowerCase()));
    return levelMatch && categoryMatch;
  });

  return (
    <div>
      <h2>Workouts</h2>

      <Select 
        options = {['Beginner', 'Intermediate', 'Advanced', 'Professional']}
        label = "Select Levels"
        placeholder = "Click here to select levels"
        onChange={(level) => setSelectedLevel(level)}
      />
      <Select
        options = {['Dribbling', 'Shooting', 'Finishing', 'Passing']}
        label = "Select Categories"
        placeholder = "Click here to select categories"
        onChange={(category) => setSelectedCategory(category)}
      />
      
      <h3>Our Workouts</h3>
      <TableSelection data={workouts} />
      <ul>
        {filteredWorkouts.map((workout: any) => (
          <li key={workout.workoutID}>
            <strong>{workout.workoutName}</strong> - {workout.sets} x {workout.reps} reps
            <br />
            Level: {workout.level as keyof typeof levelMap}
            <br />
            Category: {workout.category}
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
