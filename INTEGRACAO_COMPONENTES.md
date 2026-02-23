## 🔧 Guia de Integração dos Componentes

Este documento descreve como integrar os novos componentes (`CoverScreenEspiritual` e `DevocionalPaginasLaterais`) no `App.tsx`.

---

## 📋 Estrutura de Estados

```typescript
type AppScreen = 'welcome' | 'sidebar' | 'lesson' | 'completion';

// Estado global da aplicação
interface AppState {
  currentScreen: AppScreen;
  lesson: number;
  isBookmarked: boolean;
  completedLessons: number[];
}
```

---

## 🎯 Fluxo de Navegação Proposto

```
┌─────────────────────┐
│ CoverScreenEspiritual
│  (Landing Page)      ← Primeira vez
│  - Iniciar Button   │
│  - Checklist Button │
│  - Wallpapers       │  
└──────────┬──────────┘
           │ onStart()
           ▼
┌─────────────────────┐
│ DevocionalPaginasLaterais
│  (Navigation Sidebar)
│  - Aula 1          │
│  - Aula 2          │
│  - Aula 3          │
│  - ...             │
│  (Keyboard + Touch) │
└──────────┬──────────┘
           │ selecionaLicao()
           ▼
┌─────────────────────┐
│ LessonScreen
│  (Conteúdo da Aula)
│  - Seção 1          │
│  - Seção 2          │
│  - Seção 3          │
│  [Bookmark] [Next]  │
└──────────┬──────────┘
           │ completa()
           ▼
┌─────────────────────┐
│ CompletionScreen
│  (Resumo)           │
│  - Progresso        │
│  - Checklist        │
│  [Voltar] [Próxima] │
└─────────────────────┘
```

---

## 🛠️ Implementação

### Opção A: Modificar App.tsx Existente

**Antes:**
```tsx
const [screen, setScreen] = useState<'cover' | 'lesson' | 'completion'>('cover');
const [lessonIndex, setLessonIndex] = useState<number>(0);
```

**Depois:**
```tsx
const [screen, setScreen] = useState<'welcome' | 'sidebar' | 'lesson' | 'completion'>('welcome');
const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
const [showSidebar, setShowSidebar] = useState<boolean>(false);

// Callback quando clica em "Iniciar"
const handleWelcomeStart = () => {
  setScreen('sidebar');
};

// Callback quando seleciona lição na sidebar
const handleLessonSelect = (index: number) => {
  setCurrentLessonIndex(index);
  setScreen('lesson');
  setShowSidebar(false);
};

// Callback quando completa a lição
const handleLessonComplete = () => {
  setScreen('completion');
};
```

**Renderização condicional:**
```tsx
return (
  <>
    <PageAnnouncer message={getAnnouncementForScreen(screen)} />
    
    {screen === 'welcome' && (
      <CoverScreenEspiritual
        onStart={handleWelcomeStart}
        onChecklist={() => setScreen('sidebar')}
        onWallpapers={() => alert('Wallpapers em desenvolvimento')}
        titulo="Além do Devocional"
        subtitulo="Aprofundamento Prático"
      />
    )}

    {screen === 'sidebar' && (
      <DevocionalPaginasLaterais
        paginasDisponiveis={lessons.length}
        onLessonSelect={handleLessonSelect}
      />
    )}

    {screen === 'lesson' && (
      <LessonScreen
        lesson={lessons[currentLessonIndex]}
        onComplete={handleLessonComplete}
        isBookmarked={bookmarks.includes(currentLessonIndex)}
        onBookmarkToggle={() => toggleBookmark(currentLessonIndex)}
      />
    )}

    {screen === 'completion' && (
      <CompletionScreen
        lessonTitle={lessons[currentLessonIndex].title}
        onNextLesson={() => {
          if (currentLessonIndex < lessons.length - 1) {
            handleLessonSelect(currentLessonIndex + 1);
          } else {
            setScreen('sidebar');
          }
        }}
        onBackToMenu={() => setScreen('sidebar')}
      />
    )}
  </>
);
```

---

### Opção B: Criar Novo Layout Root

Se preferir manter App.tsx separado, crie `AppLayout.tsx`:

```tsx
// src/AppLayout.tsx
import { useState } from 'react';
import App from './App';
import CoverScreenEspiritual from './CoverScreenEspiritual';

export default function AppLayout() {
  const [hasStarted, setHasStarted] = useState(false);

  if (!hasStarted) {
    return (
      <CoverScreenEspiritual
        onStart={() => setHasStarted(true)}
        onChecklist={() => alert('Checklist')}
        onWallpapers={() => alert('Wallpapers')}
      />
    );
  }

  return <App />;
}
```

**Atualizar main.tsx:**
```tsx
import AppLayout from './AppLayout';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <AppLayout />
);
```

---

## 📊 Props Reference

