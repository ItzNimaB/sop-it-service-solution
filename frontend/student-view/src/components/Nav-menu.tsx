import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function NavMenu({
  text = "Home",
  icon = "fa-solid fa-house",
  buttons = [
    {
      text: "",
      icon: "",
      destination: "/",
    },
  ],
}) {
  const location = useLocation();

  const [open, setOpen] = useState(false);

  //toggle menu
  function handleMenuClick() {
    setOpen(!open);
  }

  useEffect(() => {
    if (open) {
      scrollIntoView2(buttons[buttons.length - 1].text);
    }
  }, [open]);

  //scroll to element when menu is opened
  function scrollIntoView2(classname: string) {
    setTimeout(() => {
      const el = document.getElementById(classname);
      if (!el) return;

      el.scrollIntoView({
        behavior: "smooth",
      });
    }, 10);
  }

  function isClosed() {
    return !open ? "rotate-180" : "";
  }

  return (
    <>
      <button
        className="w-full cursor-pointer rounded-[10px] p-0 transition-colors duration-100 ease-in-out"
        onClick={handleMenuClick}
      >
        <div className="flex items-center justify-between gap-2 p-[0.7rem_1rem]">
          <div className="flex items-center justify-start gap-2">
            <i className={icon} />
            <p className="text-[1.2rem] text-foreground3">{text}</p>
          </div>

          <i className={"fa-solid fa-angle-up " + isClosed()} />
        </div>
      </button>

      {open && (
        <div className="flex w-full flex-col gap-2 pl-16">
          {buttons.map((button, i) => (
            <NavLink
              id={button.text}
              key={i}
              className="w-full cursor-pointer rounded-[10px] p-0 text-center transition-colors duration-100 ease-in-out"
              to={button.destination}
            >
              <div className="flex items-center justify-start gap-2 p-[0.5rem_1rem]">
                {button.icon && <i className={button.icon} />}
                <p className="text-[1.2rem] text-foreground3">{button.text}</p>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
