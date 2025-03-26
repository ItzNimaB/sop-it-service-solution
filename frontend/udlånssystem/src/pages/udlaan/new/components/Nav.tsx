import { toast } from "sonner";

import "@/styles/navMenu.css";

interface NewLoanNavProps {
  page: number;
  setPage: (page: number) => void;
  products: any[];
  user: any;
  returnDate: Date | null;
  loanType: number;
}

export default function NewLoanNav({
  page,
  setPage,
  products,
  user,
  returnDate,
  loanType,
}: NewLoanNavProps) {
  function validateUser() {
    if (!user || !user.UUID) return false;

    return true;
  }

  function validateProducts() {
    if (products.length == 0) return false;

    return true;
  }

  function validateInfo() {
    if (returnDate === undefined) return false;

    if (!loanType) return false;

    return true;
  }

  return (
    <div className="navigation-bar">
      <button
        onClick={() => {
          setPage(1);
        }}
        className={`page-nav-btn ${page === 1 ? "current" : ""} ${page > 1 && !validateUser() ? "invalid" : ""} ${page > 1 && validateUser() ? "valid" : ""} `}
      >
        <i className="fa-solid fa-user" />
        <p>Bruger</p>
        {user?.Brugernavn && (
          <>
            <span>|</span>
            <span>{user.Brugernavn} </span>
          </>
        )}
      </button>

      <i className="fa-solid fa-angles-right" />

      <button
        onClick={() => {
          setPage(2);
        }}
        className={`page-nav-btn ${page === 2 ? "current" : ""} ${page > 2 && !validateProducts() ? "invalid" : ""} ${page > 2 && validateProducts() ? "valid" : ""}`}
      >
        <i className="fa-solid fa-cart-shopping" />
        <p>Produkter</p>
        {products.length > 0 && (
          <>
            <span>|</span>
            <span>{products.length}</span>
          </>
        )}
      </button>

      <i className="fa-solid fa-angles-right" />

      <button
        onClick={() => {
          setPage(3);
        }}
        className={`page-nav-btn ${page === 3 ? "current" : ""} ${page > 4 && !validateInfo() ? "invalid" : ""} ${page > 4 && validateInfo() ? "valid" : ""}`}
      >
        <i className="fa-solid fa-info" />
        <p>Info</p>
      </button>

      <i className="fa-solid fa-angles-right" />

      <button
        onClick={() => {
          if (validateInfo() && validateProducts() && validateUser()) {
            setPage(4);
          } else {
            toast.warning("Du kan ikke gå videre før alle felter er udfyldt");
          }
        }}
        className={`page-nav-btn ${page === 4 ? "current" : ""}`}
      >
        <i className="fa-solid fa-file-signature" />
        <p>Gennemse</p>
      </button>
    </div>
  );
}
