import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SourceFinder from '../../Apis/SourceFinder';
const UpdateSources = () => {
    const [updateStatus, setUpdateStatus] = useState(null)
    const navigate = useNavigate();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const updated = await SourceFinder.post(`/admin`);
        setUpdateStatus("Sources updated")
        navigate("/")
    }
  return <div className='d-flex justify-content-center'>
  {updateStatus &&<div className="alert alert-danger" role="alert">{updateStatus}</div>}
<button className='btn bg-primary' onClick={handleSubmit} style={{color:"#fff"}}>UPDATE SOURCES!</button></div>;
};

export default UpdateSources;
