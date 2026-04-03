function Character({ label, positionClass, bodyClass, hairClass, rightArmClass }) {
  return (
    <div className={`character ${positionClass}`}>
      <div className={`hair ${hairClass}`.trim()} />
      <div className="head">
        <div className="face" />
      </div>
      <div className={`body ${bodyClass}`} />
      <div className={`arm arm-right ${rightArmClass}`.trim()} />
      <div className="arm arm-left" />
      <div className="leg leg-left" />
      <div className="leg leg-right" />
      <span className="character-label">{label}</span>
    </div>
  );
}

export default Character;
