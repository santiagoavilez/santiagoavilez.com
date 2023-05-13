// import React, { useState, useEffect } from "react";

// export default function App() {
//     const [data, seData] = useState([])
//     useEffect(() => {
//         fetch("https://dummyjson.com/products")
//             .then((response) => {
//                 return response.json()
//             })
//             .then((data) => {
//                 seData(data)
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