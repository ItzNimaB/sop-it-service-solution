export function cheatCode() {
  //the cheat code is "up up down down left right left right b a"
  const codes = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let index = 0;
  function keydownHandler(e: KeyboardEvent) {
    if (codes[index] === e.keyCode) {
      index++;
      if (index === codes.length) {
        window.removeEventListener("keydown", keydownHandler);
        window.dispatchEvent(new Event("cheatCode"));
      }
    } else {
      index = 0;
    }
  }
  window.addEventListener("keydown", keydownHandler);
}
