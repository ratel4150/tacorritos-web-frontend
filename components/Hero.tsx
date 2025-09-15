import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import Slider from "react-slick";

const colors = {
  vino: "#73171F",
  verde: "#5A7334",
  dorado: "#D98B2B",
  rojo: "#A62424",
  blanco: "#FFFFFF",
  negro: "#000000",
};

function Hero() {
  const slides = [
    { title: "¡Bienvenido a Tacorritos!", subtitle: "Donde cada taco es una experiencia inolvidable 🌮🔥", color: colors.rojo, img: "/tacosportada.png" },
    { title: "Prueba nuestros tacos especiales", subtitle: "Sabor auténtico y artesanal", color: colors.dorado, img: "/tacosespecial.png" },
    { title: "Disfruta de nuestras promociones", subtitle: "Cada día un taco diferente", color: colors.verde, img: "/tacosvarios.png" },
  ];

  const platillos = [
    { title: "Tacos de Bistek", desc: "Deliciosos y jugosos", price: "$50", img: "/tacosbistek.jpeg" },
    { title: "Tacos de Longaniza", desc: "Carne premium", price: "$55", img: "/tacoslonganiza.jpg" },
    { title: "Tacos de Chuleta", desc: "Sabor 100% vegetal", price: "$45", img: "/tacos de chuleta.jpg" },
    { title: "Tacos de Pechuga", desc: "Fundidas y crujientes", price: "$40", img: "/tacospechuga.jpeg" },
  ];

  const mainSliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    fade: true,
  };

  const platillosSliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: true,
    centerPadding: "0px",
    arrows: true,
  };

  return (
    <section id="hero">
      <Box sx={{ height: { xs: "100vh", md: "100vh" }, width: "100%", overflow: "hidden", position: "relative" }}>
        {/* Slider principal */}
        <Slider {...mainSliderSettings}>
          {slides.map((slide, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                px: { xs: 2, md: 9 },
                
                position: "relative",
                background: `linear-gradient(to bottom, ${slide.color} 75%, ${colors.blanco} 100%)`,
              }}
            >
              <Box sx={{ maxWidth: 600, textAlign: "center", color: colors.blanco }}>
                <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>
                  {slide.title}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4 }}>
                  {slide.subtitle}
                </Typography>

                <Box display="flex" gap={3} justifyContent="center" flexWrap="wrap" sx={{py:4}}>
                  <Link href="/login" passHref>
                    <Button
                      variant="contained"
                      sx={{
                        background: colors.blanco,
                        color: slide.color,
                        px: 4,
                        py: 1.2,
                        borderRadius: 3,
                        "&:hover": { opacity: 0.9 },
                      }}
                    >
                      Ordenar Ahora
                    </Button>
                  </Link>

                  <Link href="/menu" passHref>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: colors.blanco,
                        color: colors.blanco,
                        px: 4,
                        py: 1.2,
                        borderRadius: 3,
                        "&:hover": { background: colors.blanco, color: slide.color },
                      }}
                    >
                      Ver Menú
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>

        {/* Slider de platillos debajo del principal */}
        <Box sx={{ position: "relative", width: "100%", mt: 4, px: 10 }}>
          <Slider {...platillosSliderSettings}>
            {platillos.map((item, idx) => (
              <Box key={idx} sx={{ px: 2 }}>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
                    textAlign: "center",
                  }}
                >
                  <Box component="img" src={item.img} alt={item.title} sx={{ width: "100%", height: 150, objectFit: "cover" }} />
                  <Box sx={{ p: 2 }}>
                    <Typography fontWeight="bold">{item.title}</Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>{item.desc}</Typography>
                    <Typography fontWeight="bold">{item.price}</Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    </section>
  );
}

export default Hero;
