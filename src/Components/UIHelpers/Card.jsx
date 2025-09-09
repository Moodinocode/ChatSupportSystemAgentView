import React from "react";


const Card = ({ className = "", children, ...props }) => {
  return (
    <div className={"card bg-base-100 shadow-md rounded-lg " + className} {...props}>
      {children}
    </div>
  );
};


const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={"card-body p-4 " + className} {...props}>
      {children}
    </div>
  );
};


const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h2 className={"card-title text-xl font-semibold " + className} {...props}>
      {children}
    </h2>
  );
};


const CardDescription = ({ className = "", children, ...props }) => {
  return (
    <p className={"text-sm text-gray-500 " + className} {...props}>
      {children}
    </p>
  );
};



const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div className={"p-4 " + className} {...props}>
      {children}
    </div>
  );
};


const CardFooter = ({ className = "", children, ...props }) => {
  return (
    <div className={"card-actions justify-end p-4 " + className} {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
