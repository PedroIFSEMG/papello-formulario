# Papello - Briefing para Projetos de Embalagem

Um formulário multipasso interativo e responsivo para coleta de informações sobre projetos de embalagem.

## Estrutura do Projeto

```
papello-new/
├── index.html                 # Página HTML principal (limpa, sem CSS/JS inline)
├── assets/
│   ├── css/
│   │   ├── variables.css     # Variáveis de cores, tamanhos e efeitos
│   │   ├── styles.css        # Estilos main com efeitos de brilho
│   │   └── mobile.css        # Media queries para responsividade
│   ├── js/
│   │   └── script.js         # Lógica da aplicação
│   └── logo/                 # Imagens e logos
```

## Melhorias Implementadas

### 1. **Estrutura Modular**
- CSS dividido em 3 arquivos:
  - `variables.css`: Variáveis centralizadas (cores, sombras, gradientes)
  - `styles.css`: Estilos desktop com efeitos de grilho
  - `mobile.css`: Media queries para responsividade otimizada
- JavaScript em arquivo externo: `script.js`
- HTML limpo sem CSS/JS inline

### 2. **Efeitos de Brilho (Glow Effects)**
- Badge "Etapa" com pulsação glowing e animação shimmer
- Título do intro com efeito de brilho sutil
- Círculos de progresso com glow dinâmico
- Cards do formulário com glow ao hover
- Barra de progresso com efeito de movimento de gradiente
- Elementos com drop-shadow aprimorado

### 3. **Responsividade Melhorada**
- Breakpoints otimizados:
  - Desktop: `> 1024px` - Logo grande (200px)
  - Tablets: `769px - 1024px`
  - Celulares: `641px - 768px`
  - Celulares pequenos: `481px - 640px`
  - Extra pequenos: `≤ 480px`
- Media queries específicas para orientação landscape
- Touch targets mínimos (44px) para dispositivos touchscreen
- Dark mode automático (prefers-color-scheme)

### 4. **Header Otimizado**
- **Desktop (>1200px)**: Logo exibida em 200px com brilho adicional
- **Mobile**: Logo redimensionada adaptively (30-48px)
- Backdrop filter aprimorado `blur(20px)`
- Fundo semi-transparente elegante
- Efeito hover melhorado com transições suaves

### 5. **Animações e Transições**
- Fade-in suave ao carregar elementos
- Slide-down para campos condicionais
- Pop-in para radio buttons/checkboxes
- Bounce-in para ícone de sucesso
- Pulse-glow para badges notificação
- Shimmer para efeito de brilho

## Variáveis CSS Disponíveis

### Cores
```css
--color-primary: #96ca00
--color-success: #10b981
--color-warning: #f59e0b
--color-danger: #ef4444
```

### Sombras e Glow
```css
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--glow-primary: 0 0 20px rgba(150, 202, 0, 0.4)
--glow-primary-md: 0 0 0 4px rgba(150, 202, 0, 0.3)
```

### Transições
```css
--transition-fast: 0.2s ease
--transition-base: 0.3s ease
--transition-slow: 0.5s ease
```

## Funcionalidades

✅ Formulário com 8 etapas  
✅ Validação em tempo real  
✅ Campos condicionais dinâmicos  
✅ Barra de progresso com animação  
✅ Preview de estampas  
✅ Grid de nutrientes  
✅ Upload de arquivos customizado  
✅ Revisão de dados antes de envio  
✅ Animação Confetti no sucesso  
✅ Totalmente responsivo  
✅ Dark mode automático  

## Como Usar

1. Abra `index.html` em um navegador
2. Preencha o formulário através das 8 etapas
3. Valide suas informações na etapa final
4. Envie o briefing

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notas Técnicas

- Framework: Bootstrap 5.3
- Ícones: Font Awesome 6.5.1
- Fonte: Inter (Google Fonts)
- CSS: Modular com variáveis CSS
- JavaScript: Vanilla, sem dependências

## Futuras Melhorias

- [ ] Integração com backend
- [ ] Autosave de rascunhos
- [ ] Tema light/dark toggle manual
- [ ] Exportar dados como PDF
- [ ] Histórico de formulários
