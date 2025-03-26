import { Link } from "react-router-dom";

import NavBtn from "./Nav-btn.tsx";
import NavMenu from "./Nav-menu.tsx";
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
        <NavBtn destination="/" text="Hjem" icon="fa-solid fa-house" />
        <NavBtn
          destination="/udlaan"
          text="Udlån"
          icon="fa-solid fa-file-signature"
        />

        <NavBtn
          destination="/produkter"
          text="Produkter"
          icon="fa-solid fa-bag-shopping"
        />
        <NavBtn
          destination="/produkttyper"
          text="Produkttyper"
          icon="fa-solid fa-barcode"
        />
        <NavBtn destination="/brugere" text="Brugere" icon="fa-solid fa-user" />

        <NavMenu
          buttons={[
            {
              text: "Kategorier",
              icon: "fa-solid fa-tag",
              destination: "/kategorier",
            },
            {
              text: "Brands",
              destination: "/brands",
              icon: "fa-regular fa-copyright",
            },
            {
              text: "Produkt Statusser",
              icon: "fa-solid fa-clipboard-question",
              destination: "/produktstatusser",
            },
            {
              text: "Bygninger",
              icon: "fa-solid fa-building",
              destination: "/bygninger",
            },
            {
              text: "Zoner",
              icon: "fa-solid fa-map-marker-alt",
              destination: "/zoner",
            },
            {
              text: "Dashboard",
              icon: "fa-solid fa-chart-line",
              destination: "/dashboard",
            },
          ]}
          icon="fa-solid fa-ellipsis"
          text="Mere"
        />
      </section>
      <section className="mt-auto">
        <hr className="border-foreground2 w-full border-[1px] border-solid" />

        <Link
          to="https://signup.itskp-odense.dk/Home/Signup"
          target="_blank"
          className="button w-full cursor-pointer rounded-[10px] border-none bg-transparent p-[0.7rem_1rem] transition-colors duration-100 ease-in-out"
        >
          <div className="flex items-center justify-start gap-2">
            <i className="fa-solid fa-user" />
            <p className="text-foreground3 text-[1.2rem]">Opret bruger</p>
            <i className="fa-solid fa-external-link-alt" />
          </div>
        </Link>

        <hr className="border-foreground2 w-full border-[1px] border-solid" />
        <NavBtn
          destination="/notifikationer"
          text="Notifikationer"
          icon="fa-solid fa-bell"
        />
        <NavBtn
          destination="/feedback"
          text="Feedback"
          icon="fa-solid fa-pen-to-square"
        />
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
