import * as React from "react";
import Svg, { G, Ellipse, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const GlowBackground = (props) => (
  <Svg
    width={390}
    height={446}
    viewBox="0 0 390 446"
    fill="none"
    {...props}
  >
    <G filter="url(#filter0_f_5_162)">
      <Ellipse cx={28} cy={43} rx={121} ry={109} fill="#99225E" />
    </G>
    <Defs></Defs>
  </Svg>
);
export default GlowBackground;
