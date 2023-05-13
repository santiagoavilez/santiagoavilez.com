// export default function App() {
//     const { data, error, loading } =
//         useFetch("https://jsonplaceholder.typicode.com/todos");
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

// const useFetch = (url) => {
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