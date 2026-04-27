import { useState,useEffect } from "react";

function App() {
  const[clases,setClases] = useState([]);
  const[loading,setLoading]=useState(true);

  useEffect(() =>{
    fetch("http://localhost:3000/api/claseteorica")
    .then(response=>response.json())
    .then(data=>{
      setClases(data);
      setLoading(false);
    })
  }, []);

  return (
    <div>
      <h1>Clases Teóricas</h1>
      {loading && <p>Cargando clases...</p>}
      {!loading && clases.length === 0 && <p>No hay Clases Disponibles</p>}
      {!loading && clases.length>0&&(
        <ul>
          {clases.map((clase)=>(
            <li key={clase.id_clase}>
              <strong>{clase.titulo_clase}</strong>-{clase.fecha_hora}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
