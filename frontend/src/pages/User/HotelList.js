import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import '../../styles/HotelList.css';

export default function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState("");
  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("/user/hotels", { params: { page, limit, ...params } });
      const payload = res.data;
      setHotels(payload.data || []);
      setTotalPages(payload.pagination?.totalPages || 1);
    } catch (e) {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (city) params.city = city;
    if (name) params.name = name;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    setPage(1);
    fetchHotels({ ...params, page: 1, limit });
  };

  const goToPage = (newPage) => {
    const params = {};
    if (city) params.city = city;
    if (name) params.name = name;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    setPage(newPage);
    fetchHotels({ ...params, page: newPage, limit });
  };

  return (
    <div className="hotel-list-container">
      <h2>All Hotels</h2>
      <form  className="search-form"  onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
        <label style={{ marginLeft: 8 }}>Check-In:</label>
        <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} />
        <label style={{ marginLeft: 8 }}>Check-Out:</label>
        <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {hotels.map(h => (
        <div className="hotel-card"  key={h._id}>
          <Link to={`/hotel/${h._id}`}>{h.name} - {h.city}</Link>
        </div>
      ))}
      <div className="pagination" style={{ marginTop: 16 }}>
        <button disabled={page <= 1} onClick={() => goToPage(page - 1)}>Prev</button>
        <span style={{ margin: '0 8px' }}>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
