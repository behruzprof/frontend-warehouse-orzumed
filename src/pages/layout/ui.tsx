import { Outlet } from 'react-router-dom'
import { alpha, Box, drawerClasses, Drawer as MuiDrawer, Stack, styled, } from '@mui/material'
import MenuContent from './components/menu-content'
import AppNavbar from './components/app-navbar'
import { checkPasswordAndSetRole } from '@/shared/helpers/get-department-id';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
        width: drawerWidth,
        flexShrink: 0,
        boxSizing: 'border-box',
        mt: 10,
        [`& .${drawerClasses.paper}`]: {
                width: drawerWidth,
                boxSizing: 'border-box',
        },
});

const Layout = () => {
        checkPasswordAndSetRole()

        return (
                <Box sx={{ display: 'flex' }}>
                        <Drawer
                                variant="permanent"
                                sx={{
                                        display: { xs: 'none', md: 'block' },
                                        [`& .${drawerClasses.paper}`]: {
                                                backgroundColor: 'background.paper',
                                                width: 240,
                                        },
                                }}
                        >
                                <Box
                                        sx={{
                                                overflow: 'auto',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                        }}
                                >
                                        <MenuContent />
                                </Box>
                        </Drawer>
                        <AppNavbar />
                        <Box
                                component="main"
                                sx={(theme) => ({
                                        flexGrow: 1,
                                        backgroundColor: theme.vars
                                                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                                                : alpha(theme.palette.background.default, 1),
                                        overflow: 'auto',
                                })}
                        >
                                <Stack
                                        spacing={2}
                                        sx={{
                                                alignItems: 'center',
                                                mx: 3,
                                                pb: 5,
                                                mt: { xs: 8, md: 2 },
                                        }}
                                >
                                        <Outlet />
                                </Stack>
                        </Box>
                </Box>
        )
}

export default Layout