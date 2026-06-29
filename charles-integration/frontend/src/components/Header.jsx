import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <span className="header__logo" aria-hidden="true">🎉</span>
        <h1 className="header__title">Kudos Board</h1>
      </div>
    </header>
  )
}

export default Header
