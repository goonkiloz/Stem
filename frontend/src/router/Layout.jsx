import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Global/Navigation/Navigation";

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <Navigation />
        {isLoaded && <Outlet />}
        <Modal />
        <footer className="splash-page-footer">
        <p>©2024 Developed by Brendan Fosse for educational purpose</p>
                <div>
                    <a href="https://github.com/goonkiloz" target="_blank" rel="noreferrer">Brendan&apos;s Github </a>
                </div>
        </footer>
      </ModalProvider>
    </>
  );
}
