import ky from "ky";

type ConsultaCepProps = {
  cep: string;
};

type ConsultaCepResponse = {
  cep: string;
  logradouro: string;
  bairro: string;
  estado: string;
  localidade: string;
  complemento: string;
  uf: string;
};

export async function consultaCep({ cep }: ConsultaCepProps) {
  try {
    const addressProps = await ky
      .get(`https://viacep.com.br/ws/${cep}/json`)
      .json<ConsultaCepResponse>();

    if (!addressProps.cep) return null;

    return addressProps;
  } catch (error) {
    console.error(error);
    return null;
  }
}
