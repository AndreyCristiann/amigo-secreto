"use client";

import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { getDeviceId } from "@/lib/device";

/* ❄️ COMPONENTE DE NEVE */
function Snow() {
  return (
    <div className="snow">
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          style={{
            left: Math.random() * 100 + "%",
            animationDuration: 5 + Math.random() * 5 + "s",
            fontSize: 12 + Math.random() * 12 + "px",
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [assigned, setAssigned] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const supabase = getSupabaseClient();
      const deviceId = getDeviceId();

      const { data } = await supabase
        .from("participants")
        .select("assigned_name")
        .eq("device_id", deviceId)
        .single();

      if (data) {
        setSaved(true);
        setAssigned(data.assigned_name);
      }
    }

    check();
  }, []);

  async function save() {
    if (!name.trim()) return;

    const supabase = getSupabaseClient();
    const deviceId = getDeviceId();

    await supabase.from("participants").insert({
      name,
      device_id: deviceId,
    });

    setSaved(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#7A0C0C]">
      <Snow />

      <div className="bg-green-600 rounded-2xl p-8">


        {!saved ? (
          <>
            <h1 className="text-2xl font-bold mb-4">🎄 Amigo Secreto 🎁</h1>


            <input
  className="w-full p-3 border rounded-lg 
             text-black placeholder-gray-500 
             mb-4"
  placeholder="Digite seu nome"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>


            <button
  onClick={save}
  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
>
  Participar
</button>

          </>
        ) : assigned ? (
          <>
            <h1 className="text-xl font-bold mb-2 text-black">
  🎁 Seu amigo secreto é:
</h1>

<p className="text-3xl font-extrabold text-black">
  {assigned}
</p>

          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-white drop-shadow-md mb-2">
  ⏳ Ainda não sorteado
</h1>

<p className="text-green-100 text-base">
  ❄ Volte depois 😉
</p>

          </>
          
        )}
      </div>
    </main>
  );
}
