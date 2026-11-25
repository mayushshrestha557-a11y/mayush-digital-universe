# Mayush Shrestha — Personal 3D Digital Universe

A responsive front-end portfolio concept using HTML, CSS, JavaScript and Three.js.

## Folder structure

```text
mayush_digital_universe/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── world.js
│   ├── pages.js
│   ├── translations.js
│   └── game.js
└── assets/
    ├── photos/
    └── audio/
```

## Add your photographs

Copy your real image files into `assets/photos/` and preserve the exact spelling and capitalisation:

- `IMG_5389.JPG` — profile picture
- `f1ded1c22d4cf0318ca769aed37ff7a2.JPEG`
- `IMG_0374.JPG`
- `IMG_0433.PNG`
- `IMG_1423.JPG`
- `IMG_2110.jpg`
- `IMG_2323.jpg`
- `IMG_2349.JPG`
- `IMG_2812.jpg`
- `IMG_3248.JPG`
- `IMG_3794.jpg`
- `IMG_3838.jpg`
- `IMG_5684.JPG`

The photo files were not included in this code package. The gallery displays placeholders until you copy them into the folder.

## Run it

Because the project uses JavaScript modules and Three.js, open it through a local web server rather than relying on a `file://` preview. On a computer, use VS Code Live Server, or run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

On iPhone, use a code editor/hosting service that serves the folder as a website. Upload the complete folder to GitHub Pages, Netlify or another static host. Keep the folder structure unchanged.

## Features

- Three.js procedural leopard intro and 3D logo environment
- Three.js Kathmandu-inspired pagoda/temple scene
- 3D portal-style page transitions
- English, Nepali, Hindi and Japanese interface translations
- Day/night theme toggle
- Browser-generated interface sounds (tap/click once first; browsers require a user gesture)
- Chitwan village route mini-game
- Responsive layout
- Photo gallery slots
- Contact links using email, telephone and Facebook

## Important notes

- The leopard and temple are procedural 3D illustrations made from Three.js geometry, not scanned photorealistic 3D models. For truly realistic models, add licensed `.glb`/`.gltf` assets later.
- Three.js and Google Fonts are loaded from online CDNs, so the site needs an internet connection.
- The contact form is represented by direct contact links. A production contact form that stores and sends messages needs a backend or a trusted form service.
- Your phone number, email and social profile are public in this website. Remove or replace them if you do not want them visible to everyone.
- The language selector translates the main navigation and hero interface. The longer biography pages are currently written in English and can be translated in a future content pass.

