import ky from "ky";

export const api = ky.create({
  prefixUrl:
    process.env.NODE_ENV === "production"
      ? "https://alugg.vercel.app"
      : "http://localhost:3000",
});
