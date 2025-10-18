import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentDog, setCurrentDog] = useState(null)
  const [loading, setLoading] = useState(false)
  const [banList, setBanList] = useState([])
  const [allBreeds, setAllBreeds] = useState([])

  // Fetch all breeds on component mount
  useEffect(() => {
    fetchAllBreeds()
  }, [])

  const fetchAllBreeds = async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/list/all')
      const data = await response.json()
      const breeds = Object.keys(data.message)
      setAllBreeds(breeds)
    } catch (error) {
      console.error('Error fetching breeds:', error)
    }
  }

  const fetchRandomDog = async () => {
    setLoading(true)
    try {
      // Get a random breed that's not in the ban list
      const availableBreeds = allBreeds.filter(breed => !banList.includes(breed))
      
      if (availableBreeds.length === 0) {
        alert('All breeds are banned! Please remove some from the ban list.')
        setLoading(false)
        return
      }

      const randomBreed = availableBreeds[Math.floor(Math.random() * availableBreeds.length)]
      
      // Fetch random image for the selected breed
      const response = await fetch(`https://dog.ceo/api/breed/${randomBreed}/images/random`)
      const data = await response.json()
      
      if (data.status === 'success') {
        setCurrentDog({
          image: data.message,
          breed: randomBreed,
          temperament: getRandomTemperament(),
          size: getRandomSize(),
          lifespan: getRandomLifespan()
        })
      }
    } catch (error) {
      console.error('Error fetching dog:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRandomTemperament = () => {
    const temperaments = ['Friendly', 'Energetic', 'Calm', 'Playful', 'Loyal', 'Protective', 'Gentle', 'Active']
    return temperaments[Math.floor(Math.random() * temperaments.length)]
  }

  const getRandomSize = () => {
    const sizes = ['Small', 'Medium', 'Large', 'Extra Large']
    return sizes[Math.floor(Math.random() * sizes.length)]
  }

  const getRandomLifespan = () => {
    const lifespans = ['10-12 years', '12-15 years', '8-10 years', '13-16 years', '11-13 years']
    return lifespans[Math.floor(Math.random() * lifespans.length)]
  }

  const toggleBanList = (attribute, value) => {
    if (banList.includes(value)) {
      setBanList(banList.filter(item => item !== value))
    } else {
      setBanList([...banList, value])
    }
  }

  const isBanned = (value) => banList.includes(value)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🐕 Dog Picker</h1>
        <p>Discover your perfect dog companion!</p>
      </header>

      <main className="main-content">
        <button 
          className="discover-btn" 
          onClick={fetchRandomDog}
          disabled={loading}
        >
          {loading ? 'Finding Your Dog...' : 'Discover a Dog'}
        </button>

        {currentDog && (
          <div className="dog-card">
            <div className="dog-image-container">
              <img 
                src={currentDog.image} 
                alt={`${currentDog.breed} dog`}
                className="dog-image"
              />
            </div>
            
            <div className="dog-attributes">
              <div className="attribute">
                <span className="attribute-label">Breed:</span>
                <span 
                  className={`attribute-value clickable ${isBanned(currentDog.breed) ? 'banned' : ''}`}
                  onClick={() => toggleBanList('breed', currentDog.breed)}
                >
                  {currentDog.breed}
                </span>
              </div>
              
              <div className="attribute">
                <span className="attribute-label">Temperament:</span>
                <span 
                  className={`attribute-value clickable ${isBanned(currentDog.temperament) ? 'banned' : ''}`}
                  onClick={() => toggleBanList('temperament', currentDog.temperament)}
                >
                  {currentDog.temperament}
                </span>
              </div>
              
              <div className="attribute">
                <span className="attribute-label">Size:</span>
                <span 
                  className={`attribute-value clickable ${isBanned(currentDog.size) ? 'banned' : ''}`}
                  onClick={() => toggleBanList('size', currentDog.size)}
                >
                  {currentDog.size}
                </span>
              </div>
              
              <div className="attribute">
                <span className="attribute-label">Lifespan:</span>
                <span 
                  className={`attribute-value clickable ${isBanned(currentDog.lifespan) ? 'banned' : ''}`}
                  onClick={() => toggleBanList('lifespan', currentDog.lifespan)}
                >
                  {currentDog.lifespan}
                </span>
              </div>
            </div>
          </div>
        )}

        {banList.length > 0 && (
          <div className="ban-list">
            <h3>🚫 Banned Attributes</h3>
            <div className="ban-items">
              {banList.map((item, index) => (
                <span 
                  key={index}
                  className="ban-item"
                  onClick={() => toggleBanList('', item)}
                >
                  {item} ✕
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
