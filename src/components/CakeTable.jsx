import { candles } from '../data/sceneData';

function CakeTable({ celebrating }) {
  return (
    <div className={`cake-table ${celebrating ? 'cake-table-active' : ''}`}>
      <div className="cake-shadow" />
      <div className="knife" />
      <div className="cake-top">
        {candles.map((candle) => (
          <div key={candle} className="candle">
            <span className="flame" />
          </div>
        ))}
      </div>
      <div className="cake-middle" />
      <div className="cake-base" />
      <div className="table-top" />
      <div className="table-front" />
    </div>
  );
}

export default CakeTable;
