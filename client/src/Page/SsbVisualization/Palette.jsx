import { Box, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import ColorBox from "../../Components/ColorBox";
import { SketchPicker } from "react-color";

const Palette = () => {
  const [colors, setColors] = useState([
    { label: "NO DATA", color: "#121212" },
    { label: "0%", color: "#7A0000" },
    { label: "20%", color: "#CC0000" },
    { label: "40%", color: "#EF350B" },
    { label: "60%", color: "#FE662F" },
    { label: "80%", color: "#FF9257" },
    { label: "100%", color: "#FFBA7A" }
  ]);

  const [colorPick, setColorPick] = useState("#fff"); //useState([{color:"red",id:2}, {color:"green",id:3}])
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [chosenColor, setChosenColor] = useState("");
  function handleChangeComplete(newColor) {
    if (newColor !== "#fff" && newColor !== "undefined") {
      let newColorObject = colors.filter(
        (colorItem) => colorItem.color === chosenColor
      )[0];
      console.log(newColorObject);
      const oldColors = colors.filter(
        (colorItem) => colorItem.color !== chosenColor
      );
      newColorObject.color = newColor.hex;
      setColors([...oldColors, newColorObject]);
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
          color={colorPick}
          onChangeComplete={handleChangeComplete}
        />
      )}
    </>
  );
};

export default Palette;
