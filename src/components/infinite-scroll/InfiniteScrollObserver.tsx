import { useRef, useCallback } from 'react'

interface InfiniteScrollObserverProps {
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
  children: (ref: (node: HTMLElement | null) => void) => React.ReactNode
}

const InfiniteScrollObserver = ({
  loading,
  hasMore,
  onLoadMore,
  children,
}: InfiniteScrollObserverProps) => {
  const observer = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, onLoadMore]
  )

  return <>{children(lastElementRef)}</>
}

export default InfiniteScrollObserver
