# My World Cup ⚽

Sistema de recomendación personalizado para la Copa Mundial FIFA 2026.

## Descripción

My World Cup es una aplicación web que ayuda a los aficionados a identificar rápidamente los partidos más relevantes del Mundial 2026 según sus intereses personales y disponibilidad horaria.

La plataforma utiliza un algoritmo heurístico determinista para generar recomendaciones transparentes y explicables, combinando factores deportivos y preferencias del usuario.

## Demo

https://mywc2026.vercel.app

## Funcionalidades

* Recomendaciones personalizadas de partidos
* Selección de equipos favoritos
* Selección de regiones de interés
* Configuración de disponibilidad horaria
* Explorador completo de partidos
* Sistema de favoritos
* Seguimiento de partidos vistos
* Explicaciones detalladas de cada recomendación
* Clasificación automática de encuentros

## Tecnologías Utilizadas

* React 19
* TypeScript
* Vite
* Tailwind CSS
* React Router
* LocalStorage

## Arquitectura

La aplicación utiliza una arquitectura client-side.

Las preferencias del usuario se almacenan localmente mediante LocalStorage, evitando la necesidad de autenticación y permitiendo una experiencia rápida y simple.

## Algoritmo de Recomendación

### Objective Score

La relevancia deportiva objetiva de un partido se calcula mediante:

Objective Score = 0.55 × Etapa + 0.25 × Popularidad + 0.15 × Ranking FIFA + 0.05 × Rivalidad

### Personal Score

La afinidad del partido con las preferencias del usuario se calcula mediante:

Personal Score = 0.70 × Equipos Favoritos + 0.30 × Regiones Favoritas

### Final Score

La puntuación principal de recomendación se obtiene mediante:

Final Score = 0.60 × Objective Score + 0.40 × Personal Score

### Adjusted Score

La puntuación final se ajusta según la disponibilidad horaria configurada:

Adjusted Score = 0.90 × Final Score + 0.10 × Disponibilidad Horaria

## Instalación

```bash
git clone <repository-url>
cd my-world-cup
npm install
npm run dev
```

## Build de Producción

```bash
npm run build
```

## Autor

Tomás Bernardez

Ingeniería Informática – Universidad Austral

Grupo: Prodev

---

## Proyecto desarrollado para la competencia "Tu Tiempo, Tu Mundial".
