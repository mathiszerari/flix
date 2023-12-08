import { useState, useEffect } from 'react';

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="loader"></div>
  </div>
);

const Notification = () => {
  const [isLoading, setIsLoading] = useState(true);


  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className='notification'>
      {isLoading ? <Loader /> : (
        <>
          <span className='text-xl text-gray-200 underline mt-10'>Notifs</span>
        </>
      )}
    </div>
  );
};

export default Notification;