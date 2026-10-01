
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Buscar os departamentos
  useEffect(() => {
    async function fetchDepartments() {
      setLoading(true);

      const res = await fetch("http://localhost:3000/departments");
      const data = await res.json();

      setDepartments(data);
      setLoading(false);
    }

    fetchDepartments();
  }, []);

  // Cadastrar departamento
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const sigla = acronym.trim().toUpperCase();

    // Validação da sigla
    if (sigla.length < 2 || sigla.length > 5) {
      setError("A sigla deve ter entre 2 e 5 letras.");
      return;
    }

    const department = {
      name,
      acronym: sigla
    };

    try {
      setSending(true);

      const res = await fetch("http://localhost:3000/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(department)
      });

      const newDepartment = await res.json();

      // Adiciona o novo departamento na lista
      setDepartments((prev) => [...prev, newDepartment]);

      // Limpa os campos
      setName("");
      setAcronym("");
    } catch (error) {
      setError("Erro ao cadastrar departamento.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <h1>Cadastro de Departamentos</h1>

      <form onSubmit={handleSubmit}>
        <label>Nome do Departamento:</label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Sigla:</label>

        <input
          type="text"
          value={acronym}
          onChange={(e) => setAcronym(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Cadastrar"}
        </button>
      </form>

      <h2>Departamentos</h2>

      {loading && <p>Carregando departamentos...</p>}

      {!loading && (
        <ul>
          {departments.map((department) => (
            <li key={department.id}>
              {department.name} - {department.acronym}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
