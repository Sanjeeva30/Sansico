export default function Strip({ order = [1,2,3,4,5], style }) {
  return (
    <div className="strip" aria-hidden="true" style={style}>
      {order.map((n) => <span key={n} className={`c${n}`} />)}
    </div>
  );
}
