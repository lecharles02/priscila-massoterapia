export const site = {
  name: "Priscila Massoterapia",
  city: "Campinas",
  region: "SP",
  phone: "(19) 99575-3027",
  phoneDigits: "5519995753027",
  googleProfileUrl: "https://share.google/ZHuLkwsNZdbjeC8qr",
  googleReviewUrl: "https://g.page/r/Ccr-6AM55Yo-EBM/review",
  neighborhoods: ["Cambuí", "Nova Campinas"],
  locationLabel: "Região do Cambuí e Nova Campinas, em Campinas",
  locationPrivacy:
    "Por segurança, o endereço é compartilhado somente pelo WhatsApp.",
  galleryNotice: "Rosto desfocado nas fotos para preservar minha privacidade e discrição.",
  hours: {
    weekday: "Segunda a sexta, das 9h30 às 19h",
    saturday: "Sábado, até as 15h",
  },
  media: {
    hero: "/images/hero-2.webp",
    heroMobile: "/images/hero-1.webp",
    finalCta: "/images/cta-1.webp",
    intro: "/images/intro-1.webp",
    about: "/images/about-1.webp",
  },
  whatsapp:
    "https://wa.me/5519995753027?text=" +
    encodeURIComponent(
      "Oi Priscila, gostaria de mais informações sobre o seu trabalho e os horários disponíveis.",
    ),
  gallery: [1, 2, 3, 4, 5, 6].map((number) => ({
    src: "/images/gallery-" + number + ".webp",
    label: "Priscila — retrato " + number,
  })),
};
export const directions = (address: string) =>
  "https://www.google.com/maps/dir/?api=1&destination=" +
  encodeURIComponent(address);
export const nav = [
  { href: "/", label: "Início" },
  { href: "/sobre-priscila/", label: "Sobre mim" },
  { href: "/especialidades/", label: "Massagens" },
  { href: "/depoimentos/", label: "Depoimentos" },
  { href: "/blog/", label: "Blog" },
  { href: "/contato/", label: "Contato" },
];
