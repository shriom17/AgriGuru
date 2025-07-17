import React from 'react';
import './dash.css';
import Navbar from '../../components/Navbar/Navbar';
import WeatherWidget from '../../components/WeatherWidget/WeatherWidget';
import SoilWidget from '../../components/SoilWidget/SoilWidget';
import CropStatusWidget from '../../components/CropStatusWidget/CropStatusWidget';

const Dash = () => {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li><a href="#overview">Overview</a></li>
          <li><a href="#weather">Weather</a></li>
          <li><a href="#crops">Crops</a></li>
          <li><a href="#soil">Soil</a></li>

        </ul>
      </div>
      <div className="main-content">
        <div className="header">
          <h1>Welcome To Your Dashboard</h1>
        </div>
        <div className="widgets">
          <WeatherWidget />
          <SoilWidget />
          <CropStatusWidget />
        </div>
      </div>
    </div>
  );
};

export default Dash;