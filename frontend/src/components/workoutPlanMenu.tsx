import { Menu, Button, MenuItem } from '@mantine/core';

interface WorkoutPlanMenuProps {
  userPlans: any[];
  selectedPlan: any | null;
  onCreatePlan: () => void;   // Callback for creating a new plan
  onSelectPlan: (plan: any | null) => void; // Callback for selecting a plan
}


function WorkoutPlanMenu({ userPlans, selectedPlan, onCreatePlan, onSelectPlan }: WorkoutPlanMenuProps) {


  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button>{selectedPlan ? selectedPlan.planName : "Select Plan"}</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <MenuItem onClick={onCreatePlan}>Create New Plan</MenuItem> {/* Use prop */}
        {userPlans.map((plan) => (
          <MenuItem key={plan.planId} onClick={() => onSelectPlan(plan)}> {/* Use prop */}
            {plan.planName}
          </MenuItem>
        ))}

      </Menu.Dropdown>
    </Menu>
  );
}

export default WorkoutPlanMenu;