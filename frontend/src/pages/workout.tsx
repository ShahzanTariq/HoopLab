import React, { useEffect, useState } from 'react';
import Select from '../components/multiselect';
import TableSelection from '../components/table';
import {Group, Button} from '@mantine/core';
import { useAuth } from 'react-oidc-context';

const Workout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

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

  const handleWorkoutSelectionChange = (selectedRows: string[]) => {
    setSelectedWorkouts(selectedRows);
  };

  const handleAddToPlan = async () => {
    if (!isAuthenticated || !user) {
      alert('Please log in to add workouts to your plan.');
      return;
    }
    try {
      const response = await fetch('/api/workoutPlan', { // New API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.profile.sub, // User ID from Auth0 (or however you identify users)
          workouts: selectedWorkouts.map(workoutId => ({ workoutId })), // Send array of selected workout IDs
        }),
      });

      if (response.ok) {
        alert('Workouts added to your plan!');
        setSelectedWorkouts([]); // Clear selection after adding
      } else {
        const errorData = await response.json();
        alert(`Error adding workouts: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding workouts:', error);
      alert('An error occurred while adding workouts.');
    }
  };

  return (
    <div>
      <h2>Workouts</h2>
      <Group>
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
        
      </Group>
      <h3>Our Workouts</h3>
      <TableSelection data={filteredWorkouts} onSelectionChange={handleWorkoutSelectionChange} />
      <Button onClick={handleAddToPlan} disabled={!isAuthenticated || selectedWorkouts.length === 0}>
          Add to My Plan
        </Button>
    </div>
  );
};

export default Workout;
