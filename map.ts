import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

var map = L.map("map").setView([60.22407579575061, 24.758567542678975], 30);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);