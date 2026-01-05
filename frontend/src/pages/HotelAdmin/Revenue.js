import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

export default function Revenue() {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    axios.get("/hoteladmin/revenue").then(res => setRevenue(res.data.totalRevenue));
  }, []);

  return (
    <div>
      <h2>Total Revenue</h2>
      <p>${revenue}</p>
    </div>
  );
}
