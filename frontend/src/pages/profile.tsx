import { useAuth } from "react-oidc-context";
import React, { useState, useEffect } from 'react';
import { Text, Loader} from '@mantine/core';
import ProfileAccordion from '../components/profileAccordion'; // Adjust path if necessary


function Profile() {
    const { isAuthenticated, user } = useAuth();
    const [userPlans, setUserPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // loading state

    const fetchUserPlans = async () => {
        if (isAuthenticated && user?.profile?.sub) { // Add null checks for user and profile
            try {
                setLoading(true); // Set loading to true before fetching
                console.log("Fetching plans for user:", user.profile.sub);
                const response = await fetch(`http://localhost:5000/api/workoutPlan/user/${user.profile.sub}`);
                if (response.ok) {
                    const plans = await response.json();
                    console.log("Fetched plans:", plans);
                    setUserPlans(plans);
                } else {
                    console.error("Failed to fetch user plans:", response.status, await response.text());
                    setUserPlans([]); // Clear plans on error
                }
            }
            catch (error) {
                    console.error("Error fetching user plans", error);
                    setUserPlans([]); // Clear plans on error
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        } else {
            console.log("User not authenticated or user ID missing, clearing plans.");
            setUserPlans([]); // Clear plans if not authenticated
            setLoading(false); // Set loading to false if not authenticated
        }
    };

    useEffect(() => {
        fetchUserPlans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user]); // Dependency array is correct


    const handlePlanUpdate = async (planID: number, updatedWorkouts: any[]) => {
        if (user?.profile?.sub) { // Add null check
            try {
                const workoutsToUpdate = updatedWorkouts.map(workout => ({
                    workoutId: workout.workoutID, 
                    workoutName: workout.workoutName,
                    sets: workout.sets,
                    reps: workout.reps,
                    description: workout.description,
                    videoURL: workout.videoURL,
                    notes: workout.notes
                  }));

                const response = await fetch(`http://localhost:5000/plan/user/${user.profile.sub}/plan/${planID}`, { 
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        //I should add authorization like user.access_token
                    },
                    body: JSON.stringify({ workouts: workoutsToUpdate }), 
                });

                if (response.ok) {
                    console.log(`Plan ${planID} updated successfully.`);
                    fetchUserPlans();
                } else {
                     console.error("Failed to update plan:", response.status, await response.text());
                    // Consider showing an error message to the user
                }
            } catch (error) {
                 console.error("Error updating plan", error);
                 // Consider showing an error message to the user
            }
        } else {
            console.error("Cannot update plan: User not authenticated or user ID missing.");
        }
    };

    
    const handleDeleteWorkout = async (planID: number | string, workoutIDToDelete: number | string) => {
        if (!user?.profile?.sub) {
            console.error("Cannot delete workout: User not authenticated or user ID missing.");
            return; 
        }

        console.log(`Attempting to delete workout ${workoutIDToDelete} from plan ${planID}`);

        try {
            const response = await fetch(`http://localhost:5000/plan/user/${user.profile.sub}/plan/${planID}/workout/${workoutIDToDelete}`, {
                method: 'DELETE',
                headers: {
                    //I should add authorization like user.access_token
                },
            });

            if (response.ok) {
                console.log(`Workout ${workoutIDToDelete} deleted successfully from plan ${planID}.`);
                fetchUserPlans(); 
            } else {
                console.error("Failed to delete workout:", response.status, await response.text());
                // Consider showing an error message to the user
            }
        } catch (error) {
            console.error("Error deleting workout:", error);
            // Consider showing an error message to the user
        }
    };



    return (
        <div>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>

                    <Loader size="lg" />
                </div>
            ) : (
                <>
                    {userPlans.map((plan) => (
                        <div key={plan.planID} style={{ marginBottom: '20px' }}>
                            <ProfileAccordion
                                plan={plan}
                                onEdit={(updatedWorkouts) => handlePlanUpdate(plan.planID, updatedWorkouts)}
                                onDelete={(workoutIDToDelete) => handleDeleteWorkout(plan.planID, workoutIDToDelete)} 
                            />
                        </div>
                    ))}
                    {userPlans.length === 0 && (
                        <Text>No workout plans found. Create one!</Text> 
                    )}
                </>
            )}
        </div>
    );
}

export default Profile;