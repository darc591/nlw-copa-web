import Image from "next/image";
import appCelulares from "../assets/appCelulares.png";
import logo from "../assets/logo.svg";
import avatares from "../assets/avatares.png";
import iconCheck from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import React, { FormEvent } from "react";

type HomeProps = {
  poolCount: number;
  guessCount: number;
  usersCount: number;
};

export default function Home({ poolCount, guessCount, usersCount }: HomeProps) {
  const [nome, setNome] = React.useState<string>();

  const handleCreatePool = React.useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      console.log(nome);
      if (nome !== undefined && nome !== "") {
        try {
          const response = await api.post("/pools", {
            title: nome,
          });
          await navigator.clipboard.writeText(response.data.code);
          alert(
            `Bolão criado com succeso, o codigo ${response.data.code} já foi copiado para a área de trasferência`
          );
          setNome("");
        } catch (error) {
          console.error(error);
        }
      }
    },
    [nome]
  );

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-2 items-center h-screen">
      <main>
        <div>
          <Image quality={100} src={logo} alt="logo" />
        </div>
        <div>
          <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
            Crie seu próprio bolão da copa e compartilhe entre amigos!
          </h1>
        </div>
        <div className="mt-10 flex items-center gap-0.5">
          <div>
            <Image quality={100} src={avatares} alt="avatares" />
          </div>
          <div>
            <span className="font-bold text-gray-200 text-xl">
              <span className="text-ignite-500">+{usersCount}</span> pessoas já
              estão usando
            </span>
          </div>
        </div>
        <form onSubmit={handleCreatePool} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            name="nome"
            value={nome}
            placeholder="Qual nome do seu bolão"
            onChange={(e) => setNome(e.target.value)}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm hover:bg-yellow-700"
            type="submit"
          >
            CRIAR MEU BOLÃO
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-4">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>
        <div className="border-t border-gray-500 opacity-5 mt-10 mb-10"></div>
        <div className="flex justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image quality={100} src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className="border-l border-gray-500 opacity-5" />
          <div className="flex items-center gap-6">
            <Image quality={100} src={iconCheck} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <div>
        <Image
          quality={100}
          src={appCelulares}
          alt="dois celulares preview app nlwcopa"
        />
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const [poolsCountResponse, guessCountResponse, usersCountResponse] =
    await Promise.all([
      api.get("/pools/count"),
      api.get("/guesses/count"),
      api.get("/users/count"),
    ]);
  return {
    props: {
      poolCount: poolsCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    },
  };
};
