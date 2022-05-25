import axios from 'axios'
import { useState, useEffect } from 'react'

const api_key = process.env.REACT_APP_API_KEY

const Languages = ({languages}) => {
  const lang_array = []
  for (const lang in languages) lang_array.push(languages[lang])
  
  return (
    <>
      <p>Languages:</p>
      <ul>
        {lang_array.map(lang => <li key={lang}>{lang}</li>)}
      </ul>
    </>
  )
}

const Weather = ({capital, coords}) => {
  const [temp, setTemp] = useState('getting info...')
  const [icon, setIcon] = useState('')
  const [wind, setWind] = useState('getting info...')
  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${api_key}&units=metric`)
      .then(response => {
        setTemp(`${response.data.main.temp} °C`)
        setIcon(`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
        setWind(`${response.data.wind.speed} m/s`)
      })
  }, [])
  return (
    <>
      <h2>Weather in {capital}</h2>
      <p>Temperature: {temp}</p>
      <p>Wind: {wind}</p>
      <p><img src={icon} /></p>
    </>
  )
}

const Result = ({countries, search, setSearch}) => {
  
  if(search === "") return <p>Search a country</p>
  const names = countries
    .map(country => country.name.common)
    .filter(country => country.toLowerCase().includes(search.toLowerCase()))
    .sort()
  if(names.length > 10) 
    return <p>Too many results</p>
  if(names.length > 1) 
    return names.map(country => <p key={country}>{country}<button onClick={() => setSearch(country)}>Show</button></p>)
  if(names.length === 0) 
    return <p>Nothing found</p>
  
  const country = countries.filter(country => country.name.common === names[0])[0]

  return (
    <>
      <h1>{country.name.common} {country.flag}</h1>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population.toLocaleString()}</p>
      <Languages languages={country.languages} />
      <Weather capital={country.capital} coords={country.capitalInfo.latlng} />
    </>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState("")
  
  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {setCountries(response.data)})
  }, [])

  return (
    <>
      <input value={search} onChange={event => setSearch(event.target.value)} />
      <Result countries={countries} search={search} setSearch={setSearch} />
    </>
  )
}

export default App;
