import { useState } from "react";

import "@/styles/contextMenu.css";

interface ContextMenuProps {
  menuItems: any[];
  elementId: string;
  itemId: number;
  onContextMenu?: (itemId: number) => void;
}

export default function ContextMenu({
  menuItems,
  elementId,
  itemId,
  onContextMenu = () => {},
}: ContextMenuProps) {
  const [clicked, setClicked] = useState(false);
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
  });

  let pos = { x: 0, y: 0 };
  let menu = { h: 0, w: 0 };
  let browser = { h: 0, w: 0 };
  let showMenu = false;

  function rightClickContextMenu(e: any) {
    e.preventDefault();
    onContextMenu(itemId);

    showMenu = true;

    browser = {
      w: window.innerWidth,
      h: window.innerHeight,
    };

    pos = {
      x: e.clientX,
      y: e.clientY,
    };

    if (browser.h - pos.y < menu.h) pos.y = pos.y - menu.h;
    if (browser.w - pos.x < menu.w) pos.x = pos.x - menu.w;
  }

  function onPageClick() {
    showMenu = false;
  }

  function getContextMenuDimension(node: HTMLElement) {
    let height = node.offsetHeight;
    let width = node.offsetWidth;

    menu = {
      h: height,
      w: width,
    };
  }

  if (!showMenu) return null;

  return (
    <nav
      className={`absolute top-[${pos.y}px] left-[calc(${pos.x}px - 20rem)]`}
      onContextMenu={rightClickContextMenu}
    >
      <div className="navbar">
        <ul>
          {itemId && (
            <>
              <p>{itemId}</p>
              <hr />
            </>
          )}

          {menuItems.map((item: ContextMenuItem) => {
            if (item.name == "hr") return <hr />;

            if (!item.onClick) {
              return <p className={item.class}>{item.displayText}</p>;
            }

            return (
              <li>
                <button onClick={(e) => item.onClick!(e, itemId)}>
                  <i className={item.class} />
                  {item.displayText}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

{
  /* <svelte:window on:contextmenu={rightClickContextMenu} on:click={onPageClick} /> */
}
