import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import Header from './Header'
import Loader from '../common/Loader'
import { PageTransition } from '../ui/PageTransition'

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  transition: all 0.3s ease;
`

const ContentWrapper = styled.div`
  max-width: 1600px;
  margin: 0 auto;
`

const Layout = () => {
  const { loading } = useSelector(state => state.ui)

  return (
    <LayoutContainer>
      <Sidebar />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Header />
        <MainContent>
          <ContentWrapper>
            {loading ? <Loader /> : (
              <PageTransition type="fade" duration={300}>
                <Outlet />
              </PageTransition>
            )}
          </ContentWrapper>
        </MainContent>
      </div>
      {/* El NotificationCenter ha sido reemplazado por ToastProvider en App.tsx */}
    </LayoutContainer>
  )
}

export default Layout
