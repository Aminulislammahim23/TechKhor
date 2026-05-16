import './App.css'
import { BrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <MainLayout role="customer">
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
