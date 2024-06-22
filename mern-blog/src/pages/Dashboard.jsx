import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments'
import DashBoardComp from '../components/DashBoardComp';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState(''); 

  useEffect( () => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className=''>
        <DashSidebar/>
      </div>
      {tab === 'profile'? <DashProfile/>: null}
      {tab === 'posts'? <DashPosts/>: null}
      {tab === 'users'? <DashUsers/>: null}
      {tab === 'comments'? <DashComments/>: null}
      {tab === 'dashboard'? <DashBoardComp/>: null}
    </div>
  )
}
