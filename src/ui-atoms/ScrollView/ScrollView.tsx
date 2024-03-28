import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const ScrollView = forwardRef((props: any, ref: any) => {
  const scrollViewRef: any = useRef(null)
  const prevScrolledHeight: any = useRef(0)
  const prevScrollHeightMinusTop: any = useRef(0)

  useEffect(() => {
    settingScrollEvent()
    return () => {
      destroy()
    }
  }, [])

  useImperativeHandle(ref, () => ({
    initScrollEvent() {
      destroy()
      settingScrollEvent()
    },
    destroyScrollEvent() {
      destroy()
    },
    scrollToEnd() {
      setTimeout(() => {
        scrollToEnd()
      }, 100)
    },
    restorePositionScrollOnTop() {
      restorePositionScrollOnTop()
    }
  }))

  const settingScrollEvent = () => {
    addScrollToEndEventListener()
    addScrollToTopEventListener()
  }

  const addScrollToEndEventListener = () => {
    const listElement = scrollViewRef?.current
    if (listElement) {
      listElement?.removeEventListener('scroll', scrollToEndHandler)
      listElement?.addEventListener('scroll', scrollToEndHandler)
    }
  }

  const addScrollToTopEventListener = () => {
    const listElement = scrollViewRef?.current
    if (listElement) {
      listElement?.removeEventListener('scroll', scrollToTopHandler)
      listElement?.addEventListener('scroll', scrollToTopHandler)
    }
  }

  const destroy = () => {
    const listElement = scrollViewRef?.current
    listElement?.removeEventListener('scroll', scrollToEndHandler)
    listElement?.removeEventListener('scroll', scrollToTopHandler)
  }

  const scrollToEnd = () => {
    const listElement = scrollViewRef?.current
    listElement.scroll({
      top: listElement?.scrollHeight
      // behavior: "smooth",
    })
  }

  const scrollToEndHandler = (e: any) => {
    const scrollTop = e.target.scrollTop
    const offsetHeight = e.target.offsetHeight
    const scrollHeight = e.target.scrollHeight
    const scrolledHeight = scrollHeight - (scrollTop + offsetHeight)
    if (0 <= scrolledHeight && scrolledHeight <= 20 && prevScrolledHeight.current > scrolledHeight) {
      props?.onScrolledToEnd && props?.onScrolledToEnd(true)
    }
    prevScrolledHeight.current = scrolledHeight
  }

  const scrollToTopHandler = (e: any) => {
    const listElement = scrollViewRef?.current
    const scrollTop = e.target.scrollTop
    const offsetHeight = e.target.offsetHeight
    const scrollHeight = e.target.scrollHeight
    const scrolledHeight = scrollHeight - (scrollTop + offsetHeight)
    if (scrollTop == 0 && prevScrolledHeight.current <= scrolledHeight) {
      prevScrollHeightMinusTop.current = listElement?.scrollHeight - listElement?.scrollTop
      props?.onScrolledToTop && props?.onScrolledToTop(true)
    }
    prevScrolledHeight.current = scrolledHeight
  }

  const restorePositionScrollOnTop = () => {
    const listElement = scrollViewRef?.current
    listElement.scrollTop = listElement.scrollHeight - prevScrollHeightMinusTop.current - 40
  }

  return (
    <div ref={scrollViewRef} className={'overflow-y-auto ' + props?.className}>
      {props?.children}
    </div>
  )
})

export default ScrollView
