import NavBtn from "./Nav-btn.tsx";
import Toggle from "./toggle.tsx";
import UserWidget from "./user-widget.tsx";

import "@/styles/navMenu.css";

export default function Nav() {
  return (
    <nav className="relative flex h-full flex-col items-center overflow-y-auto [&>section]:p-[0.8rem]">
      <section>
        <div className="flex w-full justify-evenly">
          <img
            src="/logo.png"
            alt="logo"
            className="max-w-[50px] object-contain"
          />
          <div className="text">
            <h3 className="text-foreground2 text-[1rem] font-light no-underline">
              v1.1.0-beta
            </h3>

            <h1 className="text-[1.75rem] font-medium">Udlånssystem</h1>
            <h2 className="text-foreground2 flex gap-1 text-[1rem] font-normal no-underline">
              By
              <a
                target="_blank"
                href="https://github.com/kenn7575"
                className="text-foreground2 text-[1rem] font-normal no-underline"
              >
                Kenni
              </a>
              &
              <a
                target="_blank"
                href="https://github.com/ItzNimaB"
                className="text-foreground2 text-[1rem] font-normal no-underline"
              >
                Nima
              </a>
            </h2>
          </div>
        </div>
      </section>

      <section className="mb-4 overflow-y-auto">
        <NavBtn
          destination="/udlaan"
          text="Lån"
          icon="fa-solid fa-file-signature"
        />
        <NavBtn
          destination="/laante-produkter"
          text="Lånte produkter"
          icon="fa-solid fa-basket-shopping"
        />
      </section>
      <section className="mt-auto">
        <div className="flex w-full items-center justify-between p-[0.5rem_0_0_1rem]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-moon text-foreground3 w-8 text-center text-xl" />
            <p className="text-foreground3 text-[1.2rem]">Dark mode</p>
          </div>
          <Toggle />
        </div>
        <div className="mt-4 w-full">
          <UserWidget />
        </div>
      </section>
    </nav>
  );
}
