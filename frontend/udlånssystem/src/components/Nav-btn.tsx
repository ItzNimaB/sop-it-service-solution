import { NavLink } from "react-router-dom";

export default function ({
  destination = "/",
  text = "Home",
  icon = "fa-solid fa-house",
}) {
  return (
    <NavLink
      to={destination}
      className="button w-full cursor-pointer rounded-[10px] border-none bg-transparent p-[0.7rem_1rem] transition-colors duration-100 ease-in-out"
    >
      <div className="flex items-center justify-start gap-2">
        <i className={icon + " text-foreground3 w-8 text-center text-xl"} />
        <p className="text-foreground3 text-[1.2rem]">{text}</p>
      </div>
    </NavLink>
  );
}
