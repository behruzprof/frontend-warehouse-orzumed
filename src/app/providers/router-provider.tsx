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
import { SessionsChart } from '@/pages/analytics'
import { DepartmentPage } from '@/pages/department'
import { DepartmentCreatePage } from '@/pages/department-create'
import { DepartmentUpdateDeletePage } from '@/pages/department-update'
import { getRoleFromLocalStorage, Roles } from '@/shared/helpers/get-department-id'
import ProtectedRoute from '@/shared/hoc/protected-route'

const role = getRoleFromLocalStorage()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={role === Roles.ADMIN ? APP_ROUTES.DRUG : APP_ROUTES.REQUIREMENT_DRUG} />,
      },
      {
        path: APP_ROUTES.DRUG,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DrugPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.DRUG}/create`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DrugCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.DRUG}/update/:id`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DrugUpdateDeletePage />
          </ProtectedRoute>
        ),
      },
      {
        path: APP_ROUTES.ARRIVALS_DRUG,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DrugArrivalPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.ARRIVALS_DRUG}/create`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <ArrivalCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.ARRIVALS_DRUG}/update/:id`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DrugArrivalUpdateAndDeletePage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.REQUIREMENT_DRUG}`,
        element: (
          <TransferDrugPage />
        ),
      },
      {
        path: `${APP_ROUTES.REQUIREMENT_DRUG}/list`,
        element: (
          <DrugRequestPage />
        ),
      },
      {
        path: `${APP_ROUTES.REQUIREMENT_DRUG}/update/:id`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DrugRequestUpdateAndDeletePage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.ANALYTICS}`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <SessionsChart />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.DEPARTMENTS}`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DepartmentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.DEPARTMENTS}/create`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DepartmentCreatePage />
          </ProtectedRoute>
        ),
      },
      {
        path: `${APP_ROUTES.DEPARTMENTS}/update/:id`,
        element: (
          <ProtectedRoute allowedRole={Roles.ADMIN}>
            <DepartmentUpdateDeletePage />
          </ProtectedRoute>
        ),
      },
    ]
  },
  {
    path: APP_ROUTES.NOT_FOUND,
    element: <Navigate to="/" />
  }
])

const RouterProvider = () => {
  return (
    <RouterDomProvider router={router} />
  )
}

export default RouterProvider