import { Link, useLocation } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HealingIcon from '@mui/icons-material/Healing';
import Stack from '@mui/material/Stack';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import WarehouseIcon from '@mui/icons-material/Warehouse';

import { APP_ROUTES } from '@/shared/constants/app-route';
import { getRoleFromLocalStorage, Roles } from '@/shared/helpers/get-department-id';

const role = getRoleFromLocalStorage()

const mainListItems = [
        { text: 'Dorilar', icon: <HealingIcon />, path: APP_ROUTES.DRUG, isAccess: Roles.ADMIN === role },
        { text: 'Kirimlar', icon: <LibraryAddIcon />, path: APP_ROUTES.ARRIVALS_DRUG, isAccess: Roles.ADMIN === role },
        { text: 'Talabnomalar', icon: <EditDocumentIcon />, path: APP_ROUTES.REQUIREMENT_DRUG, isAccess: true },
        { text: 'Buyurtma qilish', icon: <LocalTaxiIcon />, path: APP_ROUTES.ORDER_DRUG, isAccess: Roles.ADMIN === role },
        { text: 'Analitika', icon: <AnalyticsRoundedIcon />, path: APP_ROUTES.ANALYTICS, isAccess: Roles.ADMIN === role },
        { text: 'Xisobot', icon: <AnalyticsRoundedIcon />, path: APP_ROUTES.REPORTS, isAccess: Roles.ADMIN === role },
        { text: 'Bo\'limlar', icon: <WarehouseIcon />, path: APP_ROUTES.DEPARTMENTS, isAccess: Roles.ADMIN === role },
];

const secondaryListItems = [
        { text: 'Chiqish', icon: <ExitToAppIcon /> }
];

export default function MenuContent() {
        const location = useLocation();

        return (
                <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
                        <List dense>
                                {mainListItems.map((item, index) => {
                                        if (!item.isAccess) {
                                                return null
                                        }
                                        return (
                                                <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                                        <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                <ListItemButton selected={location.pathname === item.path}>
                                                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                                                        <ListItemText primary={item.text} />
                                                                </ListItemButton>
                                                        </Link>
                                                </ListItem>
                                        )
                                })}
                        </List>
                        <List dense>
                                {secondaryListItems.map((item, index) => (
                                        <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                                <Link to={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <ListItemButton selected={location.pathname === '/login'}>
                                                                <ListItemIcon>{item.icon}</ListItemIcon>
                                                                <ListItemText primary={item.text} />
                                                        </ListItemButton>
                                                </Link>
                                        </ListItem>
                                ))}
                        </List>
                </Stack>
        );
}
