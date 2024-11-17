import Link from "next/link";
import { Icons } from "../../../../components/icons";
import { Button } from "../../../../components/ui/button";
import { appRoutes } from "../../../../lib/constants";

export default function LandingHeader() {
  return (
    <div className="w-full h-14 mx-16  flex items-center justify-between fixed bg-white z-50">
      <div className="flex items-center">
        <Icons.layers className="size-8" size={8} />
        <h1 className="text-1xl ml-3 font-bold">Alugg</h1>
      </div>

      <div className="flex items-center w[50%] gap-4">
        <Button variant={"ghost"}>Funcionalidades</Button>
        <Button variant={"ghost"}>Solucoes</Button>
        <Button variant={"ghost"}>Blog</Button>
        <Button variant={"outline"}>Login</Button>

        <Button className="bg-orange-400 mr-24 h-10">
          <Link href={appRoutes.signUp}>Inicie Gratuitamente</Link>
        </Button>
      </div>
    </div>
  );
}
