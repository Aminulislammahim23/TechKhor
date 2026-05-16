import './App.css'
import { BrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <MainLayout role="viewer">
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
