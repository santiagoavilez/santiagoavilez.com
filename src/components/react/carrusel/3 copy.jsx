// import { useState, useEffect } from "react";
// import axios from "axios";
// export default function useFetch(url) {
//     const [data, setData] = useState(null);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const { data } = await axios.get(url);
//                 setData(data);
//                 setLoading(false);
//             } catch (error) {
//                 setError(error);
//             }
//         };
//         fetchData();
//     }, [url]);
//     return { data, error, loading };
// }


