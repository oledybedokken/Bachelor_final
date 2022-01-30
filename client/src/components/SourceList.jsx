import React, {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import SourceFinder from "../Apis/SourceFinder";
import { SourceContext } from '../context/SourceContext';

const SourceList = (props) => {

    const {sources, setSources} = useContext(SourceContext)
    let navigate = useNavigate()

    useEffect( () => {

        const fetchData =  async () => {
          try {
            const response = await SourceFinder.get("/");
            setSources(response.data.data.sources);
          } catch (error) {}
        };
    
      fetchData();    
      }, [])

      return (
        <div className="list-group">
          <table className="table table-hover table-dark">
              <thead>
                  <tr className="bg-primary">
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                  </tr>
              </thead>
              <tbody>
                {sources && sources.map(source => {
                  return(
                    <tr>
                      <td>{source.id}</td>
                      <td>{source.name}</td>
                  </tr>
                  )
                })}
                {}
              </tbody>
          </table>
        </div>
      )
}

export default SourceList