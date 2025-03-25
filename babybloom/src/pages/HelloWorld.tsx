import React from 'react';

const HelloWorld: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Hello, World!</h1>
        <p className="text-lg text-gray-600">If you can see this, React is working properly.</p>
      </div>
    </div>
  );
};

export default HelloWorld;
