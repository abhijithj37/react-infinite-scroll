import { useEffect, useState } from "react"
import { getPostsPage } from "../api/axios"


const usePosts=(pageNum=1)=>{
    const [results,setResults]=useState([])
    const [isLoading,setIsLoading]=useState(false)
    const [isError,setIsError]=useState(false)
    const [error,setError]=useState({})
    const [hasNextPage,setHasNextPage]=useState(false)



    useEffect(()=>{

        setIsLoading(true)
        setIsError(false)
        setError({})

        const controller=new AbortController()
        const {signal}=controller
        getPostsPage(pageNum,{signal})
        .then((data)=>{
            setResults(prev=>[...prev, ...data])
            setHasNextPage(Boolean(data.length))
            setIsLoading(false)

        }).catch((err)=>{
            if(signal.aborted)return
            setIsError(true)
            setError({message:err.message})
        })
        
        return ()=>controller.abort()

    },[pageNum])

    return {results,isError,isLoading,error,hasNextPage}

}

export default usePosts