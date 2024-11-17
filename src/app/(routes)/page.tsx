"use client";

import AluggImage from "@/assets/Alugg.png";
import Particles from "@/components/ui/particles";
import Link from "next/link";
import FeaturesSectionDemo from "../../components/blocks/features-section-demo-2";
import { Cover } from "../../components/ui/cover";
import HeroVideoDialog from "../../components/ui/hero-video-dialog";
import { RainbowButton } from "../../components/ui/rainbow-button";
import { appRoutes } from "../../lib/constants";
import LandingHeader from "./components/header";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#000"
        refresh
      />

      <LandingHeader />

      <div className="mx-8">
        <div className="flex flex-col items-center ">
          <div className="w-[50%] flex flex-col items-center">
            <h1 className="text-5xl font-bold text-center mt-28 leading-snug">
              Simplifique a Gestão de Inventário e Aluguel com
              <br />
              <span className="text-orange-400 text-6xl">Alugg</span>
            </h1>

            <h2 className="text-slate-400 text-center mt-8 text-xl leading-snug">
              A plataforma tudo-em-um projetada para economizar tempo, reduzir
              erros e otimizar suas operações de aluguel.
            </h2>

            <RainbowButton className="mt-8 h-10">
              <Link href={appRoutes.signUp}>Comece agora</Link>
            </RainbowButton>

            <span className="text-slate-400 text-xs mt-4">
              7 dias grátis. Cadastre-se e começe a controlar seu estoque.
            </span>
          </div>

          <HeroVideoDialog
            className="my-8 size-10/12"
            thumbnailSrc={AluggImage.src}
            videoSrc={"https://www.youtube.com/watch?v=dKgbJOl-pTg"}
            animationStyle="left-in-right-out"
          />

          <FeaturesSectionDemo />

          <h1 className="my-56 font-bold text-6xl text-center">
            Gerencie seu estoque e itens com
            <Cover>eficiência e simplicidade!</Cover>
          </h1>

          <ReasonsComponent></ReasonsComponent>
        </div>
      </div>
      
      <hr />

      <div>
        
    
      </div>
    </div>
  );
}

function ReasonsComponent() {
  const reasons = [
    {
      title: "Aumente a Eficiência",
      description:
        "Gerencie inventário e aluguel com facilidade, liberando tempo para tarefas mais importantes.",
    },
    {
      title: "Reduza Custos",
      description:
        "Evite erros caros e itens perdidos com um rastreamento preciso e em tempo real.",
    },
    {
      title: "Escale com Facilidade",
      description:
        "Seja você uma pequena empresa ou uma grande corporação, o Alugg se adapta às suas necessidades.",
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <h2 className="  mb-16 text-xl font-bold">Por que escolher o Alugg?</h2>
      <div className="flex w-full justify-evenly mb-16">
        {reasons.map((reason) => {
          return (
            <div className="w-1/4 " key={reason.title}>
              <h2 className="font-bold mb-3">{reason.title}</h2>

              <span>{reason.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
