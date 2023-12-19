import { useCallback, useRef } from "react";
import usePosts from "./hooks/usePosts";
import Post from "./Post";
import { useInfiniteQuery } from "react-query";
import { getPostsPage } from "./api/axios";
//Using react-query

const Method2 = () => {
  
    const {
        fetchNextPage,
        status,
        isFetchingNextPage,
        data,
        hasNextPage,
        error
    } = useInfiniteQuery('/posts',({pageParam=1})=>getPostsPage(pageParam),{
        getNextPageParam:(lastPage,allPages)=>{
            return lastPage.length?allPages.length+1 :undefined
        }
    })

    const intObserver = useRef()
    const lastPostRef = useCallback(post => {
        if (isFetchingNextPage) return

        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                console.log('We are near the last post!')
                fetchNextPage()
            }
        })

        if (post) intObserver.current.observe(post)
    }, [isFetchingNextPage,fetchNextPage, hasNextPage])

    if (status==='error') return <p className='center'>Error: {error.message}</p>

    const content = data?.pages.map((pg) => {
      return  pg.map((post, i) => {
            if (pg.length === i + 1) {
                return <Post ref={lastPostRef} key={post.id} post={post} />
            }
            return <Post key={post.id} post={post} />
        })
    })

    return (
        <>
            <h1 id="top">&infin; Infinite Query &amp; Scroll<br />&infin; Ex. 2 - With React-Query</h1>
            {content}
            {isFetchingNextPage && <p className="center">Loading More Posts...</p>}
            <p className="center"><a href="#top">Back to Top</a></p>
        </>
    )
};
export default Method2;
