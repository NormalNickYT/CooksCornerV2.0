import React, { useState } from "react";
import useDarkSide from "../../hooks/useDarkSide";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useSound from "../../hooks/useSound";
import switchSound from '../../assets/sounds/light-switch.mp3';

export default function Switcher() {
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );

  const [playSound] = useSound(switchSound); 

  const toggleDarkMode = (checked : boolean) => {
    if (typeof setTheme === 'function') {
      setTheme(colorTheme);
    }
    setDarkSide(checked);
    playSound(); 
  };

  return (
    <>
      <div>
        <DarkModeSwitch
          checked={darkSide}
          onChange={toggleDarkMode}
          size={30}
        />
      </div>
    </>
  );
}
