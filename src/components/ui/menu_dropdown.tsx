import MenuButton from '@mui/joy/MenuButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Dropdown from '@mui/joy/Dropdown';
import Button from '@mui/joy/Button';
import type { MenuProps } from '../../interfaces/ui.interfaces';


export default function MenuDropDown({ menu_items, onClick,action_button,component}: MenuProps) {
  return (
    <Dropdown>
      <MenuButton variant="plain" endDecorator={<ArrowDropDown />}>
 {component}
      </MenuButton>
      
<Menu sx={{ minWidth: 160, '--ListItemDecorator-size': '24px',padding:.5 }}>
  {menu_items?.map((item, index) => (
    <MenuItem
      key={index}
      onClick={() => {
        if (onClick) onClick(index);
      }}
    >
      {item.to ? (
        <Button  variant = 'plain' color='neutral' component="a" href={item.to} startDecorator={item.icon ? <item.icon /> : null}>
          {item.name}
        </Button>
      ) : (
        <Button  variant = 'plain' color='neutral' startDecorator={item.icon ? <item.icon /> : null}>
          {item.name}
        </Button>
        
      )}
    </MenuItem>
  ))}

  {action_button &&
    action_button.map((button, index) => (
      <Button
        key={index}
        onClick={button.function}
        variant="solid"
        color='success'
        startDecorator={button.icon ? <button.icon /> : null}
      >
        {button.title}
      </Button>
    ))}
</Menu>

    </Dropdown>
  );
}