import React from 'react';
import ReactDOM from 'react-dom';
import { useState,useEffect } from 'react'
import "babel-polyfill"
import Header from './Header.jsx';
import { BsExclamationCircle,BsTelephoneOutboundFill,BsTelephoneInboundFill } from 'react-icons/bs'
import { HiPhoneMissedCall } from 'react-icons/hi'

const api = {
  getItems: async () => {
    try{
      const result = await fetch("https://aircall-job.herokuapp.com/activities");
      const items = await result.json();
     //console.log("fetch items:", items);
      return items;
    }catch (error) {
      return [];
    }
  },
  getItemDetail: async (itemId) => {
    try {
      const result = await fetch(
        `https://aircall-job.herokuapp.com/activities/${itemId}`
      );
      const item = await result.json();
      // console.log("fetch item:", item);
      return item;
    } catch (error) {
      return null;
    }
  },
  updateItems: async (object) => {
   // object.is_archived=(!object.is_archived)
  }
}

const util = {
  getTime: (isoTime) => {
    try {
      const time = new Date(isoTime);
      return time.toLocaleString();
    } catch (err) {
      return '';
    }
  }
};


const App = () => {
  const [showDetail,setShowDetail] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const [activities, setActivities] = useState([])
  useEffect(() => {
    async function fetchData(){
      const items = await api.getItems();
      setActivities(items);
    }
    fetchData()
  }, [])  
  return (
    <div className='container'>
      <Header/>
      {showDetail ? (<ActivitiesDetail itemId={detailId} 
        onClickItem={()=>{
          setShowDetail(false)
          setDetailId(null)
      }}/>)

      : (<Activities activities={activities} 
        onClickItem={(id)=>{
          setDetailId(id)
          setShowDetail(true)
        } }/> )}
    </div>
  );
};



// Activities componet
const Activities = ({activities, onClickItem}) => {
  return (
    <div>
      {
        activities.map((item)=>{
          //console.log(item.call_type)
          return (<div className='activity-container'> 
                  {item.direction==='inbound'?<BsTelephoneInboundFill id='phone'/>:
                     <BsTelephoneOutboundFill id='phone'/>}
                     
                  <div id='text'>
                    <div>
                      <b>{item.from}
                      {item.call_type === 'missed' && <HiPhoneMissedCall id='miss'/>}</b> 
                      <BsExclamationCircle id='icon' style={{color: 'green', cursor: 'pointer'}}
                      onClick={()=>onClickItem(item.id)}/>
                    </div> 
                    <div>{item.via}</div>
                    <div>{util.getTime(item.created_at)}</div>
                    </div>
                </div>)
        })
      }
    </div>
  )
}



//Activity detail component
const ActivitiesDetail = ({itemId, onClickItem}) => {
  const [activity, setActivity] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
      async function fetchItem(){
        setLoading(true)
         const item = await api.getItemDetail(itemId);
         item && setActivity(item);
      } 
      fetchItem()
      setLoading(false)
  }, []);


  //console.log(activity)

  return(
      !loading ? 
      <div className='detail_container'>
          <p>ID: {itemId}</p>
          <p>Time: {util.getTime(activity.created_at)}</p>
          <p>Direction: {activity.direction}</p>
          <p>From: {activity.from}</p>
          <p>To: {activity.to}</p>
          <p>Via: {activity.via}</p>
          <p>Duration: {activity.duration} seconds</p>
          <p>Type: {activity.call_type}</p>
          <button onClick={()=> onClickItem()}>Back</button>
      </div>
   : <div>Loading...</div>
  )
}



ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
