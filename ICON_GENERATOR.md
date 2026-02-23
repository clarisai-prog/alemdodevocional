# 🎨 Gerador de Ícones PWA

Este script ajuda a gerar os ícones necessários para o PWA.

## Opção 1: Usar Realfavicongenerator.net (Mais Fácil)

1. Visite: https://realfavicongenerator.net/
2. Faça upload de uma imagem (de preferência quadrada, 512x512 ou maior)
3. Customize as cores e settings
4. Download dos ícones
5. Extraia os arquivos PNG e copie para `/public/`:
   - `favicon-192x192.png` → renomeie para `icon-192.png`
   - `favicon-512x512.png` → renomeie para `icon-512.png`

## Opção 2: Usando Canvas/Figma (Mais Controle)

### Design no Figma:
1. Crie uma nova page 512x512px
2. Fundo: #1a160d (escuro)
3. Letra "D" em: #cfaa6c (dourado), Playfair Display, Bold, 200pt
4. Exporte como PNG 512x512
5. Exporte como PNG 192x192
6. Copie para `/public/`

### Design com Python (PIL):
```python
from PIL import Image, ImageDraw, ImageFont
import os

# Criar ícone 512x512
img = Image.new('RGB', (512, 512), color='#1a160d')
draw = ImageDraw.Draw(img)

# Tentar usar PlayfairDisplay se disponível
try:
    font = ImageFont.truetype("C:/Windows/Fonts/PlayfairDisplay-Bold.ttf", 280)
except:
    font = ImageFont.load_default()

# Desenhar "D"
draw.text((220, 100), "D", fill='#cfaa6c', font=font)

img.save('public/icon-512.png')

# Redimensionar para 192x192
img_small = img.resize((192, 192), Image.Resampling.LANCZOS)
img_small.save('public/icon-192.png')

print("✅ Ícones criados com sucesso!")
```

## Opção 3: Usar SVG-to-PNG (Recomendado)

Crie um arquivo SVG simples:

```xml
<!-- icon.svg -->
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#1a160d"/>
  <text x="256" y="340" font-size="280" font-family="Playfair Display, serif" 
        font-weight="bold" text-anchor="middle" fill="#cfaa6c">D</text>
</svg>
```

Depois converta com:
- Online: https://cloudconvert.com/ (SVG → PNG)
- CLI: `convert icon.svg icon-512.png` (ImageMagick)

## Opção 4: Usar Maskable Icon (Mais Moderno)

Crie versões "maskable" com safe zone:

```
icon-192.png (192x192)
├─ Conteúdo importante: centro 128x128
└─ Safe zone: 32px padding

icon-512.png (512x512)
├─ Conteúdo importante: centro 334x334
└─ Safe zone: 89px padding
```

Isso permite que o sistema operacional corte o ícone em diferentes formatos sem perder conteúdo importante.

## Estrutura Esperada em `/public/`

```
public/
├── sw.js
├── manifest.json
├── icon-192.png ✅ To create
├── icon-192-maskable.png ✅ To create
├── icon-512.png ✅ To create
├── icon-512-maskable.png ✅ To create
└── ... outros arquivos
```

---

## ✅ Após adicionar os ícones:

```bash
# Teste no navegador
git add public/*.png
git commit -m "🎨 Add: Ícones PWA 192x192 e 512x512"
git push origin main

# Verifique em: 
# https://twitter.com/app_launcher (URL que testa manifest)
# https://web.dev/pwa-checklist/
```

---

## 🤖 Script Automático (Python)

Se tiver Pillow (PIL) instalado:

```bash
pip install pillow
python scripts/generate_icons.py
```

Arquivo `scripts/generate_icons.py`:

```python
#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

def create_pwa_icons():
    # Cores do design
    BACKGROUND = '#1a160d'
    FOREGROUND = '#cfaa6c'
    
    for size in [192, 512]:
        # Criar background
        img = Image.new('RGB', (size, size), color=BACKGROUND)
        draw = ImageDraw.Draw(img)
        
        # Font size proporcional
        font_size = int(size * 0.55)
        try:
            font = ImageFont.truetype("arial.ttf", font_size, weight=700)
        except:
            font = ImageFont.load_default()
        
        # Desenhar "D"
        text = "D"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = (size - text_width) // 2
        y = (size - text_height) // 2 - int(size * 0.05)
        
        draw.text((x, y), text, fill=FOREGROUND, font=font)
        
        # Salvar versão regular
        img.save(f'public/icon-{size}.png')
        print(f"✅ Criado: icon-{size}.png")
        
        # Criar versão maskable (com safe zone)
        safe_zone = int(size * 0.087)  # ~45px para 512
        img_maskable = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        
        # Copiar com padding
        img_rgb = img.convert('RGBA')
        img_maskable.paste(img_rgb, (0, 0))
        
        # Adicionar gradient circle (opcional)
        draw_m = ImageDraw.Draw(img_maskable)
        circle_size = size - (safe_zone * 2)
        draw_m.ellipse(
            [safe_zone, safe_zone, size - safe_zone, size - safe_zone],
            outline=(207, 170, 108, 255)
        )
        
        img_maskable.save(f'public/icon-{size}-maskable.png')
        print(f"✅ Criado: icon-{size}-maskable.png")

if __name__ == '__main__':
    create_pwa_icons()
    print("\n🎉 Todos os ícones foram gerados!")
```

Execute com:
```bash
python3 scripts/generate_icons.py
```

---

## 📝 Checklist Final

- [ ] Ícones 192x192 e 512x512 criados
- [ ] Ícones uploadados em `/public/`
- [ ] Verificar no manifest.json que estão listados
- [ ] Testar em Chrome DevTools
- [ ] Testar no Lighthouse PWA audit
- [ ] Testar modo offline
- [ ] Commit e push
