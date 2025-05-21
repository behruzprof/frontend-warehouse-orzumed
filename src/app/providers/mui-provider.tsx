import { ThemeProvider, createTheme } from '@mui/material/styles';
import { type PropsWithChildren } from 'react'
import CssBaseline from '@mui/material/CssBaseline';

import { colorSchemes, typography, shadows, shape } from '@/shared/themes/theme-primitives'
import {
        chartsCustomizations,
        dataDisplayCustomizations,
        dataGridCustomizations,
        datePickersCustomizations,
        feedbackCustomizations,
        inputsCustomizations,
        surfacesCustomizations,
        treeViewCustomizations,
        navigationCustomizations
} from '@/shared/themes/customization';


const theme = createTheme({
        cssVariables: {
                colorSchemeSelector: 'data-mui-color-scheme',
                cssVarPrefix: 'template',
        },
        colorSchemes,
        typography,
        shadows,
        shape,
        components: {
                ...inputsCustomizations,
                ...dataDisplayCustomizations,
                ...feedbackCustomizations,
                ...navigationCustomizations,
                ...surfacesCustomizations,
                ...chartsCustomizations,
                ...dataGridCustomizations,
                ...datePickersCustomizations,
                ...treeViewCustomizations,
        },
})

const MuiProvider = ({ children }: PropsWithChildren) => {
        return (
                <ThemeProvider theme={theme} disableTransitionOnChange>
                        <CssBaseline enableColorScheme />
                        {children}
                </ThemeProvider>
        )
}

export default MuiProvider