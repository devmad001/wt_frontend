import { join } from 'path'
import { AppContext } from 'providers'
import { useContext, useEffect, useState } from 'react'

interface TextAvatarProps {
  className?: string
  label?: string
}

const colorsTemplate = ['gray', 'red', 'orange', 'yellow', 'green', 'blue']

function TextAvatar({ label, className }: TextAvatarProps) {
  const { avatarColorStore, backupAvatarColor } = useContext(AppContext)
  const [borderColor, setBorderColor] = useState('')
  const [textColor, setTextColor] = useState('text-white')
  const [bgColor, setBgColor] = useState('av-bg-gray')
  const [shortLabel, setShortLabel] = useState('')

  useEffect(() => {
    generateAvatarColor()
    generateShortLabel()
  }, [label])

  const generateAvatarColor = () => {
    const avatarCached = avatarColorStore()
    if (label) {
      const id = btoa(label || '')
      if (avatarCached && id in avatarCached) {
        const pickedColor = avatarCached[id].color || 'gray'
        setBgColor(`av-bg-${pickedColor}`)
      } else {
        const pickedColor = colorsTemplate[Math.floor(Math.random() * colorsTemplate.length)]
        setBgColor(`av-bg-${pickedColor}`)
        backupAvatarColor({
          id: id,
          color: pickedColor
        })
      }
    }
  }

  const generateShortLabel = () => {
    if (label) {
      const split: string[] = label?.split(' ') || []
      if (split.length > 1) {
        setShortLabel(`${split[0][0]}${split[1][0]}`)
      } else {
        setShortLabel(split[0][0])
      }
    } else {
      setShortLabel('A')
    }
  }

  return (
    <div
      className={[
        `flex items-center justify-center font-semibold uppercase w-11 h-11 rounded-full`,
        textColor,
        bgColor,
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {shortLabel}
    </div>
  )
}

export default TextAvatar
