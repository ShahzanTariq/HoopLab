// profileAccordion.tsx
import { Accordion, ActionIcon, AccordionControlProps, Center, Group, Table, Title, Text } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import React from 'react';
import classes from './styles/profileAccoridion.module.css';


interface AccordionProps {
    plan: any; // Accept a single plan as a prop
}

function AccordionControl(props: AccordionControlProps) {
    return (
        <Center>
            <Accordion.Control {...props} />
            <ActionIcon size="lg" variant="subtle" color="gray">
                <IconDots size={16} />
            </ActionIcon>
        </Center>
    );
}

const ProfileAccordion: React.FC<AccordionProps> = ({ plan }) => {
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };


    const rows = plan.workouts.map((workout: any) => (
        <Table.Tr key={workout.workoutID}>
            <Table.Td>{workout.workoutName}</Table.Td>
            <Table.Td>{workout.sets}</Table.Td>
            <Table.Td>{workout.reps}</Table.Td>
        </Table.Tr>
    ));

    return (
        <Accordion chevronPosition="left" maw={1000} mx="auto" classNames={classes}>
            <Accordion.Item value={plan.planID}> {/* Use planId as the value */}
                <AccordionControl>{plan.planName}</AccordionControl>
                <Accordion.Panel>
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Workout Name</Table.Th>
                                <Table.Th>Sets</Table.Th>
                                <Table.Th>Reps</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                    <Text c="dimmed" size="sm" mt="xs">
                        Last Updated: {formatDate(plan.updatedAt)}
                    </Text>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};

export default ProfileAccordion;