import { createBrowserRouter, Navigate, RouterProvider as RouterDomProvider } from 'react-router-dom'
import { Layout } from '@/pages/layout'
import { APP_ROUTES } from '@/shared/constants/app-route'
import { DrugPage } from '@/pages/drug'
import { DrugCreatePage } from '@/pages/drug-create'
import { DrugUpdateDeletePage } from '@/pages/drug-update'
import { DrugArrivalPage } from '@/pages/drug-arrival'
import { ArrivalCreatePage } from '@/pages/drug-arrival-create'
import { DrugArrivalUpdateAndDeletePage } from '@/pages/drug-arrival-update'
import { TransferDrugPage } from '@/pages/drug-request'
import { DrugRequestPage } from '@/pages/drug-request-list'
import { DrugRequestUpdateAndDeletePage } from '@/pages/drug-request-update'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={APP_ROUTES.DRUG} />,
      },
      {
        path: APP_ROUTES.DRUG,
        element: <DrugPage />,
      },
      {
        path: `${APP_ROUTES.DRUG}/create`,
        element: <DrugCreatePage />,
      },
      {
        path: `${APP_ROUTES.DRUG}/update/:id`,
        element: <DrugUpdateDeletePage />,
      },
      {
        path: APP_ROUTES.ARRIVALS_DRUG,
        element: <DrugArrivalPage />,
      },
      {
        path: `${APP_ROUTES.ARRIVALS_DRUG}/create`,
        element: <ArrivalCreatePage />,
      },
      {
        path: `${APP_ROUTES.ARRIVALS_DRUG}/update/:id`,
        element: <DrugArrivalUpdateAndDeletePage />,
      },
      {
        path: `${APP_ROUTES.REQUIREMENT_DRUG}`,
        element: <TransferDrugPage />,
      },
      {
        path: `${APP_ROUTES.REQUIREMENT_DRUG}/list`,
        element: <DrugRequestPage />,
      },
      {
        path: `${APP_ROUTES.REQUIREMENT_DRUG}/update/:id`,
        element: <DrugRequestUpdateAndDeletePage />,
      },
    ]
  },
  {
    path: APP_ROUTES.NOT_FOUND,
    element: <Navigate to={APP_ROUTES.DRUG} />
  }
])

const RouterProvider = () => {
  return (
    <RouterDomProvider router={router} />
  )
}

export default RouterProvider