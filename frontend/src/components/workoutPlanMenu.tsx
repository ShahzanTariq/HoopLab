import { Menu, Button, MenuItem } from '@mantine/core';

interface WorkoutPlanMenuProps {
  userPlans: any[];
  selectedPlan: any | null;
  onCreatePlan: () => void; 
  onSelectPlan: (plan: any | null) => void; 
}


function WorkoutPlanMenu({ userPlans, selectedPlan, onCreatePlan, onSelectPlan }: WorkoutPlanMenuProps) {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>{selectedPlan ? selectedPlan.planName : "Select Plan"}</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <MenuItem onClick={onCreatePlan}>Create New Plan</MenuItem> 
        {userPlans.map((plan) => (
          <MenuItem key={plan.planID} onClick={() => onSelectPlan(plan)}>
            {plan.planName}
          </MenuItem>
        ))}

      </Menu.Dropdown>
    </Menu>
  );
}

export default WorkoutPlanMenu;