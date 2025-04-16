import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { darkTheme } from './styles/theme'
import GlobalStyle from './styles/GlobalStyle'
import Layout from './components/layout/Layout'
import Dashboard from './features/dashboard/Dashboard'
import Activities from './features/activities/Activities'
import Login from './features/auth/Login'
import NotFound from './components/common/NotFound'

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="activities" element={<Activities />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App
