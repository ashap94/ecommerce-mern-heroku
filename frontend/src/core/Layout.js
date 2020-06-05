import React, { useEffect, useRef, useState } from "react";
import Menu from "./Menu";
import "../styles.css";

const Layout = ({
  title = "Title",
  description = "Description",
  children,
  className,
}) => {
  const [loaded, setLoaded] = useState(false);
  const menuRef = useRef(null);
  const divContainerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoaded(true);
  }, []);

  useEffect(() => {
    // const { current } = menuRef;

    divContainerRef.current.style.paddingTop =
      menuRef.current.scrollHeight + "px";
  }, [loaded]);

  return (
    <div>
      <Menu menuRef={menuRef} />
      <div ref={divContainerRef}>
        <div className="jumbotron">
          <h2>{title}</h2>
          <p className="lead">{description}</p>
        </div>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};
export default Layout;
