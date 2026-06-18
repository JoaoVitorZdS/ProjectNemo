-- Migration 001: Tabela de auditoria da plataforma Alexandria Solar

CREATE TABLE IF NOT EXISTS audit_log (
  id             SERIAL PRIMARY KEY,
  operacao_id    UUID NOT NULL DEFAULT gen_random_uuid(),
  usuario        VARCHAR(255) NOT NULL,
  comando        TEXT NOT NULL,
  fonte          VARCHAR(50) NOT NULL DEFAULT 'chat',
  setor          VARCHAR(100),
  status         VARCHAR(20) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'reverted')),
  duracao_ms     INTEGER,
  dados_antes    JSONB,
  dados_depois   JSONB,
  reverted       BOOLEAN NOT NULL DEFAULT false,
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_criado_em ON audit_log (criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_setor ON audit_log (setor);
CREATE INDEX IF NOT EXISTS idx_audit_log_status ON audit_log (status);
CREATE INDEX IF NOT EXISTS idx_audit_log_operacao_id ON audit_log (operacao_id);

-- View: fluxo por setor e dia
CREATE OR REPLACE VIEW vw_fluxo_setor AS
SELECT
  setor,
  criado_em::date AS dia,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'success') AS sucesso,
  COUNT(*) FILTER (WHERE status = 'error') AS erros
FROM audit_log
WHERE setor IS NOT NULL
GROUP BY setor, criado_em::date
ORDER BY dia DESC, total DESC;

-- View: operações disponíveis para reversão
CREATE OR REPLACE VIEW vw_reversoes_disponiveis AS
SELECT
  id,
  operacao_id,
  usuario,
  comando,
  setor,
  dados_antes,
  dados_depois,
  criado_em
FROM audit_log
WHERE status = 'success'
  AND dados_antes IS NOT NULL
  AND reverted = false
ORDER BY criado_em DESC;
