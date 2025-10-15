/**
 * ==========================================
 * MÓDULO DE FORMULÁRIO DE CONTATO
 * ==========================================
 */

let contactForm;

/**
 * Inicializa o formulário de contato
 */
export function initContactForm() {
    try {
        contactForm = document.getElementById('contact-form');
        
        if (!contactForm) {
            console.warn('Formulário de contato não encontrado');
            return;
        }
        
        contactForm.addEventListener('submit', handleContactFormSubmit);
    } catch (error) {
        console.error('Erro na inicialização do formulário:', error);
    }
}

/**
 * Manipula o envio do formulário de contato
 * @param {Event} e - Evento de submit
 */
function handleContactFormSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            subject: formData.get('subject')?.trim() || '',
            message: formData.get('message')?.trim() || ''
        };

        // Validação básica
        if (!validateContactForm(data)) {
            return;
        }

        // Simula envio do formulário
        showFormMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
        contactForm.reset();
    } catch (error) {
        console.error('Erro no envio do formulário:', error);
        showFormMessage('Erro ao enviar mensagem. Tente novamente.', 'error');
    }
}

/**
 * Valida os dados do formulário de contato
 * @param {Object} data - Dados do formulário
 * @returns {boolean} True se os dados são válidos
 */
function validateContactForm(data) {
    try {
        const errors = [];

        if (!data.name || data.name.length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Email inválido');
        }

        if (!data.subject || data.subject.length < 5) {
            errors.push('Assunto deve ter pelo menos 5 caracteres');
        }

        if (!data.message || data.message.length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }

        if (errors.length > 0) {
            showFormMessage(errors.join(', '), 'error');
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro na validação do formulário:', error);
        return false;
    }
}

/**
 * Valida um endereço de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} True se o email é válido
 */
function isValidEmail(email) {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    } catch (error) {
        console.error('Erro na validação de email:', error);
        return false;
    }
}

/**
 * Mostra uma mensagem no formulário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo de mensagem (success ou error)
 */
function showFormMessage(message, type) {
    try {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        
        // Estilos inline para a mensagem
        Object.assign(messageElement.style, {
            padding: '12px 16px',
            marginTop: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: type === 'success' ? '#d1fae5' : '#fee2e2',
            color: type === 'success' ? '#065f46' : '#991b1b',
            border: `1px solid ${type === 'success' ? '#a7f3d0' : '#fca5a5'}`
        });

        // Adiciona a mensagem após o formulário
        contactForm.appendChild(messageElement);

        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            if (messageElement && messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    } catch (error) {
        console.error('Erro ao mostrar mensagem do formulário:', error);
    }
}