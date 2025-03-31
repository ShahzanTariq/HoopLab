import { useState, useEffect } from 'react';
import cx from 'clsx';
import {Checkbox, Group, ScrollArea, Table, Text } from '@mantine/core';
import classes from './styles/TableSelection.module.css';

interface TableProps {
    data: any[];
    onSelectionChange: (selectedRows: any[]) => void; // Changed type to any[]
}

const TableSelection: React.FC<TableProps> = ({ data, onSelectionChange }) => {
    const [selection, setSelection] = useState<any[]>([]); // Changed type to any[]

    const toggleRow = (item: any) => {
        setSelection((current) =>
            current.includes(item)
                ? current.filter((currentItem) => currentItem.workoutID !== item.workoutID) // Compare workoutIDs
                : [...current, item]
        );
    };

    const toggleAll = () => {
        setSelection((current) => (current.length === data.length ? [] : [...data])); // Use spread operator
    };

    useEffect(() => {
        onSelectionChange(selection);
    }, [selection, onSelectionChange]);


    const rows = data.map((item) => {
        const selected = selection.includes(item);
        return (
            <Table.Tr 
                key={item.workoutID} 
                className={cx({ [classes.rowSelected]: selected })}
                onClick={() => toggleRow(item)}
                style={{ cursor: 'pointer' }}
            >
                <Table.Td
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking the checkbox
                >
                    <Checkbox 
                        checked={selected}
                        onChange={() => toggleRow(item)} // Checkbox toggles selection
                        styles={{
                            input: {
                                cursor: 'pointer', // Ensure pointer cursor on hover
                            },
                        }}
                     />
                </Table.Td>
            <Table.Td>
            <Group gap="sm">
                <Text size="sm" fw={500}>
                {item.workoutName}
                </Text>
            </Group>
            </Table.Td>
            <Table.Td>{item.category}</Table.Td>
            <Table.Td>{item.level}</Table.Td>
            <Table.Td>{item.description}</Table.Td>
            <Table.Td>{item.videoURL}</Table.Td>
        </Table.Tr>
        );
    });

    return (
        <ScrollArea>
        <Table miw={800} verticalSpacing="sm">
            <Table.Thead>
            <Table.Tr>
                <Table.Th w={40}>
                <Checkbox
                    onChange={toggleAll}
                    checked={selection.length === data.length}
                    indeterminate={selection.length > 0 && selection.length !== data.length}
                />
                </Table.Th>
                <Table.Th>Workout</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Level</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Video</Table.Th>
            </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        </ScrollArea>
    );
}

export default TableSelection;