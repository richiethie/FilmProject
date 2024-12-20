import { useIsMobile } from "@/context/MobileContext"
import { Box, Button, HStack } from "@chakra-ui/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type CategoryPillProps = {
    categories: string[]
    selectedCategory: string
    onSelect: (category: string) => void
}

const TRANSLATE_AMOUNT = 200

const CategoryPills = ({categories, selectedCategory, onSelect}: CategoryPillProps) => {
    const [isLeftVisible, setIsLeftVisible] = useState(false)
    const [isRightVisible, setIsRightVisible] = useState(false)
    const [translate, setTranslate] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const isMobile = useIsMobile();

    useEffect(() => {
        if (containerRef.current == null) return

        const observer = new ResizeObserver(entries => {
            const container = entries[0]?.target
            if (container == null) return

            setIsLeftVisible(translate > 0)
            setIsRightVisible(
                translate + container.clientWidth < container.scrollWidth
            )
        })

        observer.observe(containerRef.current)

        return () => {
            observer.disconnect()
        }
    }, [categories, translate])

    if (isMobile) {
        return (
          <Box
            overflowX="scroll"
            scrollbar="hidden"
            display="flex"
            scrollSnapType="x mandatory"
            px={2}
            className="overflow-hidden"
          >
            <HStack as="ul">
              {categories.map((category) => (
                <button 
                    key={category}
                    onClick={() => onSelect(category)}
                    // variant={selectedCategory === category ? "dark" : "default"} 
                    className={`py-1 px-3 rounded-lg ${selectedCategory === category ? "bg-cornflowerBlue" : "bg-darkCharcoal"} whitespace-nowrap`}
                >
                    {category}
                </button>
              ))}
            </HStack>
          </Box>
        );
    }

    return (
        <div className="overflow-x-hidden relative" ref={containerRef}>
            <div 
                className="flex whitespace-nowrap gap-3 transition-transform w-[max-content]"
                style={{ transform: `translateX(-${translate}px)`}}
            >
                {categories.map(category => (
                    <button 
                        key={category}
                        onClick={() => onSelect(category)}
                        // variant={selectedCategory === category ? "dark" : "default"} 
                        className={`py-1 px-3 rounded-lg ${selectedCategory === category ? "bg-cornflowerBlue" : "bg-darkCharcoal"} whitespace-nowrap`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            {isLeftVisible && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-white from-50% to-transparent w-24 h-full">
                    <button 
                        className="h-full aspect-square w-auto p-1.5"
                        onClick={() => {
                            setTranslate(translate => {
                                const newTranslate = translate - TRANSLATE_AMOUNT
                                if (newTranslate <= 0) return 0
                                return newTranslate
                            })
                        }}
                    >
                        <ChevronLeft />
                    </button>
                </div>
            )}   
            {isRightVisible && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-white from-50% to-transparent w-24 h-full flex justify-end">
                    <button 
                        className="h-full aspect-square w-auto p-1.5"
                        onClick={() => {
                            setTranslate(translate => {
                                if (containerRef.current == null) {
                                    return translate
                                }
                                const newTranslate = translate + TRANSLATE_AMOUNT
                                const edge = containerRef.current.scrollWidth
                                const width = containerRef.current.clientWidth
                                if (newTranslate + width >= edge) {
                                    return edge - width
                                }
                                return newTranslate
                            })
                        }}
                    >
                        <ChevronRight />
                    </button>
                </div>
            )}   
        </div>
    )
}

export default CategoryPills