"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import Slider from "react-slick";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import TacorritoAppBar from "@/components/TacorritoAppBar";
import Hero from "@/components/Hero";

const colors = {
  verde: "#597332",
  negro: "#262622",
  dorado: "#D98B2B",
  rojo: "#A62424",
  blanco: "#F2F2F2",
};

export default function LandingPage() {
  const router = useRouter();
  const [active, setActive] = useState("hero");
  const [stats, setStats] = useState({ tacos: 0, clientes: 0, anios: 0 });

  // ScrollSpy para navbar activo
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const handleScroll = () => {
      let current = "hero";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id") || "hero";
        }
      });
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animación de contadores
  useEffect(() => {
    const onScroll = () => {
      const statsSection = document.getElementById("stats");
      if (!statsSection) return;
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && stats.tacos === 0) {
        let t = 0,
          c = 0,
          a = 0;
        const interval = setInterval(() => {
          if (t < 10000) t += 250;
          if (c < 5000) c += 100;
          if (a < 15) a += 1;
          setStats({ tacos: t, clientes: c, anios: a });
          if (t >= 10000 && c >= 5000 && a >= 15) clearInterval(interval);
        }, 50);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [stats]);

  return (
    <Box sx={{ background: colors.blanco, color: colors.negro }}>
      {/* NAVBAR */}
      {/* <AppBar
        position="sticky"
        sx={{ background: "rgba(38,38,34,0.85)", backdropFilter: "blur(8px)", transition: "0.3s" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" fontWeight="bold" color={colors.dorado}>
            🌮 Tacorritos
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {[
              { id: "hero", label: "Inicio" },
              { id: "features", label: "Beneficios" },
              { id: "menu", label: "Menú" },
              { id: "testimonios", label: "Opiniones" },
              { id: "stats", label: "Logros" },
              { id: "mapa", label: "Ubicación" },
              { id: "contacto", label: "Contacto" },
            ].map((link) => (
              <Button
                key={link.id}
                sx={{
                  color: active === link.id ? colors.dorado : colors.blanco,
                  fontWeight: active === link.id ? "bold" : "normal",
                }}
                onClick={() =>
                  document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar> */}
      <TacorritoAppBar/>

      {/* HERO */}
{/* HERO */}

<Hero/>









      {/* FEATURES */}
      {/* FEATURES */}
<section id="features">
  <Container sx={{ py: 10 }}>
    <Typography variant="h4" align="center" fontWeight="bold" color={colors.verde}>
      ¿Por qué elegir Tacorritos?
    </Typography>
    
    <Typography 
      variant="subtitle1" 
      align="center" 
      mt={1} 
      mb={4}
      color="text.secondary"
      sx={{ maxWidth: 600, mx: "auto" }}
    >
      Miles ya disfrutan el auténtico sabor mexicano... ¿y tú, qué esperas?
    </Typography>

    <Grid container spacing={4}>
      {[{
          icon: <LocalDiningIcon sx={{ fontSize: 50, color: colors.dorado }} />,
          title: "Sabor Auténtico",
          desc: "Recetas originales mexicanas, transmitidas de generación en generación. Cada taco cuenta una historia.",
        },
        {
          icon: <PhoneIphoneIcon sx={{ fontSize: 50, color: colors.rojo }} />,
          title: "Ordena Sin Complicaciones",
          desc: "Desde tu celular o computadora en segundos. Sin filas, sin esperas, sin estrés.",
        },
        {
          icon: <DeliveryDiningIcon sx={{ fontSize: 50, color: colors.verde }} />,
          title: "Tacos Calientitos en Minutos",
          desc: "Tu pedido llega rápido, caliente y listo para disfrutar. ¡Tal como debe ser!",
        }].map((f, i) => (
        <Grid item xs={12} md={4} key={i}>
          <motion.div 
            whileInView={{ opacity: [0, 1], y: [50, 0] }} 
            transition={{ delay: i * 0.3 }}
          >
            <Card 
              sx={{ 
                textAlign: "center", 
                p: 4, 
                borderRadius: 4, 
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                '&:hover': {
                  transform: 'scale(1.03)',
                  transition: '0.3s',
                }
              }}
            >
              {f.icon}
              <Typography variant="h6" mt={2} fontWeight="bold">
                {f.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {f.desc}
              </Typography>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>

    {/* CTA final */}
    <Box mt={6} textAlign="center">
      <Typography variant="h6" fontWeight="medium" color={colors.dorado}>
        🍽️ ¡Haz tu primer pedido hoy y descubre tu nuevo taco favorito!
      </Typography>
    </Box>
  </Container>
</section>


      {/* MENÚ */}
      <section id="menu">
        <Container sx={{ py: 10, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" color={colors.rojo}>
            Nuestro Menú Estrella
          </Typography>
          <Swiper
            effect={"coverflow"}
            grabCursor
            centeredSlides
            slidesPerView={"auto"}
            coverflowEffect={{ rotate: 30, stretch: 0, depth: 100, modifier: 1, slideShadows: true }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            style={{ marginTop: "2rem" }}
          >
            {["Tacos al Pastor", "Tacos de Asada", "Tacos Veganos", "Quesadillas"].map((item, i) => (
              <SwiperSlide key={i} style={{ width: "300px" }}>
                <Card sx={{ borderRadius: 4, p: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{item}</Typography>
                    <Typography variant="body2">Deliciosos y servidos con amor 💚</Typography>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios">
        <Container sx={{ py: 10 }}>
          <Typography variant="h4" align="center" fontWeight="bold" color={colors.dorado}>
            Opiniones de Nuestros Clientes
          </Typography>
          <Swiper slidesPerView={1} spaceBetween={20} autoplay={{ delay: 4000 }} pagination={{ clickable: true }} modules={[Pagination, Autoplay]} style={{ marginTop: "2rem" }}>
            {["Ana", "Luis", "Marta"].map((nombre, i) => (
              <SwiperSlide key={i}>
                <Card sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
                  <Typography variant="body1">
                    “Los tacos de {nombre} son un manjar, Tacorritos es mi lugar favorito.”
                  </Typography>
                  <Typography variant="subtitle2" mt={2} color={colors.verde}>
                    — {nombre}
                  </Typography>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>

      {/* LOGROS */}
      <section id="stats">
        <Box sx={{ py: 10, background: colors.verde, color: colors.blanco, textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold">Nuestros Logros</Typography>
          <Grid container spacing={4} mt={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Typography variant="h3" fontWeight="bold">{stats.tacos}+</Typography>
              <Typography variant="body1">Tacos vendidos</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" fontWeight="bold">{stats.clientes}+</Typography>
              <Typography variant="body1">Clientes felices</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h3" fontWeight="bold">{stats.anios}</Typography>
              <Typography variant="body1">Años de experiencia</Typography>
            </Grid>
          </Grid>
        </Box>
      </section>

      {/* MAPA INTERACTIVO */}
      <section id="mapa">
        <Box sx={{ py: 10, background: "#f8f8f8", textAlign: "center" }}>
          <Typography variant="h4" fontWeight="bold" color={colors.rojo} mb={4}>
            Encuéntranos
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4 }}>
            <Box sx={{ width: { xs: "100%", md: "60%" }, height: "400px", borderRadius: 4, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3758.146034613897!2d-99.1947229253381!3d19.540537881727976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d21f9d69c15555%3A0xcb5c59cdc8e6d31!2sCalle%20Trueno%205%2C%20Tabla%20Honda%2C%2054125%20Tlalnepantla%20de%20Baz%2C%20M%C3%A9x.!5e0!3m2!1ses!2smx!4v1726189999999!5m2!1ses!2smx"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />
</Box>
            <Box sx={{ maxWidth: 400, textAlign: "left" }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>🌮 Tacorritos</Typography>
              <Typography variant="body1">Dirección: Centro Histórico, CDMX</Typography>
              <Typography variant="body1">📞 555-123-4567</Typography>
              <Typography variant="body1">📧 contacto@tacorritos.com</Typography>
              <Box mt={2} display="flex" gap={2}>
                <IconButton color="inherit"><FacebookIcon /></IconButton>
                <IconButton color="inherit"><InstagramIcon /></IconButton>
                <IconButton color="inherit"><TwitterIcon /></IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </section>

      {/* CONTACTO */}
      <section id="contacto">
        <Box sx={{ py: 6, px: 4, backgroundColor: colors.negro, color: colors.blanco, textAlign: "center" }}>
          <Typography variant="h6">Contáctanos</Typography>
          <Typography variant="body2" mt={2}>📞 555-123-4567</Typography>
          <Typography variant="body2">📧 contacto@tacorritos.com</Typography>
        </Box>
        <Box sx={{ py: 2, textAlign: "center", background: "#111" }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Tacorritos | Todos los derechos reservados
          </Typography>
        </Box>
      </section>
    </Box>
  );
}
