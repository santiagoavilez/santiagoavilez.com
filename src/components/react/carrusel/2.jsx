// import React, { useState, useEffect } from "react";
// import axios from "axios";

// export default function App() {
//     const [data, seData] = useState([])
//     useEffect(() => {
//         async () => {
//             try {
//                 const res = await axios.get("https://jsonplaceholder.typicode.com/todos");
//                 seData(res.data)
//             }
//             catch {
//                 console.log("error")
//             }
//         }
//     }, [])
//     return (
//         <div>
//             {data.map((item) => (
//                 <div key={item.id}>
//                     <h2>{item.title}</h2>
//                     <p>{item.completed ? "Completed" : "Not completed"}</p>
//                 </div>
//             ))}
//         </div>
//     )
// }