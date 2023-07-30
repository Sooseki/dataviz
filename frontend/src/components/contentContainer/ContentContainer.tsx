import { ReactNode } from "react";

const ContentContainer = ({ children }: { children: ReactNode }) => {
  return <div className="container">
    {children}
  </div>;
}

export default ContentContainer;