import BackgroundCircle from './BackgroundCircle.js';
import Eyes from './Eyes.js';
import Mouth from './Mouth.js';
import FaceContainer from './FaceContainer.js';

const Face = ({
  width,
  height,
  centerX,
  centerY,
  strokeWidth,
  eyeRadius,
  eyeOffSetX,
  eyeOffSetY,
  mouthWidth,
  mouthRadius,
}) => {
  return (
    <>
      <FaceContainer
        width={width}
        height={height}
        centerX={centerX}
        centerY={centerY}
      >
        <BackgroundCircle
          radius={centerY - strokeWidth / 2}
          strokeWidth={strokeWidth}
        />
        <Eyes
          eyeRadius={eyeRadius}
          eyeOffSetX={eyeOffSetX}
          eyeOffSetY={eyeOffSetY}
        />
        <Mouth
          mouthWidth={mouthWidth}
          mouthRadius={mouthRadius}
        />
      </FaceContainer>
    </>
  );
};

export default Face;
