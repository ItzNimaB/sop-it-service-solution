import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

import { formatPathToBreadcrumbs } from "@/services/pathFormatter";

export default function Breadcrumbs() {
  const location = useLocation();
  const navigate = useNavigate();

  function handleClick(inputpath: string) {
    if (location.pathname === inputpath) return;

    navigate(inputpath, { replace: true });
  }

  return (
    <div className="p-2">
      <div className="bg-base-200 box-border flex w-full items-center gap-2 rounded-[10px] p-[3px]">
        {formatPathToBreadcrumbs(location.pathname).map((path, i: number) => (
          <Fragment key={i}>
            <button
              onClick={() => {
                handleClick(path.fullPath);
              }}
              className="cursor-pointer rounded-xl border-none bg-transparent p-[0.4rem_1rem] text-base font-medium underline transition-colors duration-100 ease-in-out"
            >
              <p>{path.path}</p>
            </button>

            {path.seperator && <i className="fa-solid fa-angles-right" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
