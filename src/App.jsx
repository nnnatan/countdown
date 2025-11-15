import React, { useState, useEffect, useMemo } from 'react'
import './App.css'

const TARGET_YEAR = 2027
const TARGET_MONTH = 5 // Junho (0-indexed, então 5 = junho)
const TARGET_DATE = new Date(TARGET_YEAR, TARGET_MONTH, 1) // 1º de junho de 2027

function App() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [markedDays, setMarkedDays] = useState(() => {
    // Carrega dias marcados do localStorage
    const saved = localStorage.getItem('markedDays')
    return saved ? JSON.parse(saved) : {}
  })
  const [dayLinks, setDayLinks] = useState(() => {
    // Carrega links dos dias do localStorage
    const saved = localStorage.getItem('dayLinks')
    return saved ? JSON.parse(saved) : {}
  })

  // Atualiza a data atual a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000) // Atualiza a cada minuto

    return () => clearInterval(interval)
  }, [])

  // Calcula o número total de dias até junho de 2027 (desde 14 de novembro de 2025)
  const startDate = useMemo(() => {
    const date = new Date(2025, 10, 14) // 14 de novembro de 2025 (novembro = 10, pois começa em 0)
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

  // Calcula quantos dias já se passaram desde o início
  const daysPassed = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = today - startDate
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    // Se ainda não chegou na data inicial, retorna 0
    return diffDays > 0 ? diffDays : 0
  }, [currentDate, startDate])

  // Calcula quantos dias foram marcados (incluindo passados e futuros marcados manualmente)
  const markedDaysCount = useMemo(() => {
    return Object.keys(markedDays).filter(dateStr => markedDays[dateStr]).length
  }, [markedDays])

  // Calcula dias restantes até 2027 (considerando dias marcados)
  const daysRemaining = useMemo(() => {
    // Dias restantes = Total de dias - Dias marcados
    return Math.max(0, totalDaysFromStart - markedDaysCount)
  }, [totalDaysFromStart, markedDaysCount])

  // Marca automaticamente apenas o dia atual (+1) se não estiver marcado
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]
    
    // Verifica se o dia de hoje está dentro do período do contador
    const todayTime = today - startDate
    const todayDaysFromStart = Math.floor(todayTime / (1000 * 60 * 60 * 24))
    
    // Só marca se o dia estiver dentro do período e não estiver marcado
    if (todayDaysFromStart >= 0 && todayDaysFromStart < totalDaysFromStart) {
      setMarkedDays(prevMarkedDays => {
        // Se já está marcado, não faz nada
        if (prevMarkedDays[todayStr]) {
          return prevMarkedDays
        }
        
        // Marca apenas o dia de hoje
        const newMarkedDays = { ...prevMarkedDays }
        newMarkedDays[todayStr] = true
        localStorage.setItem('markedDays', JSON.stringify(newMarkedDays))
        return newMarkedDays
      })
    }
  }, [currentDate, startDate, totalDaysFromStart])

  // Gera array de dias para exibição (contagem regressiva)
  const daysArray = useMemo(() => {
    const days = []
    
    // Cria array com todos os dias desde o início até 2027
    for (let i = 0; i < totalDaysFromStart; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      const dayNumber = totalDaysFromStart - i // Contagem regressiva (438, 437, 436...)
      const isPassed = i <= daysPassed
      
      days.push({
        number: dayNumber,
        date: date,
        dateStr: dateStr,
        passed: isPassed,
        marked: markedDays[dateStr] || false
      })
    }
    
    return days // Já está em ordem decrescente (do maior para o menor)
  }, [totalDaysFromStart, daysPassed, markedDays, startDate])

  // Formata data para exibição
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Função para adicionar/editar link de um dia (preparada para uso futuro)
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

  // Handler para clicar em um dia (preparado para adicionar links)
  const handleDayClick = (day) => {
    // Se o dia tem link, abre o link
    if (dayLinks[day.dateStr]) {
      window.open(dayLinks[day.dateStr], '_blank')
      return
    }
    
    // Permite marcar/desmarcar qualquer dia manualmente
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

