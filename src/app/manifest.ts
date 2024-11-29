import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "93DuCK",
    short_name: "DuCK",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#cccd39",
    icons: [
      {
        src: "/icon512_maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon512_rounded.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    orientation: "natural",
    lang: "ko-KR",
  };
}
