/* eslint-disable import/prefer-default-export */
import { useEffect, useState, useRef, useCallback } from "react"

export const useOrientationChange = fn => {
  const [, setIsPortrait] = useState(true)
  const mql = window.matchMedia("(orientation: portrait)")
  const result = useRef(fn())

  useEffect(() => {
    function onMatchMediaChange(m) {
      if (m.matches) {
        result.current = fn()
        setIsPortrait(true)
      } else {
        // 横屏
        result.current = fn()
        setIsPortrait(false)
      }
    }
    onMatchMediaChange(mql)
    mql.addListener(onMatchMediaChange)
    return () => mql.removeListener(onMatchMediaChange)
  }, [fn, mql])
  return result.current
}

export const useLocalStorage = key => {
  const [lastValue, setLastValue] = useState([])

  useEffect(() => {
    let suggests
    if (key) {
      suggests = localStorage.getItem(key)
      if (suggests) setLastValue(JSON.parse(suggests))
    }
  }, [key])

  const setValue = useCallback(
    value => {
      if (value && !lastValue.includes(value)) {
        lastValue.push(value)
        setLastValue(lastValue)
        localStorage.setItem(key, JSON.stringify(lastValue))
      }
    },
    [key, lastValue],
  )

  const clearValue = useCallback(() => {
    setLastValue([])
    if (localStorage.getItem(key)) {
      localStorage.clear(key)
    }
  }, [key])

  return {
    lastValue,
    setValue,
    clearValue,
  }
}

export const useEffectShowModal = () => {
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowContent, setIsShowContent] = useState(false)

  const onModalClose = useCallback(() => {
    setIsShowContent(false)
    setTimeout(() => setIsShowModal(false), 100)
  }, [])

  const onModalOpen = useCallback(() => {
    setIsShowModal(true)
  }, [])

  useEffect(() => {
    if (isShowModal) {
      setTimeout(() => setIsShowContent(true), 0)
    }
  }, [isShowModal])

  return { isShowModal, isShowContent, onModalOpen, onModalClose }
}