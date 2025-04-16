import { useState } from 'react'
import styled from 'styled-components'
import { FiMoreVertical } from 'react-icons/fi'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 8px;
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow};
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`

const MenuButton = styled.button`
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.text};
  }
`

const ChartContainer = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  position: relative;
`

const LegendContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-right: 8px;
`

const LegendLabel = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  margin-right: 4px;
`

const LegendValue = styled.span`
  font-weight: 500;
`

const ActivityChart = () => {
  const [chartData] = useState({
    labels: ['UX Design', 'UI Design', 'Code'],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: ['#6C5CE7', '#00B8D4', '#FF3366'],
        borderWidth: 0,
        cutout: '70%'
      }
    ]
  })
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#2A2A30',
        titleColor: '#FFFFFF',
        bodyColor: '#AAAAAA',
        borderColor: '#3A3A40',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`
          }
        }
      }
    }
  }
  
  return (
    <ChartCard>
      <CardHeader>
        <Title>Análisis</Title>
        <MenuButton>
          <FiMoreVertical size={20} />
        </MenuButton>
      </CardHeader>
      
      <ChartContainer>
        <Doughnut data={chartData} options={options} />
      </ChartContainer>
      
      <LegendContainer>
        <LegendItem>
          <LegendColor color="#6C5CE7" />
          <LegendLabel>UX Design</LegendLabel>
          <LegendValue>45%</LegendValue>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#00B8D4" />
          <LegendLabel>UI Design</LegendLabel>
          <LegendValue>35%</LegendValue>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#FF3366" />
          <LegendLabel>Code</LegendLabel>
          <LegendValue>20%</LegendValue>
        </LegendItem>
      </LegendContainer>
    </ChartCard>
  )
}

export default ActivityChart
