import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
} from "@mui/material";
import { CiMenuFries } from "react-icons/ci";
import { FaShoppingCart, FaMoon, FaSun } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { motion } from "framer-motion";

const colors = {
  vino: "#73171F",
  verde: "#5A7334",
  dorado: "#D98B2B",
  rojo: "#A62424",
  blanco: "#FFFFFF",
};

export default function ElegantAppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const links = [
    { id: "hero", label: "Inicio" },
    { id: "features", label: "Beneficios" },
    { id: "menu", label: "Menú" },
    { id: "testimonios", label: "Opiniones" },
    { id: "stats", label: "Logros" },
    { id: "mapa", label: "Ubicación" },
    { id: "contacto", label: "Contacto" },
  ];

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setDrawerOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
  <AppBar
  position="sticky"
  elevation={scrollY > 0 ? 4 : 0}
  sx={{
    background: scrollY > 50 ? colors.vino : colors.blanco,
    color: scrollY > 50 ? colors.blanco : colors.vino,
    backdropFilter: "blur(12px)",
    transition: "all 0.3s ease",
    px: { xs: 1, md: 10 },
    py: { xs: 1, md: 1.5 },
  }}
>
  <Toolbar
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: 1.5,
    }}
  >
    {/* ================= Fila Superior ================= */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 1,
      }}
    >
      {/* Logo compacto */}
      <Box
        component={motion.div}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 280, damping: 20 }}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          px: 1,
          py: 0.25,
          borderRadius: 2,
          backdropFilter: "blur(6px)",
        }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <motion.img
          src={scrollY > 50 ? "/parrot (4).png" : "/parrot (3).png"}
          alt="Tacorritos Logo"
          style={{
            width: scrollY > 50 ? 32 : 40,
            height: scrollY > 50 ? 32 : 40,
            transition: "all 0.4s ease-in-out",
          }}
        />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: "1.2rem",
            letterSpacing: 1,
            background: scrollY > 50
              ? `linear-gradient(90deg, ${colors.dorado}, ${colors.verde})`
              : `linear-gradient(90deg, ${colors.rojo}, ${colors.dorado})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Tacorritos
        </Typography>
      </Box>

      {/* Barra de búsqueda compacta */}
      <Box
        component="form"
        sx={{
          flex: 1,
          maxWidth: 300,
          display: "flex",
          gap: 0.5,
          bgcolor: scrollY > 50 ? "rgba(255,255,255,0.15)" : "rgba(217,217,217,0.15)",
          borderRadius: 2,
          px: 1,
          py: 0.25,
          alignItems: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <input
          type="text"
          placeholder="Buscar..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            color: scrollY > 50 ? colors.blanco : colors.vino,
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: colors.dorado,
            color: colors.blanco,
            fontWeight: 500,
            minWidth: 60,
            fontSize: "0.75rem",
            textTransform: "none",
            "&:hover": { bgcolor: colors.verde },
          }}
        >
          Buscar
        </Button>
      </Box>

      {/* Banner compacto */}
      <Box
        sx={{
          ml: 1,
          px: 2,
          py: 0.5,
          borderRadius: 2,
          bgcolor: scrollY > 50 ? colors.verde : colors.rojo,
          color: colors.blanco,
          fontWeight: 500,
          fontSize: "0.8rem",
          textAlign: "center",
          minWidth: 140,
        }}
      >
        🌮 Promo: 2 Tacos + Bebida $99
      </Box>
    </Box>

    {/* ================= Fila Inferior ================= */}
    <Box
      sx={{
        mt: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {/* Links desktop */}
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
        {links.map((link) => (
          <Button
            key={link.id}
            onClick={() => handleScrollTo(link.id)}
            sx={{
              color: scrollY > 50 ? colors.blanco : colors.rojo,
              fontWeight: 500,
              borderRadius: 1,
              textTransform: "none",
              fontSize: "0.85rem",
              transition: "0.3s",
              "&:hover": {
                color: colors.dorado,
                backgroundColor: "rgba(217,139,43,0.08)",
              },
            }}
          >
            {link.label}
          </Button>
        ))}
      </Box>

      {/* Actions desktop */}
      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
        <IconButton sx={{ color: scrollY > 50 ? colors.blanco : colors.rojo }}>
          <FaShoppingCart />
        </IconButton>
        <Button
          variant="outlined"
          startIcon={<FiLogIn />}
          sx={{
            color: scrollY > 50 ? colors.blanco : colors.vino,
            borderColor: scrollY > 50 ? colors.blanco : colors.vino,
            textTransform: "none",
            fontSize: "0.8rem",
            "&:hover": { borderColor: colors.dorado, color: colors.dorado },
          }}
        >
          Iniciar sesión
        </Button>
        <IconButton onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? (
            <FaMoon color={scrollY > 50 ? colors.blanco : colors.vino} />
          ) : (
            <FaSun color={scrollY > 50 ? colors.blanco : colors.vino} />
          )}
        </IconButton>
      </Box>
    </Box>
  </Toolbar>
</AppBar>



  );
}
