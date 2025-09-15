"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Container,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Chip,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Stack,
  Tooltip,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from '@mui/material/GridLegacy'

/** -----------------------------
 * Tipos
 * ---------------------------- */
type DietTag = "vegano" | "vegetariano" | "sin gluten" | "picante";
type CategoryKey = "Tacos" | "Bebidas" | "Postres" | "Combos";

interface ModifierOption {
  id: string;
  label: string;
  priceDelta: number;
}

interface ModifierGroup {
  id: string;
  label: string;
  type: "single" | "multi";
  required?: boolean;
  options: ModifierOption[];
  max?: number; // para multi
}

interface MenuItemType {
  id: number | string;
  name: string;
  description: string;
  price: number;
  image: string;
  tags?: DietTag[];
  category: CategoryKey;
  modifiers?: ModifierGroup[];
}

interface CartLine {
  uid: string; // único por combinaciones
  itemId: MenuItemType["id"];
  name: string;
  basePrice: number;
  quantity: number;
  modifiers?: { groupId: string; optionIds: string[] }[];
  note?: string;
  computedPrice: number; // base + modificadores
  image?: string;
}

/** -----------------------------
 * Datos mock (puedes reemplazar por GraphQL)
 * ---------------------------- */
const CATALOG: MenuItemType[] = [
  {
    id: 1,
    name: "Taco al Pastor",
    description: "Clásico con piña, carne al pastor y cilantro.",
    price: 25,
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=1200",
    tags: ["picante"],
    category: "Tacos",
    modifiers: [
      {
        id: "size",
        label: "Tamaño",
        type: "single",
        required: true,
        options: [
          { id: "s", label: "Sencillo", priceDelta: 0 },
          { id: "d", label: "Doble carne", priceDelta: 12 },
        ],
      },
      {
        id: "extras",
        label: "Extras",
        type: "multi",
        max: 2,
        options: [
          { id: "queso", label: "Queso", priceDelta: 6 },
          { id: "aguacate", label: "Aguacate", priceDelta: 8 },
          { id: "piquins", label: "Chile piquín", priceDelta: 3 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Taco de Asada",
    description: "Carne asada jugosa con guacamole y cebolla.",
    price: 30,
    image: "https://images.unsplash.com/photo-1615297928060-c0d6e9e4a077?w=1200",
    tags: [],
    category: "Tacos",
  },
  {
    id: 3,
    name: "Taco Vegano",
    description: "Setas al ajillo, aguacate y salsa verde.",
    price: 28,
    image: "https://images.unsplash.com/photo-1625941362032-6efda0193f4d?w=1200",
    tags: ["vegano", "sin gluten"],
    category: "Tacos",
  },
  {
    id: 4,
    name: "Agua de Horchata",
    description: "Dulce, fresca y con canela.",
    price: 20,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1200",
    tags: [],
    category: "Bebidas",
  },
  {
    id: 5,
    name: "Agua de Jamaica",
    description: "Refrescante y natural.",
    price: 18,
    image: "https://images.unsplash.com/photo-1606788075761-1a4a1d1b1e3a?w=1200",
    tags: [],
    category: "Bebidas",
  },
  {
    id: 6,
    name: "Flan Napolitano",
    description: "Suave y cremoso con caramelo.",
    price: 40,
    image: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=1200",
    tags: ["sin gluten", "vegetariano"],
    category: "Postres",
  },
  {
    id: "combo1",
    name: "Combo Pastor + Bebida",
    description: "2 Tacos al Pastor + Agua de sabor.",
    price: 65,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1200",
    tags: [],
    category: "Combos",
  },
];

const CATEGORY_LIST: CategoryKey[] = ["Tacos", "Bebidas", "Postres", "Combos"];
const DIET_TAGS: DietTag[] = ["vegano", "vegetariano", "sin gluten", "picante"];

/** -----------------------------
 * Utils
 * ---------------------------- */
const peso = (n: number) => `$${n.toFixed(2)} MXN`;
const uid = () => Math.random().toString(36).slice(2);

/** -----------------------------
 * Página
 * ---------------------------- */
export default function MenuPage() {
  // Tema
  const [dark, setDark] = useState(false);
  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: dark ? "dark" : "light", primary: { main: "#8B0000" } },
        shape: { borderRadius: 16 },
      }),
    [dark]
  );

  // UI
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Filtros / búsqueda / orden
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("Tacos");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 80]);
  const [selectedTags, setSelectedTags] = useState<DietTag[]>([]);
  const [sort, setSort] = useState<"relevance" | "priceAsc" | "priceDesc">("relevance");

  // Carrito
  const [cart, setCart] = useState<CartLine[]>([]);

  // Persistir carrito
  useEffect(() => {
    const s = localStorage.getItem("cart");
    if (s) setCart(JSON.parse(s));
  }, []);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Productos filtrados
  const filtered = useMemo(() => {
    let items = CATALOG.filter((i) => i.category === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    if (selectedTags.length) {
      items = items.filter((i) =>
        (i.tags || []).some((t) => selectedTags.includes(t))
      );
    }
    items = items.filter((i) => i.price >= priceRange[0] && i.price <= priceRange[1]);
    if (sort === "priceAsc") items = items.slice().sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") items = items.slice().sort((a, b) => b.price - a.price);
    return items;
  }, [selectedCategory, search, selectedTags, priceRange, sort]);

  /** -------------- Carrito ops -------------- */
  const addLine = (line: Omit<CartLine, "uid" | "computedPrice">) => {
    // calcular precio por modificadores
    const modsPrice =
      line.modifiers?.reduce((acc, m) => {
        const item = CATALOG.find((it) => it.id === line.itemId);
        const group = item?.modifiers?.find((g) => g.id === m.groupId);
        const options = group?.options.filter((o) => m.optionIds.includes(o.id)) || [];
        return acc + options.reduce((s, o) => s + o.priceDelta, 0);
      }, 0) ?? 0;

    const computedPrice = line.basePrice + modsPrice;

    // combinar líneas iguales (mismo itemId + mismas opciones)
    const key = JSON.stringify({ itemId: line.itemId, mods: line.modifiers ?? [] });
    const existingIndex = cart.findIndex(
      (x) => JSON.stringify({ itemId: x.itemId, mods: x.modifiers ?? [] }) === key
    );

    if (existingIndex >= 0) {
      const updated = [...cart];
      updated[existingIndex].quantity += line.quantity;
      setCart(updated);
    } else {
      setCart((prev) => [
        ...prev,
        {
          ...line,
          uid: uid(),
          computedPrice,
        },
      ]);
    }
  };

  const inc = (uidLine: string) =>
    setCart((prev) =>
      prev.map((l) => (l.uid === uidLine ? { ...l, quantity: l.quantity + 1 } : l))
    );
  const dec = (uidLine: string) =>
    setCart((prev) =>
      prev
        .map((l) => (l.uid === uidLine ? { ...l, quantity: Math.max(1, l.quantity - 1) } : l))
        .filter((l) => l.quantity > 0)
    );
  const removeLine = (uidLine: string) =>
    setCart((prev) => prev.filter((l) => l.uid !== uidLine));

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((s, l) => s + l.computedPrice * l.quantity, 0);
  const tax = Math.round(subtotal * 0.16 * 100) / 100;
  const total = subtotal + tax;

  /** -------------- Dialog Detalles -------------- */
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState<MenuItemType | null>(null);
  const [detailsQty, setDetailsQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});

  const openDetails = (item: MenuItemType) => {
    setDetailsItem(item);
    // defaults de grupos required single
    const defaults: Record<string, string[]> = {};
    item.modifiers?.forEach((g) => {
      if (g.type === "single" && g.required && g.options.length > 0) {
        defaults[g.id] = [g.options[0].id];
      }
    });
    setSelectedOptions(defaults);
    setDetailsQty(1);
    setDetailsOpen(true);
  };

  const toggleOption = (group: ModifierGroup, optionId: string) => {
    setSelectedOptions((prev) => {
      const curr = prev[group.id] || [];
      if (group.type === "single") return { ...prev, [group.id]: [optionId] };
      // multi
      const exists = curr.includes(optionId);
      let next = exists ? curr.filter((x) => x !== optionId) : [...curr, optionId];
      if (group.max && next.length > group.max) next = next.slice(0, group.max);
      return { ...prev, [group.id]: next };
    });
  };

  const addFromDialog = () => {
    if (!detailsItem) return;
    const mods =
      detailsItem.modifiers?.map((g) => ({
        groupId: g.id,
        optionIds: selectedOptions[g.id] || [],
      })) || [];
    addLine({
      itemId: detailsItem.id,
      name: detailsItem.name,
      basePrice: detailsItem.price,
      quantity: detailsQty,
      modifiers: mods,
      image: detailsItem.image,
    });
    setDetailsOpen(false);
    setCartOpen(true);
  };

  // precio previo (preview) dentro del diálogo
  const previewPrice = useMemo(() => {
    if (!detailsItem) return 0;
    const mods =
      detailsItem.modifiers?.reduce((acc, g) => {
        const sel = selectedOptions[g.id] || [];
        const sum = g.options
          .filter((o) => sel.includes(o.id))
          .reduce((s, o) => s + o.priceDelta, 0);
        return acc + sum;
      }, 0) || 0;
    return (detailsItem.price + mods) * detailsQty;
  }, [detailsItem, selectedOptions, detailsQty]);

  return (
    <ProtectedRoute>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          {/* AppBar */}
          <AppBar position="sticky">
            <Toolbar sx={{ gap: 1 }}>
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 0 }}>
                🌮 Tacorritos
              </Typography>

              {/* Search */}
              <TextField
                size="small"
                placeholder="Buscar tacos, bebidas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ ml: 2, flex: 1, maxWidth: 520 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Dark mode */}
              <Tooltip title={dark ? "Modo claro" : "Modo oscuro"}>
                <IconButton color="inherit" onClick={() => setDark((d) => !d)}>
                  {dark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              {/* Carrito */}
              <Tooltip title="Ver carrito">
                <IconButton color="inherit" onClick={() => setCartOpen(true)}>
                  <Badge badgeContent={cart.reduce((n, l) => n + l.quantity, 0)} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Logout (placeholder) */}
              <Tooltip title="Cerrar sesión">
                <IconButton color="inherit" onClick={() => (window.location.href = "/login")}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>

          {/* Drawer categorías */}
          <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Box sx={{ width: 280 }}>
              <Typography variant="h6" sx={{ p: 2 }}>
                Categorías
              </Typography>
              <Divider />
              <List>
                {CATEGORY_LIST.map((cat) => (
                  <ListItemButton
                    key={cat}
                    selected={selectedCategory === cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary={cat} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>

          {/* Drawer carrito */}
          <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
            <Box sx={{ width: { xs: 340, sm: 420 }, p: 2 }}>
              <Typography variant="h6">Tu pedido</Typography>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                {cart.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Tu carrito está vacío.
                  </Typography>
                )}
                {cart.map((l) => (
                  <Box
                    key={l.uid}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "72px 1fr auto",
                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
                    {l.image && (
                      <CardMedia
                        component="img"
                        image={l.image}
                        alt={l.name}
                        sx={{ width: 72, height: 72, borderRadius: 1 }}
                      />
                    )}
                    <Box>
                      <Typography fontWeight={600}>{l.name}</Typography>
                      {l.modifiers?.length ? (
                        <Typography variant="caption" color="text.secondary">
                          {l.modifiers
                            ?.map((m) => m.optionIds.join(", "))
                            .join(" · ")}
                        </Typography>
                      ) : null}
                      <Typography variant="body2">{peso(l.computedPrice)}</Typography>
                    </Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <IconButton size="small" onClick={() => dec(l.uid)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography>{l.quantity}</Typography>
                      <IconButton size="small" onClick={() => inc(l.uid)}>
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Box gridColumn="1 / -1" display="flex" justifyContent="flex-end">
                      <Button size="small" color="error" onClick={() => removeLine(l.uid)}>
                        Quitar
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />
              <Stack spacing={0.5}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>{peso(subtotal)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">IVA (16%)</Typography>
                  <Typography>{peso(tax)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography fontWeight={700}>Total</Typography>
                  <Typography fontWeight={700}>{peso(total)}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} mt={2}>
                <Button variant="outlined" color="inherit" onClick={clearCart} fullWidth>
                  Vaciar
                </Button>
                <Button variant="contained" color="primary" fullWidth disabled={!cart.length}>
                  Pagar
                </Button>
              </Stack>
            </Box>
          </Drawer>

          {/* Controles superiores (Tabs + Filtros) */}
          <Container sx={{ mt: 3 }}>
            <Tabs
              value={CATEGORY_LIST.indexOf(selectedCategory)}
              onChange={(_, idx) => setSelectedCategory(CATEGORY_LIST[idx])}
              variant="scrollable"
              allowScrollButtonsMobile
            >
              {CATEGORY_LIST.map((c) => (
                <Tab key={c} label={c} />
              ))}
            </Tabs>

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", md: "center" }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                  <FilterAltIcon />
                  <Typography variant="subtitle2">Precio:</Typography>
                  <Box sx={{ px: 2, flex: 1 }}>
                    <Slider
                      value={priceRange}
                      onChange={(_, v) => setPriceRange(v as number[])}
                      valueLabelDisplay="auto"
                      min={0}
                      max={120}
                    />
                  </Box>
                </Stack>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="sort-label">Ordenar</InputLabel>
                  <Select
                    labelId="sort-label"
                    label="Ordenar"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as any)}
                  >
                    <MenuItem value="relevance">Relevancia</MenuItem>
                    <MenuItem value="priceAsc">Precio: menor a mayor</MenuItem>
                    <MenuItem value="priceDesc">Precio: mayor a menor</MenuItem>
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {DIET_TAGS.map((t) => {
                    const active = selectedTags.includes(t);
                    return (
                      <Chip
                        key={t}
                        label={t}
                        color={active ? "primary" : "default"}
                        variant={active ? "filled" : "outlined"}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                          )
                        }
                        sx={{ textTransform: "capitalize" }}
                      />
                    );
                  })}
                </Stack>
              </Stack>
            </Box>
          </Container>

          {/* Grid de productos */}
          <Container sx={{ mt: 3, pb: 6 }}>
            <Grid container spacing={3}>
              {filtered.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardMedia component="img" image={item.image} height="160" alt={item.name} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="subtitle1" color="primary">
                          {peso(item.price)}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {item.description}
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                        {(item.tags || []).map((tag) => (
                          <Chip key={tag} size="small" label={tag} />
                        ))}
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                      <Button
                        variant="outlined"
                        fullWidth
                        onClick={() =>
                          addLine({
                            itemId: item.id,
                            name: item.name,
                            basePrice: item.price,
                            quantity: 1,
                            image: item.image,
                          })
                        }
                      >
                        Agregar rápido
                      </Button>
                      <Button variant="contained" fullWidth onClick={() => openDetails(item)}>
                        Detalles
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>

          {/* Dialog de detalles / modificadores */}
          <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>
              {detailsItem?.name} {detailsItem && <Typography component="span">— {peso(previewPrice)}</Typography>}
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {detailsItem?.description}
              </Typography>
              {detailsItem?.modifiers?.map((g) => (
                <Box key={g.id} sx={{ mb: 2 }}>
                  <Typography fontWeight={600} gutterBottom>
                    {g.label} {g.required ? "*" : ""}{" "}
                    {g.type === "multi" && g.max ? `(hasta ${g.max})` : ""}
                  </Typography>

                  {g.type === "single" ? (
                    <RadioGroup
                      value={(selectedOptions[g.id] || [])[0] || ""}
                      onChange={(_, val) => toggleOption(g, val)}
                    >
                      {g.options.map((o) => (
                        <FormControlLabel
                          key={o.id}
                          value={o.id}
                          control={<Radio />}
                          label={`${o.label} ${o.priceDelta ? `(+${peso(o.priceDelta)})` : ""}`}
                        />
                      ))}
                    </RadioGroup>
                  ) : (
                    <Stack>
                      {g.options.map((o) => {
                        const checked = (selectedOptions[g.id] || []).includes(o.id);
                        return (
                          <FormControlLabel
                            key={o.id}
                            control={
                              <Checkbox
                                checked={checked}
                                onChange={() => toggleOption(g, o.id)}
                              />
                            }
                            label={`${o.label} ${o.priceDelta ? `(+${peso(o.priceDelta)})` : ""}`}
                          />
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              ))}

              <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                <IconButton onClick={() => setDetailsQty((q) => Math.max(1, q - 1))}>
                  <RemoveIcon />
                </IconButton>
                <Typography>{detailsQty}</Typography>
                <IconButton onClick={() => setDetailsQty((q) => q + 1)}>
                  <AddIcon />
                </IconButton>
                <Box flex={1} />
                <Typography fontWeight={700}>{peso(previewPrice)}</Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Cancelar</Button>
              <Button variant="contained" onClick={addFromDialog}>
                Agregar al carrito
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ThemeProvider>
    </ProtectedRoute>
  );
}
