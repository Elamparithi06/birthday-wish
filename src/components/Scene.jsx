import CakeTable from './CakeTable';
import Character from './Character';
import ConfettiLayer from './ConfettiLayer';

function Scene({ celebrating, birthdayName = 'Birthday Girl' }) {
  return (
    <div className="scene-wrap">
      <ConfettiLayer celebrating={celebrating} />

      <div className="scene">
        <div className="birthday-message">
          <span className="birthday-tag">Happy Birthday</span>
          <h2>An unforgettable cake-cutting surprise</h2>
        </div>

        <div className="spotlight" />

        <Character
          label="Friend 01"
          positionClass="character-left"
          bodyClass="body-blue"
          hairClass=""
          rightArmClass="wave-arm"
        />

        <Character
          label={birthdayName}
          positionClass="character-right"
          bodyClass="body-pink"
          hairClass="hair-side"
          rightArmClass={celebrating ? 'cut-arm' : ''}
        />

        <CakeTable celebrating={celebrating} />
        <div className="floor-glow" />
      </div>
    </div>
  );
}

export default Scene;
