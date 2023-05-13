// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function App() {
//     const [data, seData] = useState([])
//     useEffect(() => {
//         axios.get("https://dummyjson.com/products")
//             .then((res) => {
//                 seData(res.data)
//             })
//     }, [])
//     return (
//         <div>
//             {data.map((item) => (
//                 <div key={item.id}>
//                     <h2>{item.title}</h2>
//                     <p>{item.description}</p>
//                 </div>
//             ))}
//         </div>
//     )
// }