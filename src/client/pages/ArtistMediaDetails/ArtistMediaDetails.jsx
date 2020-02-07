import React, {
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  memo,
} from "react"
import { useLocation } from "react-router-dom"
import styled from "styled-components"
import useSWR, { useSWRPages } from "swr"
import queryString from "query-string"
import MediaItemList from "../../components/MediaItemList"
import artistMediaDetailsPage from "./connectArtistMediaDetailsReducer"
import PageBack from "../../components/PageBack"

const PageBackWrapper = styled.div`
  position: fixed;
  padding: 25px 15px 15px 15px;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 501;
  background-color: ${props => props.theme.mg};
`

const ArtistMediaDetailsPage = styled.div`
  min-height: 100vh;
  padding: 30px 15px 40px 15px;
`

const ListWrapper = styled.div`
  margin-top: 55px;
  width: 100%;
`

const MediaTypeToRequest = {
  bigAlbum: {
    title: "专辑",
    getUrl: (id, offset) => `/api/artist/album?id=${id}&offset=${offset}`,
    fetch: artistMediaDetailsPage.requestBigAlbums,
  },
  biggerMV: {
    title: "视频",
    getUrl: (id, offset) => `/api/artist/mv?id=${id}&offset=${offset}`,
    fetch: artistMediaDetailsPage.requestBigMVs,
  },
  song: {
    title: "热曲",
    getUrl: (id, offset) => `/api/artists?id=${id}&offset=${offset}`,
    fetch: artistMediaDetailsPage.requestSongs,
  },
}

const ArtistMediaDetails = memo(() => {
  const pageContainerRef = useRef()
  const page = useRef(0)
  const location = useLocation().search
  const { type, artistId } = useMemo(() => queryString.parse(location), [
    location,
  ])
  const { getUrl, fetch: pageFetch, title } = useMemo(
    () => MediaTypeToRequest[type],
    [type],
  )

  useLayoutEffect(() => {
    window.scroll(0, 0)
  }, [])

  useEffect(() => {
    window.title = title
  }, [title])

  const { pages, isLoadingMore, isReachingEnd, loadMore } = useSWRPages(
    "test-page",
    ({ offset, withSWR }) => {
      const { data } = withSWR(
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSWR(getUrl(artistId, offset || 0), pageFetch, {
          revalidateOnFocus: false,
        }),
      )
      page.current = offset
      return <MediaItemList list={data?.[0] ?? new Array(8).fill({ type })} />
    },
    // one page's SWR => offset of next page
    ({ data: projects }) => {
      if (projects?.[1]) {
        return page.current + 1
      }
      return null
    },
  )

  const onScroll = useCallback(() => {
    const isBottom =
      window.scrollY + 30 >
      pageContainerRef.current.clientHeight - window.innerHeight

    if (isBottom && !isReachingEnd && !isLoadingMore) {
      loadMore()
    }
  }, [isReachingEnd, loadMore, isLoadingMore])

  useEffect(() => {
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [onScroll])

  useEffect(() => {
    window.title = title
  }, [title])

  return (
    <ArtistMediaDetailsPage ref={pageContainerRef}>
      <PageBackWrapper>
        <PageBack title={title} />
      </PageBackWrapper>
      <ListWrapper>{pages}</ListWrapper>
    </ArtistMediaDetailsPage>
  )
})

export default ArtistMediaDetails
