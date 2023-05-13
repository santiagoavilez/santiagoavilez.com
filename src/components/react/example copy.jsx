// import React from "react";
// import axios from "axios";
// import { useQuery } from "react-query";

// export default function App() {
//     const { data, error, loading } = useQuery(["todos"], async () => {
//         const { data } = await axios.get("https://jsonplaceholder.typicode.com/todos");
//         return data;
//     });

//     return (
//         <div>
//             {loading && <p>Loading...⌛⏳</p>}
//             {error && <p>something went wrong while fetching the data 😓</p>}
//             {data && data.map((item) => (
//                 <div key={item.id}>
//                     <h2>{item.title}</h2>
//                     <p>{item.completed ? "Completed" : "Not completed"}</p>
//                 </div>
//             ))}
//         </div>
//     );
// }

