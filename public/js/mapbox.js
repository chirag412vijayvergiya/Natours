/* eslint-disable */
import L from 'leaflet';

export const displayMap = (locations) => {
  //   const map = L.map('map').setView([-80.185942, 25.774772], 13);
  //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     attribution:
  //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   }).addTo(map);
  //   const markerArray = [];
  //   locations.forEach((loc) => {
  //     const reversedArr = [...loc.coordinates].reverse();
  //     const myIcon = L.icon({
  //       iconUrl: './../img/pin.png',
  //       iconSize: [30, 35],
  //       iconAnchor: [15, 35],
  //     });
  //     L.marker(reversedArr, { icon: myIcon }).addTo(map);
  //     markerArray.push(reversedArr);
  //   });
  //   const bounds = L.latLngBounds(markerArray);
  //   map.fitBounds(bounds);

  const map = L.map('map');
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    gestureHandling: true,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  //const bounds = new L.LatLngBounds();

  map.attributionControl.setPosition('bottomleft');
  map.scrollWheelZoom.enable();

  const markers = [];
  locations.forEach((location) => {
    const [lat, lng] = location.coordinates;
    const point = [lng, lat];
    console.log(point, [lat, lng]);
    markers.push(point);
    L.marker(point, {
      icon: L.icon({ iconUrl: '/img/pin.png', iconSize: [20, 24] }),
    })
      .bindPopup(`<h1>Day ${location.day}: ${location.description}</h1>`, {
        autoClose: false,
      })
      .openPopup()
      .addTo(map);
  });
  // Fit the map to the bounds with some padding
  if (markers.length > 0) {
    const bounds = L.latLngBounds(markers);
    map.fitBounds(bounds, {
      paddingTopLeft: [100, 200],
      paddingBottomRight: [100, 150],
    });
  }

  //   const map = L.map('map', { zoomControl: false, zoom: 5 });
  //   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //     gestureHandling: true,
  //     attribution:
  //       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //   }).addTo(map);
  //   map.attributionControl.setPosition('bottomleft');
  //   map.scrollWheelZoom.disable();
  //   const markers = [];
  //   locations.forEach((location) => {
  //     const [lat, lng] = location.coordinates;
  //     const point = [lng, lat];
  //     markers.push(point);
  //     L.marker(point, {
  //       icon: L.icon({ iconUrl: '/img/pin.png', iconSize: [20, 24] }),
  //     })
  //       .bindPopup(`<h1>Day ${location.day}: ${location.description}</h1>`, {
  //         autoClose: false,
  //       })
  //       .openPopup()
  //       .addTo(map);
  //   });
  //   map.fitBounds(L.latLngBounds(markers).pad(0.4));
};
