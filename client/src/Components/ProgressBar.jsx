import React,{useMemo,useEffect} from 'react'
import NProgress from 'nprogress';

const ProgressBar = () => {
    useMemo(() => {
        NProgress.start();
      }, []);
    
      useEffect(() => {
        NProgress.done();
      }, []);
  return null
}

export default ProgressBar