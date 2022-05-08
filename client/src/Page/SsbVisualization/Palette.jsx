import { Grid } from "@mui/material";
import React, { useState } from "react";
import ColorBox from "../../Components/ColorBox";
import { SketchPicker } from "react-color";

const Palette = ({colors,setColors}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [chosenColor, setChosenColor] = useState("");
  function handleChangeComplete(newColor) {
    if (newColor !== "#fff" && newColor !== "undefined") {
      let newColorObject = colors.filter( (colorItem) => colorItem.color === chosenColor)[0];
      const oldColors = colors.filter( (colorItem) => colorItem.color !== chosenColor);
      
      const cleanorder = [];
      colors.map((colorItem) => {
        if (colorItem.label === newColorObject.label) {
          colorItem.color = newColorObject.color;
        }
        cleanorder.push(colorItem);
      });

      newColorObject.color = newColor.hex;
      setColors(cleanorder);
      setShowColorPicker(false);
    }
    console.log(colors)
  }
  return (
    <>
      {colors && (
        <Grid display="flex" flexDirection={"column"}>
          {colors.map((input) => {
            return (
              <Grid
                item
                key={input.label}
                onClick={() =>
                  setShowColorPicker((showColorPicker) => !showColorPicker)
                }
              >
                <ColorBox
                  color={input.color}
                  label={input.label}
                  setChosenColor={setChosenColor}
                ></ColorBox>
              </Grid>
            );
          })}
        </Grid>
      )}
      {showColorPicker && (
        <SketchPicker
          color={chosenColor}
          onChangeComplete={handleChangeComplete}
        />
      )}
    </>
  );
};

export default Palette;
