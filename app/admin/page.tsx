"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

const ADMIN_PASSWORD = "A23012006";

export default function Admin() {
  // ✅ HOOKS SEMPRE NO TOPO
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ useEffect SEM CONDIÇÃO
  useEffect(() => {
    if (localStorage.getItem("is_admin") === "true") {
      setLogged(true);
      loadParticipants();
    }
  }, []);

  async function draw() {
  const confirmDraw = confirm("Deseja realizar o sorteio agora?");
  if (!confirmDraw) return;

  const supabase = getSupabaseClient({
    "x-admin": "true",
  });

  const { error } = await supabase.rpc("draw_secret_friend");

  if (error) {
    alert("Erro ao sortear: " + error.message);
    return;
  }

  alert("🎉 Sorteio realizado com sucesso!");
  loadParticipants();
}

  async function loadParticipants() {
    setLoading(true);

    const supabase = getSupabaseClient({
      "x-admin": "true",
    });

    const { data } = await supabase
      .from("participants")
      .select("id, name, assigned_name")
      .order("created_at", { ascending: true });

    setParticipants(data || []);
    setLoading(false);
  }

  function login() {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("is_admin", "true");
      setLogged(true);
      loadParticipants();
    } else {
      alert("Senha incorreta");
    }
  }

  // 🔐 LOGIN (return DEPOIS dos hooks)
  if (!logged) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-700 to-red-900">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-80 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            🎄 Admin
          </h1>

          <input
            type="password"
            placeholder="Senha do admin"
            className="w-full p-3 border rounded-lg text-gray-900 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
          >
            Entrar
          </button>
        </div>
      </main>
    );
  }

  // 👑 PAINEL ADMIN
  return (
  <main className="min-h-screen bg-red-700 p-8">
    <div className="max-w-2xl mx-auto bg-green-600 rounded-2xl shadow-2xl p-6 text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">
        👑 Painel Admin
      </h1>

      <button
        onClick={draw}
        className="w-full mb-6 bg-red-600 hover:bg-red-700 transition text-white py-3 rounded-xl font-bold text-lg shadow-lg"
      >
        🎁 Sortear Amigo Secreto
      </button>

      {loading && <p className="text-center">Carregando...</p>}

      <ul className="space-y-2">
        {participants.map((p) => (
          <li
            key={p.id}
            className="bg-green-700 rounded-lg p-3 flex justify-between"
          >
            <span>{p.name}</span>
            <span className="text-green-200">
              {p.assigned_name ?? "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </main>
);
}
