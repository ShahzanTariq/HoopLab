import { useAuth } from "react-oidc-context";
import React, { useState, useEffect } from 'react';
import { Title, Table, Text, Button, Modal, TextInput, NumberInput} from '@mantine/core';
import ProfileAccordion from '../components/profileAccordion';


function Profile() {
    const { isAuthenticated, user } = useAuth();
    const [userPlans, setUserPlans] = useState<any[]>([]);
    const [opened, setOpened] = useState(false); // For editing modal
    const [editingPlan, setEditingPlan] = useState<any>(userPlans[0]) // current plan being edited
    const [editedPlanName, setEditedPlanName] = useState(""); // state for edited plan values
    const [editedWorkouts, setEditedWorkouts] = useState<any[]>([]);


    useEffect(() => {
        const fetchUserPlans = async () => {
            if (isAuthenticated && user) {
                try {
                    const response = await fetch(`http://localhost:5000/api/workoutPlan/user/${user.profile.sub}`);
                    if (response.ok) {
                        const plans = await response.json();
                        console.log(plans)
                        setUserPlans(plans);
                    } else {
                        
                    }
                } 
                catch (error) {
                        console.error("Error fetching user plans", error);
                }
            }
        };

    fetchUserPlans();
    }, [isAuthenticated, user]);

    const handleEditClick = (plan:any) => {
        setEditingPlan(plan);
        setEditedPlanName(plan.planName);
        setEditedWorkouts([...plan.workouts]);
        setOpened(true);
    };

    const handlePlanNameChange = (event:any) => {
        setEditedPlanName(event.currentTarget.value)
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Or any other desired format
    };

    return (
        <div>
            {editingPlan!= null &&
                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title= {"Editing " + editingPlan.planName}
                >
                    <Text>Greetings</Text>

                </Modal>
            
            }
            
            {userPlans.map((plan) => (
            <div key={plan.planID}>

                <ProfileAccordion plan={plan} /> {/* Pass the individual plan as a prop */}
                <Button onClick={() => handleEditClick(plan)}>Edit</Button>


            </div>
        

            ))}
    </div>
    );
}


export default Profile;