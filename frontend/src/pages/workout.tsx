import React, { useState, useEffect } from 'react';
import Select from '../components/multiselect';
import TableSelection from '../components/table';
import { Group, Button } from '@mantine/core';
import { useAuth } from 'react-oidc-context';
import WorkoutPlanMenu from '../components/workoutPlanMenu';
import './styles/workout.css';

const Workout: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [userPlans, setUserPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]); // Track selected workouts here
  
  const levelMap = {
    1: 'Beginner',
    2: 'Intermediate',
    3: 'Advanced',
    4: 'Professional'
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://localhost:5000/workout');
        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const filteredWorkouts = workouts.filter((workout: any) => {
    const levelText = levelMap[workout.level as keyof typeof levelMap];
    const levelMatch = selectedLevel.length === 0 || selectedLevel.includes(levelText);
    const categoryMatch = selectedCategory.length === 0 || selectedCategory.some(c => workout.category.includes(c.toLowerCase()));
    return levelMatch && categoryMatch;
  });

  const fetchUserPlans = async (createNew: boolean) => {
    if (isAuthenticated && user) {
      try {
      const response = await fetch(`http://localhost:5000/api/workoutPlan/user/${user.profile.sub}`);
      if (response.ok) {
          const plans = await response.json();
          console.log(plans)
          setUserPlans(plans);
          if(plans.length > 0 && !createNew){
              setSelectedPlan(plans[0]);
          }

      } else {
          
      }
      } catch (error) {
      console.error("Error fetching user plans", error);
      }
    }
  };

    useEffect(() => {
        fetchUserPlans(false);
    }, []);

  const handleWorkoutSelectionChange = (selectedRows: string[]) => {
    setSelectedWorkouts(selectedRows);
  };

  const handleAddToPlan = async () => {
    if (!selectedPlan) {
        alert("Please select a plan or create a new plan first.");
        return;
    }

    if (selectedWorkouts.length === 0) {
        alert("Please select workouts to add to the plan.");
        return;
    }
    if (!user) {
        alert("Please log in to add workouts to your plan.");
        return;
    }
    console.log(selectedWorkouts);
    try {
        const workoutsToAdd = selectedWorkouts.map(workout => ({
            workoutId: workout.workoutID,
            workoutName: workout.workoutName,
            sets: workout.sets,
            reps: workout.reps,
            description: workout.description,
            videoURL: workout.videoURL,
            category: workout.category,
            notes: ""
          }));

      const response = await fetch('http://localhost:5000/api/workoutPlan/addWorkouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.profile.sub,
          planId: selectedPlan.planID,
          workouts: workoutsToAdd,
        }),
      });

      if (response.ok) {
        alert('Workouts added to your plan!');
        setSelectedWorkouts([]);
      } else {
        const errorData = await response.json();
        alert(`Error adding workouts: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding workouts:', error);
      alert('An error occurred while adding workouts.');
    }
  };

  const handleCreatePlan = async () => {
    const planName = prompt("Enter a name for your new workout plan:");
    if (planName) {
      if (!user) {
        alert("Please log in to create a new plan.");
        return;
      }
      console.log(JSON.stringify({ userId: user.profile.sub, planName }));
      try {
          const response = await fetch('http://localhost:5000/api/workoutPlan/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.profile.sub, planName }),
          });

          if (response.ok) {
            const {planID} = await response.json();
            const newPlan = { planID, planName }; 
            fetchUserPlans(true);
            setUserPlans([...userPlans, newPlan]);
            setSelectedPlan(newPlan) 
          } else {
          // Handle error
          }
        } catch (error) {
        // Handle error
    }
    }

};



  const handlePlanSelect = (plan: any | null) => {
      setSelectedPlan(plan);
  };

  return (
    <div className="workout-container">
      <h2 className="workout-title">Workouts</h2>
      <div className="filter-group">
        <Select
          options={['Beginner', 'Intermediate', 'Advanced', 'Professional']}
          label="Select Levels"
          placeholder="Click here to select levels"
          onChange={(level) => setSelectedLevel(level)}
        />
        <Select
          options={['Dribbling', 'Shooting', 'Finishing', 'Passing']}
          label="Select Categories"
          placeholder="Click here to select categories"
          onChange={(category) => setSelectedCategory(category)}
        />
        <WorkoutPlanMenu
          userPlans={userPlans}
          selectedPlan={selectedPlan}
          onCreatePlan={handleCreatePlan}
          onSelectPlan={handlePlanSelect}
        />
      </div>
      <h3 className="table-title">Our Workouts</h3>
      <div className="table-container">
        <TableSelection
          data={filteredWorkouts}
          onSelectionChange={handleWorkoutSelectionChange}
        />
      </div>
      <Button
        className="add-to-plan-button"
        onClick={handleAddToPlan}
        disabled={!selectedPlan || selectedWorkouts.length === 0}
      >
        Add to Plan
      </Button>
    </div>
  );
};

export default Workout;