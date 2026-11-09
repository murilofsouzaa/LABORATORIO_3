import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, X, Mail } from 'lucide-react';
import type { Transacao } from '../types/api';

interface CouponModalProps {
  transacao: Transacao;
  onClose: () => void;
}

export const CouponModal: React.FC<CouponModalProps> = ({ transacao, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (transacao.codigoCupom) {
      navigator.clipboard.writeText(transacao.codigoCupom);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
          <CheckCircle2 size={56} style={{ margin: '0 auto' }} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Vantagem Resgatada com Sucesso!
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {transacao.motivo}
        </p>

        <div
          style={{
            background: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Código de Cupom para Troca Presencial
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', margin: '0.5rem 0' }}>
            {transacao.codigoCupom}
          </div>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', margin: '0 auto' }}
          >
            {copied ? <Check size={14} color="green" /> : <Copy size={14} />}
            <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
          </button>
        </div>

        <div className="alert alert-success" style={{ textAlign: 'left', fontSize: '0.825rem' }}>
          <Mail size={20} style={{ flexShrink: 0 }} />
          <div>
            Um e-mail de confirmação com este código foi enviado para você e para a empresa parceira. Apresente este código no balcão da loja para validação.
          </div>
        </div>

        <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          Concluir e Voltar ao Catálogo
        </button>
      </div>
    </div>
  );
};
