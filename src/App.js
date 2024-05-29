import React from "react";
import Weather from "./Weather";
import Input from "./Input";

class App extends React.Component {
  state = {
    location: "",
    isLoading: false,
    displayLocation: "",
    weather: {},
  };

  setLocation = (location) => {
    this.setState({ location });
  };

  componentDidMount() {
    this.setState({ location: localStorage.getItem("location" || "") });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.location !== prevState.location) {
      this.getWeather();

      localStorage.setItem("location", this.state.location);
    }
  }

  getWeather = async () => {
    if (this.state.location.length < 2) return;

    try {
      this.setState({ isLoading: true });

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if (!geoData.results) throw new Error("Location not found");

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);

      this.setState({
        displayLocation: `${name} ${this.convertToFlag(country_code)}`,
      });

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      this.setState({ weather: weatherData.daily });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  convertToFlag = (countryCode) => {
    let codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  handleUpdateLocation = (location) => {
    this.setState({ location });
  };

  render() {
    return (
      <div className="app">
        <h1>Classy Weather</h1>
        <Input
          location={this.state.location}
          updateLocation={this.handleUpdateLocation}
        />
        {this.state.isLoading ? (
          <p className="loader">Loading...</p>
        ) : !!this.state.weather.weathercode ? (
          <Weather
            weather={this.state.weather}
            location={this.state.displayLocation}
          />
        ) : (
          <></>
        )}
      </div>
    );
  }
}
export default App;
