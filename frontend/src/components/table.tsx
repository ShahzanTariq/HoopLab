import { useState } from 'react';
import cx from 'clsx';
import {Checkbox, Group, ScrollArea, Table, Text } from '@mantine/core';
import classes from './TableSelection.module.css';

interface TableProps{
    data: any[];
}


const TableSelection: React.FC<TableProps> = ({data}) => {
    const [selection, setSelection] = useState(['1']);
    const toggleRow = (id: string) =>
        setSelection((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.workoutID)));

    const rows = data.map((item) => {
        const selected = selection.includes(item.workoutID);
        return (
        <Table.Tr key={item.workoutID} className={cx({ [classes.rowSelected]: selected })}>
            <Table.Td>
            <Checkbox checked={selection.includes(item.workoutID)} onChange={() => toggleRow(item.workoutID)} />
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