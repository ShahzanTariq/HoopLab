// profileAccordion.tsx
import { Accordion, ActionIcon, AccordionControlProps, Center, Table, Text, TextInput, NumberInput, Group } from '@mantine/core';
// Import IconTrash
import { IconPencil, IconCheck, IconX, IconTrash } from '@tabler/icons-react';
import React, { useState, useEffect } from 'react';
import classes from './styles/profileAccoridion.module.css';


interface AccordionProps {
    plan: any; // Accept a single plan as a prop
    onEdit: (updatedWorkouts: any[]) => void; // Parent function to handle the save action
    onDelete: (workoutIDToDelete: number | string) => void; // Add prop for delete action
}

// AccordionControl remains the same
function AccordionControl(props: AccordionControlProps) {
    return (
        <Center>
            <Accordion.Control {...props} />
        </Center>
    );
}

const ProfileAccordion: React.FC<AccordionProps> = ({ plan, onEdit, onDelete }) => { // Destructure onDelete

    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
    const [editedWorkouts, setEditedWorkouts] = useState([...plan.workouts]);

    useEffect(() => {
        setEditedWorkouts([...plan.workouts]);
        setEditingRowIndex(null);
    }, [plan]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleWorkoutChange = (index: number, field: string, value: any) => {
        const updatedWorkouts = editedWorkouts.map((workout, i) => {
            if (i === index) {
                return { ...workout, [field]: value };
            }
            return workout;
        });
        setEditedWorkouts(updatedWorkouts);
    };

    const handleEditClick = (index: number) => {
        setEditingRowIndex(index);
    };

    const handleSaveClick = (index: number) => {
        onEdit(editedWorkouts); // Send the whole list, parent can diff or replace
        setEditingRowIndex(null);
    };

    const handleCancelClick = (index: number) => {
        const revertedWorkouts = [...editedWorkouts];
        revertedWorkouts[index] = { ...plan.workouts[index] };
        setEditedWorkouts(revertedWorkouts);
        setEditingRowIndex(null);
    };

    // --- New Delete Handler ---
    const handleDeleteClick = (workoutIDToDelete: number | string) => {
        console.log(workoutIDToDelete)
        // Confirmation dialog
        if (window.confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
            // Call the parent handler passed via props
            onDelete(workoutIDToDelete);
            // Optional: Optimistically remove from local state for immediate feedback
            // Note: This might be redundant if the parent component updates the 'plan' prop quickly
            // setEditedWorkouts(currentWorkouts =>
            //     currentWorkouts.filter(workout => workout.workoutID !== workoutIDToDelete)
            // );
            // Ensure we are not editing the row that is about to be deleted by the parent's state update
            setEditingRowIndex(null);
        }
    };


    const rows = editedWorkouts.map((workout: any, index: number) => {
        const isCurrentRowEditing = editingRowIndex === index;
        return (
            <Table.Tr key={workout.workoutId}>
                {/* Workout Name */}
                <Table.Td>
                    {isCurrentRowEditing ? ( <TextInput size="xs" value={workout.workoutName} onChange={(e) => handleWorkoutChange(index, 'workoutName', e.currentTarget.value)} /> ) : ( workout.workoutName )}
                </Table.Td>
                {/* Sets */}
                <Table.Td>
                     {isCurrentRowEditing ? ( <NumberInput size="xs" style={{ width: '80px' }} value={workout.sets} onChange={(val) => handleWorkoutChange(index, 'sets', val ?? 0)} min={0} /> ) : ( workout.sets )}
                </Table.Td>
                {/* Reps */}
                <Table.Td>
                     {isCurrentRowEditing ? ( <TextInput size="xs" style={{ width: '80px' }} value={workout.reps} onChange={(e) => handleWorkoutChange(index, 'reps', e.currentTarget.value)} /> ) : ( workout.reps )}
                </Table.Td>
                {/* Description */}
                <Table.Td>
                     {isCurrentRowEditing ? ( <TextInput size="xs" value={workout.description} onChange={(e) => handleWorkoutChange(index, 'description', e.currentTarget.value)} /> ) : ( workout.description )}
                </Table.Td>
                {/* Video URL */}
                <Table.Td>
                    {isCurrentRowEditing ? (
                        <TextInput size="xs" value={workout.videoURL} onChange={(e) => handleWorkoutChange(index, 'videoURL', e.currentTarget.value)} />
                    ) : (
                         workout.videoURL ? ( <a href={workout.videoURL} target="_blank" rel="noopener noreferrer">Link</a> ) : ('-')
                    )}
                </Table.Td>
                 {/* Notes */}
                <Table.Td>
                    {isCurrentRowEditing ? ( <TextInput size="xs" value={workout.notes} onChange={(e) => handleWorkoutChange(index, 'notes', e.currentTarget.value)} /> ) : ( workout.notes )}
                </Table.Td>

                {/* Action Buttons Column */}
                <Table.Td>
                    {isCurrentRowEditing ? (
                        // Save / Cancel Icons when editing
                        <Group gap="xs" wrap="nowrap">
                            <ActionIcon variant="subtle" color="green" onClick={() => handleSaveClick(index)} title="Save">
                                <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon variant="subtle" color="red" onClick={() => handleCancelClick(index)} title="Cancel">
                                <IconX size={16} />
                            </ActionIcon>
                        </Group>
                    ) : (
                        // Edit / Delete Icons when not editing
                        <Group gap="xs" wrap="nowrap">
                             <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => handleEditClick(index)}
                                disabled={editingRowIndex !== null} // Disable if any row is being edited
                                title="Edit"
                            >
                                <IconPencil size={16} />
                            </ActionIcon>
                            <ActionIcon
                                variant="subtle"
                                color="red"
                                // Pass workoutID to the delete handler
                                onClick={() => handleDeleteClick(workout.workoutId)}
                                disabled={editingRowIndex !== null} // Disable if any row is being edited
                                title="Delete"
                            >
                                <IconTrash size={16} />
                            </ActionIcon>
                        </Group>
                    )}
                </Table.Td>
            </Table.Tr>
        );
    });

    return (
        <Accordion chevronPosition="left" maw={1500} mx="auto" classNames={classes}>
            {plan &&
                <Accordion.Item value={plan.planID.toString()}>
                    <AccordionControl>{plan.planName}</AccordionControl>
                    <Accordion.Panel>
                        <Table highlightOnHover > {/* Added borders for clarity */}
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Workout Name</Table.Th>
                                    <Table.Th w={80}>Sets</Table.Th>
                                    <Table.Th>Reps</Table.Th>
                                    <Table.Th>Description</Table.Th>
                                    <Table.Th w={80}>Link</Table.Th>
                                    <Table.Th w={220}>Notes</Table.Th>
                                    <Table.Th w={50} style={{ textAlign: 'center' }}>Actions</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>

                        <Text c="dimmed" size="sm" mt="lg">
                            Last Updated: {formatDate(plan.updatedAt)}
                        </Text>
                    </Accordion.Panel>
                </Accordion.Item>}
        </Accordion>
    );
};

export default ProfileAccordion;