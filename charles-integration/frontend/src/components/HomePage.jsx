import Header from './Header'
import Banner from './Banner'
import Footer from './Footer'
import './HomePage.css'

function HomePage() {
  return (
    <div className="home">
      <Header />
      <Banner />
      <main className="home__content">
        {/* Placeholder — SearchBar, FilterButtons, and BoardGrid land here */}
        <p className="home__placeholder">Boards will appear here soon.</p>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
