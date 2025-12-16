"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";

type Participant = {
  id: number;
  name: string;
  assigned_name: string | null;
};

export default function AdminPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function loadParticipants() {
    setLoading(true);
    setErrorMsg(null);

    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("participants")
      .select("id, name, assigned_name")
      .order("id", { ascending: true });

    console.log("ADMIN DATA:", data);
    console.log("ADMIN ERROR:", error);

    if (error) {
      setErrorMsg("Erro ao carregar participantes");
    } else {
      setParticipants(data || []);
    }

    setLoading(false);
  }

  async function draw() {
    const supabase = getSupabaseClient();

    const { error } = await supabase.rpc("draw_secret_friend");

    if (error) {
      alert("Erro ao sortear");
      console.error(error);
      return;
    }

    await loadParticipants();
    alert("🎁 Sorteio realizado com sucesso!");
  }

  useEffect(() => {
    loadParticipants();
  }, []);

  return (
    <main className="min-h-screen bg-red-900 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-green-100 rounded-2xl shadow-xl p-6 text-black">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🎄 Painel Admin — Amigo Secreto
        </h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={draw}
            className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold"
          >
            🎁 Sortear
          </button>

          <button
            onClick={loadParticipants}
            className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg font-semibold"
          >
            🔄 Atualizar
          </button>
        </div>

        {loading && <p className="text-center">Carregando...</p>}

        {errorMsg && (
          <p className="text-center text-red-600 font-semibold">
            {errorMsg}
          </p>
        )}

        {!loading && participants.length === 0 && (
          <p className="text-center">Nenhum participante ainda</p>
        )}

        <ul className="space-y-2">
          {participants.map((p) => (
            <li
              key={p.id}
              className="bg-white p-3 rounded-lg flex justify-between items-center"
            >
              <span className="font-semibold">{p.name}</span>
              <span className="text-gray-600">
                {p.assigned_name ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
