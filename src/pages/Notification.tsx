import { useState } from "react";
import Notification from "../components/notifiation";

// const Loader = () => (
//   <div className="flex items-center justify-center h-screen">
//     <div className="loader"></div>
//   </div>
// );

export default function NotificationPage(){ 
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className='notification'>
      {/* {isLoading ? <Loader /> : (
        <>
          <span className='text-xl text-gray-200 underline mt-10'>Notifs</span>
          <Notification />
        </>
      )} */}
      <span className='flex flex-col justify-center items-center text-2xl text-gray-200 mt-10'>Next episodes of your shows</span>
        <Notification />
    </div>
  );
}