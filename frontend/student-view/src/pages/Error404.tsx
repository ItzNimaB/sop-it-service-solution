export default function Error404() {
  return (
    <div className="flex h-full flex-col items-center gap-2 overflow-y-auto pt-20">
      <h1>Error 404</h1>
      <p className="text-foreground2">Page not found</p>
      <img className="w-3/5" src="svg/error404.svg" alt="Error 404" />
    </div>
  );
}
