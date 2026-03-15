export default function StartScreen({ onStart }) {
  return (
    <div className="start-screen">
      <h1 className="start-title">Jogo das Formas</h1>
      <button className="start-btn" onClick={onStart}>
        Começar
      </button>
    </div>
  )
}
