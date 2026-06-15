import React, { useRef, useState } from 'react';
import '../styles/EmailForm.css';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

const EmailForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome_completo: '',
    titulo: '',
    email: '',
    mensagem: '',
  });

  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('');

    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_e4g868i';
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_280305';
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'zjnG-CtxGkYSGpUGb';

    const nomeCompleto = formData.nome_completo.trim();
    const titulo = formData.titulo.trim() || 'Contato via portfolio';
    const email = formData.email.trim();
    const mensagem = formData.mensagem.trim();

    if (!nomeCompleto || !email || !mensagem) {
      alert('Por favor preencha Nome, Email e Mensagem.');
      return;
    }

    if (!formRef.current) {
      setStatusMessage('Nao foi possivel encontrar o formulario. Recarregue a pagina e tente novamente.');
      return;
    }

    setSending(true);

    try {
      const response = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      });

      console.log('SUCCESS!', response.status, response.text);
      setStatusMessage('Email enviado com sucesso!');
      alert('Email enviado com sucesso!');
      setFormData({ nome_completo: '', titulo: '', email: '', mensagem: '' });
    } catch (err) {
      console.error('FAILED...', err);
      const errorMessage = getEmailJsErrorMessage(err);
      setStatusMessage(`Erro ao enviar email: ${errorMessage}`);
      alert(`Erro ao enviar email: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <form ref={formRef} className="emailform-container tech" onSubmit={handleSubmit}>
      <input type="hidden" name="from_name" value={formData.nome_completo.trim()} readOnly />
      <input type="hidden" name="from_email" value={formData.email.trim()} readOnly />
      <input type="hidden" name="reply_to" value={formData.email.trim()} readOnly />
      <input type="hidden" name="user_name" value={formData.nome_completo.trim()} readOnly />
      <input type="hidden" name="user_email" value={formData.email.trim()} readOnly />
      <input type="hidden" name="subject" value={formData.titulo.trim() || 'Contato via portfolio'} readOnly />
      <input type="hidden" name="message" value={formData.mensagem.trim()} readOnly />
      <input type="hidden" name="to_email" value="eberssjunior12@gmail.com" readOnly />

      <div className="emailform-row">
        <div className="emailform-group">
          <label className="emailform-label" htmlFor="nome_completo">Nome completo</label>
          <input
            type="text"
            id="nome_completo"
            name="nome_completo"
            value={formData.nome_completo}
            onChange={handleChange}
            className="emailform-input"
            placeholder="Digite seu nome completo"
            required
          />
        </div>

        <div className="emailform-group">
          <label className="emailform-label" htmlFor="titulo">Titulo</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className="emailform-input"
            placeholder="Assunto do email"
          />
        </div>
      </div>

      <div className="emailform-group">
        <label className="emailform-label" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="emailform-input"
          placeholder="Digite seu email"
          required
        />
      </div>

      <div className="emailform-group">
        <label className="emailform-label" htmlFor="mensagem">Mensagem</label>
        <textarea
          id="mensagem"
          name="mensagem"
          value={formData.mensagem}
          onChange={handleChange}
          className="emailform-textarea"
          placeholder="Escreva sua mensagem"
          required
        />
      </div>

      <button type="submit" className="emailform-button tech" disabled={sending}>
        {sending ? 'Enviando...' : 'Enviar email'}
      </button>

      {statusMessage ? (
        <p className="emailform-status" aria-live="polite">
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
};

const getEmailJsErrorMessage = (err: unknown) => {
  if (err instanceof EmailJSResponseStatus) {
    if (err.status === 412 && !err.text) {
      return '412 - servico de email desconectado no EmailJS. Reconecte a conta em Email Services.';
    }

    return `${err.status} - ${err.text}`;
  }

  if (typeof err === 'object' && err !== null && 'status' in err && 'text' in err) {
    const status = String((err as { status: unknown }).status);
    const text = String((err as { text: unknown }).text);

    if (status === '412' && !text) {
      return '412 - servico de email desconectado no EmailJS. Reconecte a conta em Email Services.';
    }

    return `${status} - ${text}`;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return 'erro desconhecido. Veja o console do navegador.';
};

export default EmailForm;
