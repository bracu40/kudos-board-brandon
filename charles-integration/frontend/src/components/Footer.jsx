import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">
        Kudos Board &middot; Built with React &middot; {new Date().getFullYear()}
      </p>
    </footer>
  )
}

export default Footer
