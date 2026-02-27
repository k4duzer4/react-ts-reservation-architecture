import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/AppLayout'
import { EditReservationPage } from '@/pages/EditReservationPage'
import { LoginPage } from '@/pages/LoginPage'
import { NewReservationPage } from '@/pages/NewReservationPage'
import { ReservationsPage } from '@/pages/ReservationsPage'
import { PrivateRoute } from '@/routes/PrivateRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/reservas" element={<ReservationsPage />} />
          <Route path="/reservas/nova" element={<NewReservationPage />} />
          <Route path="/reservas/:id/editar" element={<EditReservationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/reservas" replace />} />
    </Routes>
  )
}
