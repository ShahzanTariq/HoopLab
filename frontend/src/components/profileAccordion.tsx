// profileAccordion.tsx
import { Accordion, ActionIcon, AccordionControlProps, Center, Table, Text, TextInput, NumberInput, Group, Tooltip } from '@mantine/core'; // Added Tooltip
import { IconPencil, IconCheck, IconX, IconTrash, IconAlertTriangle } from '@tabler/icons-react'; // Added IconAlertTriangle (optional visual cue)
import React, { useState, useEffect } from 'react';
import classes from './styles/profileAccoridion.module.css';


interface AccordionProps {
    plan: any;
    onEdit: (updatedWorkouts: any[]) => void;
    onDelete: (workoutIDToDelete: number | string) => void;
}

function AccordionControl(props: AccordionControlProps) {
    // ... (remains the same)
     return (
        <Center>
            <Accordion.Control {...props} />
        </Center>
    );
}

const ProfileAccordion: React.FC<AccordionProps> = ({ plan, onEdit, onDelete }) => {

    const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
    const [confirmingDeleteIndex, setConfirmingDeleteIndex] = useState<number | null>(null);
    const [editedWorkouts, setEditedWorkouts] = useState(() => plan.workouts ? [...plan.workouts] : []);


    useEffect(() => {
        setEditedWorkouts(plan.workouts ? [...plan.workouts] : []);
        setEditingRowIndex(null);
        setConfirmingDeleteIndex(null); 
    }, [plan]);

    const formatDate = (dateString: string): string => {
         if (!dateString) return 'N/A';
         const date = new Date(dateString);
         return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
    };

    const handleWorkoutChange = (index: number, field: string, value: any) => {
       if (confirmingDeleteIndex !== null) return;
        const updatedWorkouts = editedWorkouts.map((workout, i) => {
            if (i === index) {
                return { ...workout, [field]: value };
            }
            return workout;
        });
        setEditedWorkouts(updatedWorkouts);
    };

    const handleEditClick = (index: number) => {
        // Reset delete confirmation if starting an edit elsewhere
        setConfirmingDeleteIndex(null);
        setEditingRowIndex(index);
    };

    const handleSaveClick = (index: number) => {
        onEdit(editedWorkouts);
        setEditingRowIndex(null);
    };

    const handleCancelClick = (index: number) => {
        // Revert changes for the edited row
        if (plan.workouts && plan.workouts[index]) {
            const revertedWorkouts = [...editedWorkouts];
            revertedWorkouts[index] = { ...plan.workouts[index] };
            setEditedWorkouts(revertedWorkouts);
        }
        setEditingRowIndex(null);
    };

    const handleInitiateDelete = (index: number) => {
        setEditingRowIndex(null);
        setConfirmingDeleteIndex(index);
    };

    const handleConfirmDelete = (workoutIdToDelete: number | string | undefined) => {
        if (workoutIdToDelete === undefined) {
             console.error("Cannot confirm delete: Workout ID is undefined.");
             setConfirmingDeleteIndex(null); // Reset state
             return;
        }
        onDelete(workoutIdToDelete);
        setConfirmingDeleteIndex(null); // Reset state after calling parent delete
         // Optional: If onDelete doesn't trigger a plan update quickly,
         // you might want to optimistically remove here, but usually relying
         // on the parent's update via useEffect is better.
    };

    // Step 2b: User clicks the cancel (cross) icon during delete confirmation
    const handleCancelDelete = () => {
        setConfirmingDeleteIndex(null); // Just reset the confirmation state
    };


    // --- Render Rows ---
    const rows = editedWorkouts.map((workout: any, index: number) => {
        const isCurrentRowEditing = editingRowIndex === index;
        const isCurrentRowConfirmingDelete = confirmingDeleteIndex === index;
        const currentWorkoutId = workout.workoutId;
        // Disable actions on other rows if any row is being edited OR confirming deletion
        const isAnyActionInProgress = editingRowIndex !== null || confirmingDeleteIndex !== null;
        // Disable actions on THIS row if another action is in progress
        const disableActionsOnThisRow = isAnyActionInProgress && !(isCurrentRowEditing || isCurrentRowConfirmingDelete);


        return (
            <Table.Tr
               key={currentWorkoutId ?? `no-id-${index}`}
               // Optionally highlight row differently when confirming delete
               style={isCurrentRowConfirmingDelete ? { backgroundColor: '#613F3F' } : {}}
            >
                {/* Workout Data Cells (conditionally render inputs/text) */}
                <Table.Td>{isCurrentRowEditing ? <TextInput size="xs" value={workout.workoutName ?? ''} onChange={(e) => handleWorkoutChange(index, 'workoutName', e.currentTarget.value)} disabled={disableActionsOnThisRow} /> : (workout.workoutName)}</Table.Td>
                <Table.Td>{isCurrentRowEditing ? <NumberInput size="xs" style={{ width: '80px' }} value={workout.sets ?? 0} onChange={(val) => handleWorkoutChange(index, 'sets', val ?? 0)} min={0} disabled={disableActionsOnThisRow} /> : (workout.sets)}</Table.Td>
                <Table.Td>{isCurrentRowEditing ? <TextInput size="xs" style={{ width: '80px' }} value={workout.reps ?? ''} onChange={(e) => handleWorkoutChange(index, 'reps', e.currentTarget.value)} disabled={disableActionsOnThisRow} /> : (workout.reps)}</Table.Td>
                <Table.Td>{isCurrentRowEditing ? <TextInput size="xs" value={workout.description ?? ''} onChange={(e) => handleWorkoutChange(index, 'description', e.currentTarget.value)} disabled={disableActionsOnThisRow} /> : (workout.description)}</Table.Td>
                <Table.Td>{isCurrentRowEditing ? <TextInput size="xs" value={workout.videoURL ?? ''} onChange={(e) => handleWorkoutChange(index, 'videoURL', e.currentTarget.value)} disabled={disableActionsOnThisRow} /> : (workout.videoURL ? <a href={workout.videoURL} target="_blank" rel="noopener noreferrer">View Example</a> : '-')}</Table.Td>
                <Table.Td>{isCurrentRowEditing ? <TextInput size="xs" value={workout.notes ?? ''} onChange={(e) => handleWorkoutChange(index, 'notes', e.currentTarget.value)} disabled={disableActionsOnThisRow} /> : (workout.notes)}</Table.Td>

                <Table.Td style={{ textAlign: 'center' }}>
                    {isCurrentRowEditing ? (
                        //Editing Mode
                        <Group gap="xs" wrap="nowrap">
                             <Tooltip label="Save Changes" withArrow>
                                <ActionIcon variant="subtle" color="green" onClick={() => handleSaveClick(index)} title="Save">
                                    <IconCheck size={16} />
                                </ActionIcon>
                            </Tooltip>
                             <Tooltip label="Cancel Edit" withArrow>
                                <ActionIcon variant="subtle" color="red" onClick={() => handleCancelClick(index)} title="Cancel">
                                    <IconX size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    ) : isCurrentRowConfirmingDelete ? (
                         //Confirming Delete Mode
                         <Group gap="xs" wrap="nowrap">
                            <Tooltip label="Confirm Delete" color="red" withArrow>
                                <ActionIcon variant="filled" color="red" onClick={() => handleConfirmDelete(currentWorkoutId)} title="Confirm Delete">
                                    <IconCheck size={16} />
                                </ActionIcon>
                             </Tooltip>
                             <Tooltip label="Cancel Delete" withArrow>
                                <ActionIcon variant="filled" color="gray" onClick={handleCancelDelete} title="Cancel Delete">
                                    <IconX size={16} />
                                </ActionIcon>
                            </Tooltip>
                         </Group>
                    ) : (
                        //Default Mode
                        <Group gap="xs" wrap="nowrap">
                            <Tooltip label="Edit Workout" withArrow>
                                <ActionIcon
                                    variant="subtle"
                                    color="blue"
                                    onClick={() => handleEditClick(index)}
                                    disabled={isAnyActionInProgress}
                                    title="Edit"
                                >
                                    <IconPencil size={16} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Delete Workout" color="red" withArrow>
                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    onClick={() => handleInitiateDelete(index)}
                                    disabled={isAnyActionInProgress}
                                    title="Delete"
                                >
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    )}
                </Table.Td>
            </Table.Tr>
        );
    });



    return (
        <Accordion chevronPosition="left" maw={1500} mx="auto" classNames={classes}>
             {plan && plan.planID != null && (
                 <Accordion.Item value={plan.planID.toString()}>
                     <AccordionControl>{plan.planName ?? 'Unnamed Plan'}</AccordionControl>
                     <Accordion.Panel>
                         <Table highlightOnHover>
                             <Table.Thead>
                                 <Table.Tr>
                                     <Table.Th>Workout Name</Table.Th>
                                     <Table.Th w={80}>Sets</Table.Th>
                                     <Table.Th>Reps</Table.Th>
                                     <Table.Th>Description</Table.Th>
                                     <Table.Th w={120}>Video</Table.Th>
                                     <Table.Th w={220}>Notes</Table.Th>
                                     <Table.Th w={110} style={{ textAlign: 'center' }}>Actions</Table.Th>
                                 </Table.Tr>
                             </Table.Thead>
                              <Table.Tbody>{editedWorkouts.length > 0 ? rows : <Table.Tr><Table.Td colSpan={7} align="center">No workouts in this plan.</Table.Td></Table.Tr>}</Table.Tbody>
                         </Table>

                         <Text c="dimmed" size="sm" mt="lg">
                             Last Updated: {formatDate(plan.updatedAt)}
                         </Text>
                     </Accordion.Panel>
                 </Accordion.Item>
             )}
        </Accordion>
    );
};

export default ProfileAccordion;