### CoverScreenEspiritual
```typescript
interface CoverScreenEspiritualProps {
  onStart: () => void;
  onChecklist?: () => void;
  onWallpapers?: () => void;
  titulo?: string;
  subtitulo?: string;
  descricao?: string;
}
```

### DevocionalPaginasLaterais
```typescript
interface DevocionalPaginasLateraisProps {
  paginasDisponiveis: number;
  onLessonSelect: (index: number) => void;
  // Adicionar mais conforme necessário
}
```

---

## 🎨 Temas para Diferentes Seções

```typescript
// CoverScreenEspiritual tema
<div className="bg-gradient-to-br from-blue-950 via-purple-900 to-black">

// LessonScreen tema
<div className="bg-gradient-to-b from-slate-900 to-slate-800">

// CompletionScreen tema
<div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950">
```

---

## 🔐 State Management

### Option 1: Context API
```tsx
const AppContext = createContext();

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('welcome');
  const [lessons, setLessons] = useState([]);
  
  const value = { screen, setScreen, lessons, setLessons };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

### Option 2: Zustand (recomendado para comlexidade)
```tsx
import { create } from 'zustand';

interface AppStore {
  screen: string;
  setScreen: (screen: string) => void;
  currentLessonIndex: number;
  setCurrentLessonIndex: (index: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  screen: 'welcome',
  setScreen: (screen) => set({ screen }),
  currentLessonIndex: 0,
  setCurrentLessonIndex: (index) => set({ currentLessonIndex: index }),
}));
```

---

## ♿ Integração de Acessibilidade

### PageAnnouncer
```tsx
function getAnnouncementForScreen(screen: string): string {
  const announcements: Record<string, string> = {
    'welcome': 'Página inicial. Bem-vindo ao Além do Devocional.',
    'sidebar': 'Navigationnav lateral. Use setas para navegar entre as lições.',
    'lesson': 'Desafio diário selecionado. Leia o conteúdo e marque como completo.',
    'completion': 'Aula completada! Veja seu progresso.'
  };
  return announcements[screen] || '';
}
```

### Focus Management
```tsx
// Quando tela muda, mover foco para elem principal
useEffect(() => {
  const mainContent = document.querySelector('[role="main"]');
  mainContent?.focus();
}, [screen]);
```

---

## 📱 Media Queries para Sidebar

```typescript
// Em DevocionalPaginasLaterais
// Mobile: sidebar fullscreen
// Tablet+: sidebar side-by-side

<div className="flex flex-col md:flex-row">
  <aside className="md:w-64 md:border-r md:border-gold/30">
    {/* Sidebar */}
  </aside>
  <main className="flex-1">
    {/* Conteúdo */}
  </main>
</div>
```

---

## 🧪 Teste de Integração

```tsx
// __tests__/integration.test.tsx
describe('Fluxo de Navegação', () => {
  it('deve carregar CoverScreenEspiritual', () => {
    render(<AppLayout />);
    expect(screen.getByRole('heading', { name: /Além do Devocional/i })).toBeInTheDocument();
  });

  it('deve navegar para sidebar ao clicar em Iniciar', async () => {
    const { getByRole } = render(<AppLayout />);
    const iniciarBtn = getByRole('button', { name: /Iniciar/i });
    
    fireEvent.click(iniciarBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/Aula/i)).toBeInTheDocument();
    });
  });

  it('deve exibir announces para screen readers', () => {
    render(<AppLayout />);
    const announcer = screen.getByRole('status');
    expect(announcer).toHaveAttribute('aria-live', 'polite');
  });
});
```

---

## 🚀 Deploy Checklist

- [ ] Integração de componentes completa
- [ ] Todos os callbacks conectados
- [ ] États gerenciados corretamente
- [ ] Acessibilidade de navegação testada
- [ ] Responsividade verificada (mobile/tablet/desktop)
- [ ] Service Worker registra todas as janelas
- [ ] Testes de integração passam
- [ ] Build sem erros
- [ ] Lighthouse PWA >90
- [ ] Todos os botões com touch targets corretos

---

## 📝 Notas de Desenvolvimento

1. **Performance:** Use `React.memo()` para DevocionalPaginasLaterais se re-renderizar muito
2. **Animações:** Motion animations funcionam bem em LessonScreen transitions
3. **Tipagem:** Manter TypeScript strict mode (tsconfig.json)
4. **Histórico:** Considerar react-router para persistir navegação
5. **Cache:** Service Worker automaticamente cache de componentes

---

## 🎯 Próximos Passos

1. ✅ Revisar esta integração
2. Aplicar uma das opções de integração (A ou B recomendado)
3. Rodar testes: `npm run lint && npm run build`
4. Testar manualmente no navegador
5. Validar com Screen Readers (NVDA/VoiceOver)
6. Fazer commit e push para GitHub
7. Validar com Lighthouse PWA

---

**Status:** Pronto para implementação ✅
