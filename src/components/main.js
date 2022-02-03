import '../App.css'
import React, { useState, useEffect, useCallback } from 'react'
import Food from './Food'
import Snake from './Snake'

const Main = () => {
  // Random Co ords
  const getRandomGrid = () => {
    let min = 2
    let max = 97
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
    return [x, y]
  }

  const [food, setFood] = useState(getRandomGrid)

  const [direction, setDirection] = useState('RIGHT')

  const [snakeDots, setSnakeDots] = useState([
    [0, 0],
    [2, 0],
  ])
  const [speed] = useState(200)
  const [reset, setReset] = useState(true)
  const [pause, setPause] = useState(true)

  // Step Four
  const checkIfOutside = () => {
    let head = snakeDots[snakeDots.length - 1]
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver()
      console.log('game over')
    }
  }
  // Step Five
  const checkIfCollapsed = () => {
    let snake = [...snakeDots]
    let head = snake[snake.length - 1]
    snake.pop()
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver()
      }
    })
  }
  const checkIfEat = () => {
    let head = snakeDots[snakeDots.length - 1]
    return head[0] === food[0] && head[1] === food[1]
  }

  const onGameOver = () => {
    setSnakeDots([
      [0, 0],
      [2, 0],
    ])
    setDirection(null)
    setReset(false)
    setPause(true)
  }

  useEffect(() => {
    if (pause) return

    // Step Four
    checkIfOutside()
    //  Step Five
    checkIfCollapsed()

    //  Step One
    setTimeout(() => moveSnake(snakeDots, checkIfEat()), speed)
  }, [snakeDots, pause])

  // Step 1.5
  const moveSnake = useCallback(
    (snakeDots, eaten) => {
      let dots = [...snakeDots]
      let head = dots[dots.length - 1]

      switch (direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]]
          break
        case 'LEFT':
          head = [head[0] - 2, head[1]]
          break
        case 'DOWN':
          head = [head[0], head[1] + 2]
          break
        case 'UP':
          head = [head[0], head[1] - 2]
          break

        default:
          break
      }
      if (direction) {
        dots.push(head)

        eaten ? setFood(getRandomGrid()) : dots.shift()

        setSnakeDots([...dots])
      }
    },
    [direction]
  )

  // Step Two

  useEffect(() => {
    const onKeyDown = (e) => {
      e = e || window.event
      switch (e.keyCode) {
        case 38:
          console.log('direction', direction)
          !['DOWN', 'UP'].includes(direction) && setDirection('UP')
          break
        case 40:
          !['DOWN', 'UP'].includes(direction) && setDirection('DOWN')
          break
        case 37:
          !['LEFT', 'RIGHT'].includes(direction) && setDirection('LEFT')
          break
        case 39:
          !['LEFT', 'RIGHT'].includes(direction) && setDirection('RIGHT')
          break

        default:
          break
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [direction, setDirection])

  return (
    <>
      <div className='board'>
        <Snake snakeDots={snakeDots} />
        <Food dot={food} />
      </div>
      {/* Step Six */}
      <div className='btn'>
        <button onClick={() => setPause((p) => !p)}>
          {pause ? 'Play' : 'Pause'}
        </button>
      </div>
    </>
  )
}

export default Main
