import { Circle } from "phosphor-react"
import React, {
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import styles from "./carousel.module.scss"

interface CarouselProps {
  children: ReactNode[]
  uniqueClassName: string
  initialSelectedIndex: number
  rotationCycleDuration: number
  heightInPixels: number
  width: number
  unit: string
}

const carouselSelectorSize = 20

export const Carousel = (props: CarouselProps) => {
  const [scrollIndex, setScrollIndex] = useState(0)
  const maxIndex = props.children.length
  const carouselRef = useRef<HTMLDivElement>(null)
  const componentListRef = useRef<HTMLUListElement>(null)

  // styling
  const standardBoxSize = {
    height: props.heightInPixels,
    width: props.width + props.unit,
  }

  ///* Begin repeating scrolling functionality
  const scrollToIndex = (index: number) => {
    const nextElement = document.getElementById(
      props.uniqueClassName + index
    )

    const elementOffset = nextElement?.offsetLeft

    carouselRef.current?.scrollTo({
      left: elementOffset,
      behavior: "smooth",
    })
  }

  const repeatingScrollingFunction = () => {
    // animate a scroll animation to the corresponding element
    let nextIndex = scrollIndex + 1
    if (nextIndex == maxIndex) {
      nextIndex = 0
    }

    setScrollIndex(nextIndex)
    scrollToIndex(nextIndex)
  }

  useEffect(() => {
    const intervalId = setInterval(
      repeatingScrollingFunction,
      props.rotationCycleDuration
    )

    return () => {
      clearInterval(intervalId)
    }
  })

  ///* End repeating scrolling functionality

  ///* Begin window resize functionality

  let resizeTimeout: NodeJS.Timeout
  const resizeFunction = () => {
    // will resize the carousel and position it correctly every 500ms after resizing
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(
      () => scrollToIndex(scrollIndex),
      200
    )
  }

  useEffect(() => {
    window.addEventListener("resize", resizeFunction)
    return () =>
      window.removeEventListener("resize", resizeFunction)
  })

  ///* End window resize functionality

  return (
    <div
      className={styles.Carousel}
      style={standardBoxSize}
    >
      <div
        ref={carouselRef}
        className={
          styles.carouselWrapper +
          " " +
          props.uniqueClassName
        }
        style={standardBoxSize}
      >
        <ul
          ref={componentListRef}
          className={styles.componentList}
          style={{
            height: props.heightInPixels,
            width: `${props.width * props.children.length}${
              props.unit
            }`,
          }}
        >
          {props.children.map((element, index) => {
            return (
              <li
                key={index}
                id={props.uniqueClassName + index}
                style={{
                  height: props.heightInPixels,
                  width: props.width + props.unit,
                }}
              >
                {element}
              </li>
            )
          })}
        </ul>
      </div>
      <ul className={styles.selectorList}>
        {props.children.map((element, index) => {
          return (
            <li
              key={index}
              onClick={() => {
                setScrollIndex(index)
                scrollToIndex(index)
              }}
            >
              <Circle
                size={carouselSelectorSize}
                color={"white"}
                weight={
                  scrollIndex == index ? "fill" : "light"
                }
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
