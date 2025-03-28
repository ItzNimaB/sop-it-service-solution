export default function Home() {
  return (
    <div className="flex max-h-screen flex-col items-center gap-2 pt-16">
      <h1 className="text-[3rem]">Velkommen til helpdesk'en</h1>
      <p className="text-foreground2 text-[1.2rem]">
        Hvordan kan vi hjælpe dig i dag?
      </p>
      <img
        className="h-full w-3/5 object-cover"
        src="svg/welcome.svg"
        alt="Welcome"
      />
    </div>
  );
}
