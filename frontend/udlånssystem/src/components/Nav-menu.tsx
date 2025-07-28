import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

interface NavMenuProps {
  text: string;
  icon?: string;
  buttons: {
    text: string;
    icon?: string;
    destination: string;
  }[];
}

export default function NavMenu({ text, icon = "", buttons }: NavMenuProps) {
  const [open, setOpen] = useState(false);

  function handleMenuClick() {
    setOpen(!open);
  }

  useEffect(() => {
    if (open) scrollIntoView2(buttons[buttons.length - 1].text);
  }, [open]);

  function scrollIntoView2(classname: string) {
    setTimeout(() => {
      const el = document.getElementById(classname);
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth" });
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
            <p className="text-foreground3 text-[1.2rem]">{text}</p>
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
                <p className="text-foreground3 text-[1.2rem]">{button.text}</p>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
