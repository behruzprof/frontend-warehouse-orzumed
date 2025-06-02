import { StrictMode } from "react"
import { SnackbarProvider } from 'notistack';
import RouterProvider from "./router-provider"
import TanStackQueryProvider from "./query-provider"
import MuiProvider from "./mui-provider"

const Providers = () => {
        return (
                <StrictMode>
                        <SnackbarProvider maxSnack={3} autoHideDuration={5000}>
                                <MuiProvider>
                                        <TanStackQueryProvider>
                                                <RouterProvider />
                                        </TanStackQueryProvider>
                                </MuiProvider>
                        </SnackbarProvider>
                </StrictMode>
        )
}

export default Providers