import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import NavBtn from "./nav-btn.tsx";
import NavMenu from "./nav-menu.tsx";
import Toggle from "./toggle.tsx";
import UserWidget from "./user-widget.tsx";

import "@/styles/navMenu.css";

export default function Nav() {
  const { t } = useTranslation();

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

            <h1 className="text-[1.75rem] font-medium">{t("Udlånsystem")}</h1>
            <h2 className="text-foreground2 flex gap-1 text-[1rem] font-normal no-underline">
              {t("Made by")}
              <a
                target="_blank"
                href="https://github.com/kenn7575"
                className="text-foreground text-[1rem] font-normal no-underline"
              >
                Kenni
              </a>
              &
              <a
                target="_blank"
                href="https://github.com/ItzNimaB"
                className="text-foreground text-[1rem] font-normal no-underline"
              >
                Nima
              </a>
            </h2>
          </div>
        </div>
      </section>

      <section className="mb-4 overflow-y-auto">
        <NavBtn destination="/" text={t("Home")} icon="fa-solid fa-house" />
        <NavBtn
          destination="/loans"
          text={t("Loans")}
          icon="fa-solid fa-file-signature"
        />

        <NavBtn
          destination="/products"
          text={t("Products")}
          icon="fa-solid fa-bag-shopping"
        />
        <NavBtn
          destination="/producttypes"
          text={t("Product types")}
          icon="fa-solid fa-barcode"
        />
        <NavBtn
          destination="/users"
          text={t("Users")}
          icon="fa-solid fa-user"
        />

        <NavMenu
          buttons={[
            {
              text: t("Categories"),
              icon: "fa-solid fa-tag",
              destination: "/categories",
            },
            {
              text: t("Brands"),
              destination: "/brands",
              icon: "fa-regular fa-copyright",
            },
            {
              text: t("Product status"),
              icon: "fa-solid fa-clipboard-question",
              destination: "/productstatus",
            },
            {
              text: t("Buildings"),
              icon: "fa-solid fa-building",
              destination: "/buildings",
            },
            {
              text: t("Zones"),
              icon: "fa-solid fa-map-marker-alt",
              destination: "/zones",
            },
            // {
            //   text: t("Dashboard"),
            //   icon: "fa-solid fa-chart-line",
            //   destination: "/dashboard",
            // },
          ]}
          icon="fa-solid fa-ellipsis"
          text={t("More")}
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
            <p className="text-foreground3 text-[1.2rem]">
              {t("Create new user")}
            </p>
            <i className="fa-solid fa-external-link-alt" />
          </div>
        </Link>

        <hr className="border-foreground2 w-full border-[1px] border-solid" />
        {/* <NavBtn
          destination="/notidications"
          text={t("Notifications")}
          icon="fa-solid fa-bell"
        /> */}
        <NavBtn
          destination="/feedback"
          text="Feedback"
          icon="fa-solid fa-pen-to-square"
        />
        <div className="flex w-full items-center justify-between p-[0.5rem_0_0_1rem]">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-moon text-foreground3 w-8 text-center text-xl" />
            <p className="text-foreground3 text-[1.2rem]">{t("Dark mode")}</p>
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
