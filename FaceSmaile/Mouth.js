import { arc } from 'd3';
const Mouth = ({ mouthRadius, mouthWidth }) => {
  const mounthArc = arc()
    .innerRadius(mouthRadius)
    .outerRadius(mouthRadius + mouthWidth)
    .startAngle(Math.PI / 2)
    .endAngle((Math.PI * 3) / 2);

  return <path d={mounthArc()} />;
};

export default Mouth;
