import React, { useState, useEffect, useMemo } from 'react'
import './App.css'

const TARGET_YEAR = 2027
const TARGET_MONTH = 5
const TARGET_DATE = new Date(TARGET_YEAR, TARGET_MONTH, 1)

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [markedDays, setMarkedDays] = useState(() => {
    const saved = localStorage.getItem('markedDays')
    return saved ? JSON.parse(saved) : {}
  })
  const [dayLinks, setDayLinks] = useState(() => {
    const saved = localStorage.getItem('dayLinks')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const startDate = useMemo(() => {
    const date = new Date(2025, 10, 14)
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const totalDaysFromStart = useMemo(() => {
    const target = new Date(TARGET_DATE)
    target.setHours(0, 0, 0, 0)
    const diffTime = target - startDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [startDate])

  const daysPassed = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = today - startDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [currentDate, startDate])

  const markedDaysCount = useMemo(() => {
    // Conta apenas dias marcados que estejam dentro do período válido
    const start = new Date(startDate)
    const target = new Date(TARGET_DATE)
    
    return Object.keys(markedDays).filter(dateStr => {
      if (!markedDays[dateStr]) return false
      
      const date = new Date(dateStr)
      return date >= start && date < target
    }).length
  }, [markedDays, startDate])

  const daysRemaining = useMemo(() => {
    // Total de dias no período - dias já marcados = dias restantes
    return Math.max(0, totalDaysFromStart - markedDaysCount)
  }, [totalDaysFromStart, markedDaysCount])

  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    const yesterdayTime = yesterday - startDate
    const yesterdayDaysFromStart = Math.floor(yesterdayTime / (1000 * 60 * 60 * 24))
    
    if (yesterdayDaysFromStart >= 0 && yesterdayDaysFromStart < totalDaysFromStart) {
      setMarkedDays(prevMarkedDays => {
        if (prevMarkedDays[yesterdayStr]) {
          return prevMarkedDays
        }
        
        const newMarkedDays = { ...prevMarkedDays }
        newMarkedDays[yesterdayStr] = true
        localStorage.setItem('markedDays', JSON.stringify(newMarkedDays))
        return newMarkedDays
      })
    }
  }, [currentDate, startDate, totalDaysFromStart])

  const daysArray = useMemo(() => {
    const days = []
    
    for (let i = 0; i < totalDaysFromStart; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const dayNumber = totalDaysFromStart - i
      const isPassed = i <= daysPassed
      
      days.push({
        number: dayNumber,
        date: date,
        dateStr: dateStr,
        passed: isPassed,
        marked: markedDays[dateStr] || false
      })
    }
    
    return days
  }, [totalDaysFromStart, daysPassed, markedDays, startDate])

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const addLinkToDay = (dateStr, link) => {
    const newDayLinks = { ...dayLinks }
    if (link) {
      newDayLinks[dateStr] = link
    } else {
      delete newDayLinks[dateStr]
    }
    setDayLinks(newDayLinks)
    localStorage.setItem('dayLinks', JSON.stringify(newDayLinks))
  }

  const handleDayClick = (day) => {
    if (dayLinks[day.dateStr]) {
      window.open(dayLinks[day.dateStr], '_blank')
      return
    }
    
    const newMarkedDays = { ...markedDays }
    newMarkedDays[day.dateStr] = !newMarkedDays[day.dateStr]
    setMarkedDays(newMarkedDays)
    localStorage.setItem('markedDays', JSON.stringify(newMarkedDays))
  }

  return (
    <div className="app">
      <h1 className="title">Contagem → 2027</h1>
      
      <div className="stats">
        <div className="stat-item">
          <div className="stat-value">{daysRemaining}</div>
          <div className="stat-label">Dias Restantes</div>
        </div>
      </div>

      <div className="days-container">
        {daysArray.map((day, index) => (
          <div
            key={`${day.dateStr}-${index}`}
            className={`day-box ${day.passed ? 'passed' : ''} ${day.marked ? 'marked' : ''} ${dayLinks[day.dateStr] ? 'has-link' : ''}`}
            onClick={() => handleDayClick(day)}
            title={formatDate(day.date)}
          >
            <div className="day-number">{day.number}</div>
            <div className="day-date">{formatDate(day.date)}</div>
            <div className="tooltip">
              {formatDate(day.date)}
              {dayLinks[day.dateStr] && (
                <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#4CAF50' }}>
                  🔗 Link disponível
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App