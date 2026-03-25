/* ============================================
   PAPELLO - FORMULÁRIO BRIEFING JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const form = document.getElementById('briefingForm');
    const steps = document.querySelectorAll('.form-step');
    const stepCircles = document.querySelectorAll('.step-circle');
    const progressFill = document.getElementById('progressFill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const newBriefingBtn = document.getElementById('newBriefing');
    const reviewContent = document.getElementById('reviewContent');
    const currentStepDisplay = document.getElementById('currentStepDisplay');

    let currentStep = 1;
    const totalSteps = steps.length;

    // ============================================
    // CONFETTI ANIMATION
    // ============================================

    let confettiCanvas = null;
    let confettiCtx = null;
    let confettiParticles = [];
    let confettiRunning = false;
    let confettiAnimationId = null;

    function initConfettiCanvas() {
        confettiCanvas = document.getElementById('confetti-canvas');
        if (!confettiCanvas) {
            confettiCanvas = document.createElement('canvas');
            confettiCanvas.id = 'confetti-canvas';
            confettiCanvas.style.position = 'fixed';
            confettiCanvas.style.top = '0';
            confettiCanvas.style.left = '0';
            confettiCanvas.style.width = '100%';
            confettiCanvas.style.height = '100%';
            confettiCanvas.style.pointerEvents = 'none';
            confettiCanvas.style.zIndex = '9999';
            document.body.appendChild(confettiCanvas);
        }
        confettiCtx = confettiCanvas.getContext('2d');
        resizeConfettiCanvas();
        window.addEventListener('resize', resizeConfettiCanvas);
    }

    function resizeConfettiCanvas() {
        if (confettiCanvas) {
            confettiCanvas.width = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
    }

    function createConfettiPiece() {
        const colors = ['#96ca00', '#7a9a00', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];
        return {
            x: Math.random() * window.innerWidth,
            y: -10,
            size: Math.random() * 8 + 4,
            speedY: Math.random() * 6 + 4,
            speedX: (Math.random() - 0.5) * 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: 1
        };
    }

    function animateConfetti() {
        if (!confettiRunning) return;
        if (!confettiCtx || !confettiCanvas) return;

        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (let i = 0; i < confettiParticles.length; i++) {
            const p = confettiParticles[i];
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.008;

            if (p.opacity > 0 && p.y < confettiCanvas.height + 100) {
                confettiCtx.save();
                confettiCtx.translate(p.x, p.y);
                confettiCtx.rotate(p.rotation * Math.PI / 180);
                confettiCtx.globalAlpha = p.opacity;
                confettiCtx.fillStyle = p.color;
                confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                confettiCtx.restore();
            }
        }

        confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < confettiCanvas.height + 100);

        if (confettiParticles.length === 0) {
            stopConfetti();
        } else {
            confettiAnimationId = requestAnimationFrame(animateConfetti);
        }
    }

    function startConfetti() {
        stopConfetti();
        initConfettiCanvas();
        resizeConfettiCanvas();
        confettiRunning = true;
        confettiParticles = [];
        for (let i = 0; i < 200; i++) {
            confettiParticles.push(createConfettiPiece());
        }
        animateConfetti();
        setTimeout(() => stopConfetti(), 3000);
    }

    function stopConfetti() {
        confettiRunning = false;
        if (confettiAnimationId) {
            cancelAnimationFrame(confettiAnimationId);
            confettiAnimationId = null;
        }
        if (confettiCtx && confettiCanvas) {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
        confettiParticles = [];
    }

    // ============================================
    // VALIDAÇÃO DE ETAPAS
    // ============================================

    const fieldLabels = {
        hasLogo: 'Você possui logo?',
        estampaOpcao: 'Opção de estampa',
        logoPosicao: 'Posição da logo',
        terms: 'Aceite dos termos'
    };

    const stepNames = {
        1: 'Identidade Visual',
        2: 'Manual de Marca',
        3: 'Estampa e Posição',
        4: 'Contatos e Redes Sociais',
        5: 'Tabela Nutricional',
        6: 'Alto Teor de Nutrientes',
        7: 'Referências e Observações',
        8: 'Revisão e Envio'
    };

    function showValidationAlert(message) {
        const alert = document.getElementById('validationAlert');
        const msg = document.getElementById('validationAlertMsg');
        if (alert && msg) {
            msg.textContent = message;
            alert.style.display = 'flex';
            alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function hideValidationAlert() {
        const alert = document.getElementById('validationAlert');
        if (alert) alert.style.display = 'none';
    }

    function validateStep(stepElement) {
        const requiredFields = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        let firstInvalid = null;
        let missingFields = [];

        requiredFields.forEach(field => {
            if (field.type === 'radio') {
                const name = field.name;
                const radios = stepElement.querySelectorAll(`input[name="${name}"]`);
                const checked = Array.from(radios).some(r => r.checked);
                if (!checked) {
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                    field.closest('.custom-radio')?.classList.add('is-invalid');
                    missingFields.push(fieldLabels[name] || name);
                } else {
                    radios.forEach(r => {
                        r.closest('.custom-radio')?.classList.remove('is-invalid');
                    });
                }
            } else if (field.type === 'checkbox') {
                if (!field.checked) {
                    isValid = false;
                    if (!firstInvalid) firstInvalid = field;
                    field.closest('.custom-checkbox')?.classList.add('is-invalid');
                    missingFields.push(fieldLabels[field.name] || field.name);
                }
            } else {
                if (!field.checkValidity()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    if (!firstInvalid) firstInvalid = field;
                    missingFields.push(fieldLabels[field.name] || field.name);
                } else {
                    field.classList.remove('is-invalid');
                }
            }
        });

        if (!isValid) {
            const stepNum = parseInt(stepElement.dataset.step);
            const stepLabel = stepNames[stepNum] || `Etapa ${stepNum}`;
            const fieldsText = missingFields.length === 1
                ? `"${missingFields[0]}"`
                : missingFields.map(f => `"${f}"`).join(', ');
            showValidationAlert(`Preencha os campos obrigatórios em ${stepLabel}: ${fieldsText}`);
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        } else {
            hideValidationAlert();
        }

        return isValid;
    }

    // ============================================
    // CAMPOS CONDICIONAIS
    // ============================================

    function setupConditionalFields() {
        // Logo
        const hasLogoRadios = document.querySelectorAll('input[name="hasLogo"]');
        const logoSimDiv = document.getElementById('logoSim');
        const logoNaoDiv = document.getElementById('logoNao');
        hasLogoRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.value === 'sim') {
                    logoSimDiv.style.display = 'block';
                    logoNaoDiv.style.display = 'none';
                } else if (this.value === 'nao') {
                    logoSimDiv.style.display = 'none';
                    logoNaoDiv.style.display = 'block';
                }
            });
        });

        // Manual
        const hasManualRadios = document.querySelectorAll('input[name="hasManual"]');
        const manualSimDiv = document.getElementById('manualSim');
        hasManualRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                manualSimDiv.style.display = this.value === 'sim' ? 'block' : 'none';
            });
        });

        // Estampa
        const estampaRadios = document.querySelectorAll('input[name="estampaOpcao"]');
        const estampaSimDiv = document.getElementById('estampaSim');
        const corLisaDiv = document.getElementById('corLisa');
        estampaRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                if (this.value === 'estampa') {
                    estampaSimDiv.style.display = 'block';
                    corLisaDiv.style.display = 'none';
                } else if (this.value === 'corLisa') {
                    estampaSimDiv.style.display = 'none';
                    corLisaDiv.style.display = 'block';
                }
            });
        });

        // Posição e Frase
        const posicaoRadios = document.querySelectorAll('input[name="logoPosicao"]');
        const fraseDiv = document.getElementById('fraseField');
        posicaoRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                fraseDiv.style.display = this.value === 'frente_verso_frase' ? 'block' : 'none';
            });
        });

        // Contatos
        const contatosRadios = document.querySelectorAll('input[name="hasContatos"]');
        const contatosDiv = document.getElementById('contatosSim');
        contatosRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                contatosDiv.style.display = this.value === 'sim' ? 'block' : 'none';
            });
        });

        // Tabela Nutricional
        const tabelaRadios = document.querySelectorAll('input[name="hasTabela"]');
        const tabelaDiv = document.getElementById('tabelaSim');
        tabelaRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                tabelaDiv.style.display = this.value === 'sim' ? 'block' : 'none';
            });
        });

        // Nutrientes
        const nutrientesRadios = document.querySelectorAll('input[name="hasNutrientes"]');
        const nutrientesDiv = document.getElementById('nutrientesSim');
        nutrientesRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                nutrientesDiv.style.display = this.value === 'sim' ? 'block' : 'none';
            });
        });

        // Referências
        const referenciasRadios = document.querySelectorAll('input[name="hasReferencias"]');
        const referenciasDiv = document.getElementById('referenciasSim');
        referenciasRadios.forEach(radio => {
            radio.addEventListener('change', function () {
                referenciasDiv.style.display = this.value === 'sim' ? 'block' : 'none';
            });
        });
    }

    // ============================================
    // ESTAMPAS SELEÇÃO
    // ============================================

    function setupEstampas() {
        const estampas = document.querySelectorAll('.estampa-item');
        const inputHidden = document.getElementById('estampaSelecionada');
        estampas.forEach(item => {
            item.addEventListener('click', function () {
                estampas.forEach(e => e.classList.remove('selected'));
                this.classList.add('selected');
                if (inputHidden) inputHidden.value = this.getAttribute('data-estampa');
            });
        });
    }

    // ============================================
    // FILE INPUTS
    // ============================================

    function setupFileInputs() {
        const fileInputs = document.querySelectorAll('.custom-file-input input[type="file"]');
        fileInputs.forEach(input => {
            input.addEventListener('change', function () {
                const fileNameSpan = this.closest('.custom-file-input').querySelector('.file-name');
                if (this.files.length > 0) {
                    const names = Array.from(this.files).map(f => f.name).join(', ');
                    fileNameSpan.textContent = names.length > 50 ? names.substring(0, 50) + '...' : names;
                } else {
                    fileNameSpan.textContent = 'Nenhum arquivo selecionado';
                }
            });
        });
    }

    // ============================================
    // NAVEGAÇÃO ENTRE PASSOS
    // ============================================

    function goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > totalSteps) return;

        if (stepNumber > currentStep) {
            const currentStepElement = steps[currentStep - 1];
            if (!validateStep(currentStepElement)) return;
        }

        currentStep = stepNumber;
        updateUI();
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function goToNextStep() {
        goToStep(currentStep + 1);
    }

    function goToPrevStep() {
        goToStep(currentStep - 1);
    }

    // ============================================
    // ATUALIZAR UI
    // ============================================

    function updateUI() {
        // Atualizar steps
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });

        // Atualizar círculos
        stepCircles.forEach((circle, index) => {
            const stepNum = index + 1;
            circle.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                circle.classList.add('active');
            } else if (stepNum < currentStep) {
                circle.classList.add('completed');
            }
        });

        // Atualizar barra de progresso
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;

        // Botão anterior
        prevBtn.disabled = currentStep === 1;

        // Botão próximo vs enviar
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
            updateReview();
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }

        // Indicador de passo
        if (currentStepDisplay) currentStepDisplay.textContent = currentStep;
    }

    // ============================================
    // REVISÃO DE DADOS
    // ============================================

    function updateReview() {
        const formData = new FormData(form);
        let reviewHTML = '';

        const fieldMappings = [
            { key: 'hasLogo', label: 'Possui logo?' },
            { key: 'brandName', label: 'Nome da marca' },
            { key: 'hasManual', label: 'Manual de marca' },
            { key: 'estampaOpcao', label: 'Estampa' },
            { key: 'estampaSelecionada', label: 'Estampa escolhida' },
            { key: 'cmykColor', label: 'Cor CMYK' },
            { key: 'logoPosicao', label: 'Posição da logo' },
            { key: 'frase', label: 'Frase' },
            { key: 'hasContatos', label: 'Contatos' },
            { key: 'hasTabela', label: 'Tabela nutricional' },
            { key: 'hasNutrientes', label: 'Alto teor nutrientes' },
            { key: 'hasReferencias', label: 'Referências' },
            { key: 'observacoes', label: 'Observações' }
        ];

        fieldMappings.forEach(field => {
            let value = formData.get(field.key);
            if (value && value.trim() !== '') {
                if (field.key === 'estampaOpcao') {
                    value = value === 'estampa' ? 'Sim, com estampa' : 'Cor lisa';
                }
                if (field.key === 'logoPosicao') {
                    const map = {
                        frente_verso: 'Frente e verso',
                        frente_verso_liso: 'Frente e verso liso',
                        frente_verso_frase: 'Frente e verso com frase'
                    };
                    value = map[value] || value;
                }
                reviewHTML += `
                    <div class="review-item">
                        <span class="review-item-label">${field.label}</span>
                        <span class="review-item-value">${escapeHtml(value)}</span>
                    </div>
                `;
            }
        });

        // Contatos
        const telefone = formData.get('telefone');
        const whatsapp = formData.get('whatsapp');
        const instagram = formData.get('instagram');
        const facebook = formData.get('facebook');
        let contatos = [];
        if (telefone) contatos.push(`Tel: ${telefone}`);
        if (whatsapp) contatos.push(`Whats: ${whatsapp}`);
        if (instagram) contatos.push(`Instagram: ${instagram}`);
        if (facebook) contatos.push(`Facebook: ${facebook}`);
        if (contatos.length) {
            reviewHTML += `<div class="review-item"><span class="review-item-label">Contatos</span><span class="review-item-value">${contatos.join(' | ')}</span></div>`;
        }

        // Nutrientes
        const nutrientes = formData.getAll('nutrientesOpcoes');
        if (nutrientes.length) {
            const nutriLabels = {
                alto_acucar: '🍬 Alto açúcar',
                alto_gordura: '🥩 Alta gordura',
                alto_sodio: '🧂 Alto sódio'
            };
            const nomes = nutrientes.map(n => nutriLabels[n] || n);
            reviewHTML += `<div class="review-item"><span class="review-item-label">Nutrientes</span><span class="review-item-value">${nomes.join(', ')}</span></div>`;
        }

        reviewContent.innerHTML = reviewHTML;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============================================
    // ENVIO DO FORMULÁRIO
    // ============================================
    function markTermsInvalid() {
        const termsCheckbox = document.getElementById('terms');
        const checkboxLabel = termsCheckbox ? termsCheckbox.closest('.custom-checkbox') : null;
        if (checkboxLabel) checkboxLabel.classList.add('is-invalid');
        if (termsCheckbox) termsCheckbox.focus();
        if (checkboxLabel) checkboxLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showValidationAlert('Você precisa aceitar os termos de uso para enviar o briefing.');
    }

    function handleSubmit(e) {
        e.preventDefault();
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            markTermsInvalid();
            return;
        }

        // Final validation of the last step before submitting
        const lastStep = steps[totalSteps - 1];
        if (!validateStep(lastStep)) return;

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            form.style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            document.querySelector('.intro').style.display = 'none';
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            startConfetti();

            const formData = new FormData(form);
            console.log('Briefing enviado:');
            for (let [key, value] of formData.entries()) {
                if (!key.includes('File')) {
                    console.log(`${key}: ${value}`);
                }
            }
        }, 900);
    }

    function resetForm() {
        stopConfetti();
        form.reset();
        currentStep = 1;
        updateUI();
        form.style.display = 'block';
        document.querySelector('.progress-container').style.display = 'block';
        document.querySelector('.intro').style.display = 'block';
        successMessage.style.display = 'none';
        submitBtn.disabled = false;

        document.querySelectorAll('.conditional-field').forEach(div => div.style.display = 'none');
        document.querySelectorAll('.estampa-item').forEach(e => e.classList.remove('selected'));
        document.querySelectorAll('.file-name').forEach(span => span.textContent = 'Nenhum arquivo selecionado');
        if (document.getElementById('estampaSelecionada')) document.getElementById('estampaSelecionada').value = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    prevBtn.addEventListener('click', goToPrevStep);
    nextBtn.addEventListener('click', goToNextStep);
    form.addEventListener('submit', handleSubmit);
    newBriefingBtn.addEventListener('click', resetForm);

    stepCircles.forEach(circle => {
        circle.addEventListener('click', function () {
            const stepNum = parseInt(this.getAttribute('data-step'));
            if (stepNum < currentStep) goToStep(stepNum);
        });
    });

    form.addEventListener('input', function (e) {
        if (e.target.checkValidity) e.target.classList.remove('is-invalid');
        if (e.target.type === 'radio') {
            const radios = document.querySelectorAll(`input[name="${e.target.name}"]`);
            radios.forEach(r => {
                r.closest('.custom-radio')?.classList.remove('is-invalid');
            });
        }
        hideValidationAlert();
    });

    // Mostrar avisos (is-warning) em campos opcionais quando saem do foco vazios
    form.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('blur', function () {
            if (this.required) return;
            if (this.type === 'file' || this.type === 'radio' || this.type === 'checkbox') return;
            const cf = this.closest('.conditional-field');
            const visible = !cf || cf.style.display !== 'none';
            if (visible && this.value.trim() === '') {
                this.classList.add('is-warning');
            } else {
                this.classList.remove('is-warning');
            }
        });

        el.addEventListener('input', function () {
            this.classList.remove('is-warning');
        });
    });

    // Radios: limpar classes de erro/aviso ao mudar
    form.querySelectorAll('input[type="radio"]').forEach(r => {
        r.addEventListener('change', function () {
            const group = document.querySelectorAll(`input[name="${this.name}"]`);
            group.forEach(g => g.closest('.custom-radio')?.classList.remove('is-invalid', 'is-warning'));
            hideValidationAlert();
        });
    });

    // Checkboxes: limpar classes ao mudar
    form.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function () {
            this.closest('.custom-checkbox')?.classList.remove('is-invalid', 'is-warning');
            hideValidationAlert();
        });
    });

    form.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON' && e.target.type !== 'file') {
            e.preventDefault();
            if (currentStep < totalSteps) goToNextStep();
        }
    });

    // ============================================
    // INICIALIZAÇÃO
    // ============================================

    setupConditionalFields();
    setupEstampas();
    setupFileInputs();
    updateUI();
});
