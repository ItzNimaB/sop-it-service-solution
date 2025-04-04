let pressedKeys: string[] = [];
let firstKeyPress = 0;
const maxTimeBetweenKeyPresses = 350;

export async function handleBarcodeScan(
  e: KeyboardEvent,
  callback: (barcode: string) => void,
) {
  if (pressedKeys.length === 0) firstKeyPress = new Date().getTime();

  if (["Shift", "Control", "Alt"].includes(e.key)) return;

  setTimeout(() => {
    pressedKeys = [];
  }, maxTimeBetweenKeyPresses);

  if (e.key == "Enter") {
    e.preventDefault();
    const barcode = pressedKeys.join("");
    if (new Date().getTime() - firstKeyPress > maxTimeBetweenKeyPresses) {
      return (pressedKeys = []);
    }

    pressedKeys = [];

    return callback(barcode);
  } else pressedKeys.push(e.key);
}
