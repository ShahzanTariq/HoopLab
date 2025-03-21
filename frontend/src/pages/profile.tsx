import { useAuth } from "react-oidc-context";
import React, { useState, useEffect } from 'react';
import { Title, Table, Text } from '@mantine/core';




function Profile() {
  const { isAuthenticated, user } = useAuth();
  const [userPlans, setUserPlans] = useState<any[]>([]);


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
        } catch (error) {
        console.error("Error fetching user plans", error);
        }
    }
    };

    fetchUserPlans();
}, [isAuthenticated, user]);

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Or any other desired format
};

return (
  <div>
      {userPlans.map((plan) => {
          const rows = plan.workouts.map((workout: any) => (
              <Table.Tr key={workout.workoutId}>
                  <Table.Td>{workout.workoutName}</Table.Td>
                  <Table.Td>{workout.sets}</Table.Td>
                  <Table.Td>{workout.reps}</Table.Td>
              </Table.Tr>
          ));

          return (
              <div key={plan.planId}>
                  <Title order={3}>{plan.planName}</Title>
                  <Table>
                      <Table.Thead>
                          <Table.Tr>
                              <Table.Th >Workout Name</Table.Th>
                              <Table.Th>Sets</Table.Th>
                              <Table.Th>Reps</Table.Th>
                          </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>{rows}</Table.Tbody>
                  </Table>
                  <Text color="dimmed" size="sm" mt="xs">
                      Last Updated: {formatDate(plan.updatedAt)}
                  </Text>
              </div>
          );
      })}
          </div>
      );
  }


export default Profile;