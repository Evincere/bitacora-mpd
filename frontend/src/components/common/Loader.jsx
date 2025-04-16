import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  min-height: 200px;
`

const SpinnerWrapper = styled.div`
  width: 50px;
  height: 50px;
  position: relative;
`

const Spinner = styled.div`
  border: 4px solid rgba(108, 92, 231, 0.2);
  border-radius: 50%;
  border-top: 4px solid ${({ theme }) => theme.primary};
  width: 100%;
  height: 100%;
  animation: ${spin} 1s linear infinite;
`

const Loader = () => {
  return (
    <LoaderContainer>
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    </LoaderContainer>
  )
}

export default Loader
