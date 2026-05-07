// =============================================================================
// clinical/comorbidities.js
// -----------------------------------------------------------------------------
// Base de conhecimento clínica das comorbidades.
// Cada item em STRUCTURE: { key, lbl, effects, waves?, notes?, refs? }.
// Engine deriva 4 globais que ele consome:
//   COMORBIDITIES   → catálogo p/ UI (categoria → grupos → itens)
//   COMORB_EFFECTS  → key → vetor de efeitos por dimensão fisiológica
//   COMORB_WAVES    → key → morfologia de onda associada (com prioridade)
//   COMORB_DIM_CAPS → tetos de saturação tanh por dimensão
//
// Edite aqui — não há lógica de motor neste arquivo.
//
// DIMENSÕES FISIOLÓGICAS (deltas em fração; somados, depois saturados via tanh):
//   contractility — afeta SV, CO, dPdt, RVEF, ScvO₂ (cap ±55%)
//   afterload     — afeta SVR, MAP, DAP, SAP (cap ±55%)
//   preload       — afeta CVP, EDV, SVV/PPV (inverso) (cap +70/-50%)
//   chronotropy   — afeta HR (cap ±45%)
//   pvr           — afeta PAP (cap +180%)
//   compliance    — afeta PP (SAP-DAP), Eadyn (cap ±50%)
//
// MORFOLOGIA DE ONDA (canal: arterial / cvp / pap / ecg / pleth):
//   waves: { canal: { p:'presetKey', prio:N } }
//   Em conflito entre comorbidades, maior `prio` vence.
//   Cenário sempre vence sobre comorbidade no canal que ele controla.
// =============================================================================

(function(global){
  'use strict';

  /* ============================================================================
     ESTRUTURA POR CATEGORIA / GRUPO / ITEM.
     Ordem aqui = ordem de exibição na UI.
     ============================================================================ */
  const STRUCTURE = {

    // ============================================================
    // 1. DOENÇAS CRÔNICAS COMUNS
    // ============================================================
    cronicas: {
      label: 'Doenças crônicas comuns',
      groups: [

        // ----- Cardiometabólicas / endócrinas -----
        { name: 'Cardiometabólicas / endócrinas', items: [
          { key:'has', lbl:'Hipertensão arterial sistêmica',
            effects: {afterload:+0.30, compliance:-0.25, lv_filling:+0.10},
            waves:   {ecg:{p:'hve', prio:5}, arterial:{p:'hipertensao', prio:10}},
            notes:   'SVR ↑ crônico (~1500), enrijecimento arterial → PP largo, HVE leve, MAP ~100, PAOP normal-alto.',
          },
          { key:'has_refrat', lbl:'HAS refratária / de difícil controle',
            effects: {afterload:+0.55, compliance:-0.40, contractility:-0.05, lv_filling:+0.30},
            waves:   {ecg:{p:'hve', prio:15}, arterial:{p:'hipertensao', prio:20}},
            notes:   'HAS resistente → SVR muito alta (~1700), HVE marcada com strain, MAP ~120, PAOP elevada (disfunção diastólica).',
          },
          { key:'dm1', lbl:'Diabetes mellitus tipo 1',
            effects: {compliance:-0.05, contractility:-0.05},
          },
          { key:'dm2', lbl:'Diabetes mellitus tipo 2',
            effects: {compliance:-0.08, contractility:-0.05, afterload:+0.05},
          },
          { key:'dm_complic', lbl:'DM com complicações (nefro/retino/neuro)',
            effects: {compliance:-0.15, contractility:-0.12, afterload:+0.10, pvr:+0.05},
            notes:   'Doença vascular disseminada; cardiopatia diabética subclínica.',
          },
          { key:'dislipidemia', lbl:'Dislipidemia',
            effects: {compliance:-0.05},
          },
          { key:'sindr_metab', lbl:'Síndrome metabólica',
            effects: {afterload:+0.10, compliance:-0.10},
          },
          { key:'hipotireo', lbl:'Hipotireoidismo',
            effects: {chronotropy:-0.30, contractility:-0.20, afterload:+0.20},
            notes:   'Bradicardia (~58), baixo CO de repouso (~4), SVR aumentada.',
          },
          { key:'hipertireo', lbl:'Hipertireoidismo',
            effects: {chronotropy:+0.45, contractility:+0.20, afterload:-0.20, compliance:+0.10},
            notes:   'Estado hiperdinâmico tireotóxico; HR ~110, CO ~7-8; risco aumentado de FA.',
          },
          { key:'insuf_adrenal', lbl:'Insuficiência adrenal / corticoide crônico',
            effects: {afterload:-0.40, contractility:-0.15, chronotropy:+0.20},
            notes:   'Hipotensão por baixa SVR; resposta atenuada a vasopressores; taqui compensatória.',
          },
          { key:'feo', lbl:'Feocromocitoma',
            effects: {afterload:+0.65, chronotropy:+0.40, contractility:+0.20},
            waves:   {arterial:{p:'hipertensao', prio:25}},
            notes:   'Excesso catecolaminérgico paroxístico; PAS 180-220, HR 110-130, MAP 130+.',
          },
        ]},

        // ----- Renais -----
        { name: 'Renais', items: [
          { key:'drc3', lbl:'DRC estágio 3 (TFG 30–59)',
            effects: {afterload:+0.10, preload:+0.10},
          },
          { key:'drc45', lbl:'DRC estágio 4–5 (TFG <30)',
            effects: {afterload:+0.30, preload:+0.40, lv_filling:+0.30, contractility:-0.10, chronotropy:+0.10},
            notes:   'HAS difícil controle, sobrecarga volêmica, anemia crônica, possível HVE com disfunção diastólica.',
          },
          { key:'drc_dialise', lbl:'DRC em hemodiálise',
            effects: {afterload:+0.25, preload:+0.10, lv_filling:+0.15, contractility:-0.15, chronotropy:+0.20},
            notes:   'Hiperdinâmico (anemia + fístula AV); volemia depende do timing pós-diálise; cardiomiopatia urêmica.',
          },
          { key:'aki', lbl:'Lesão renal aguda (AKI) atual',
            effects: {preload:+0.15},
          },
          { key:'tx_renal', lbl:'Transplante renal',
            effects: {afterload:+0.05},
          },
        ]},

        // ----- Hepáticas -----
        { name: 'Hepáticas', items: [
          { key:'cirrose_a', lbl:'Cirrose Child A',
            effects: {afterload:-0.20, chronotropy:+0.12, contractility:+0.20, compliance:+0.05},
            notes:   'Hiperdinâmico inicial: CO ~6 L/min, SVR ~1000, HR ~80, MAP ~85.',
            refs:    ['PMC1856081','AASLD core series'],
          },
          { key:'cirrose_b', lbl:'Cirrose Child B',
            effects: {afterload:-0.32, chronotropy:+0.20, contractility:+0.40, preload:+0.20, compliance:+0.12},
            notes:   'Hiperdinâmico moderado: CO ~6.7 L/min, SVR ~750, HR ~85, MAP ~80, PVC 6-12.',
            refs:    ['PMC1856081'],
          },
          { key:'cirrose_c', lbl:'Cirrose Child C',
            effects: {afterload:-0.50, chronotropy:+0.28, contractility:+0.60, preload:+0.40, compliance:+0.18},
            notes:   'Hiperdinâmico avançado: CO 7-9 L/min, SVR 600-800, HR 90-100, MAP ~80, PVC ~10. Cardiopatia cirrótica = resposta atenuada ao estresse.',
            refs:    ['PMC1856081','AASLD','PMC3003209'],
          },
          { key:'poph', lbl:'Hipertensão portopulmonar (POPH)',
            effects: {pvr:+0.80, preload:+0.15, contractility:-0.10, chronotropy:+0.05},
            waves:   {pap:{p:'hap_primaria', prio:55}},
            notes:   'mPAP >20, PVR ≥3 WU, PAWP ≤15. Sobrecarga VD atenua o estado hiperdinâmico cirrótico. 5-10% dos cirróticos.',
            refs:    ['PMC10365198'],
          },
          { key:'shp', lbl:'Síndrome hepatopulmonar (SHP)',
            effects: {chronotropy:+0.05, oxygenation:-0.25},
            notes:   'Defeito de oxigenação puro (PaO₂ ~60-75, A-a >15) por shunt intrapulmonar. NÃO eleva PAP — diferente de POPH. 5-32% dos cirróticos avançados.',
            refs:    ['NBK562169'],
          },
          { key:'hepatite_cr', lbl:'Hepatite crônica ativa',
            effects: {afterload:-0.05},
          },
        ]},

        // ----- Hábitos / históricos -----
        { name: 'Hábitos / históricos', items: [
          { key:'tabagismo', lbl:'Tabagismo ativo (>20 maços-ano)',
            effects: {pvr:+0.08, compliance:-0.05},
          },
          { key:'etilismo', lbl:'Etilismo crônico',
            effects: {contractility:-0.08},
            notes:   'Cardiomiopatia alcoólica subclínica.',
          },
          { key:'cocaina', lbl:'Uso de cocaína / drogas ilícitas',
            effects: {chronotropy:+0.30, afterload:+0.30, contractility:+0.15},
            notes:   'Estimulação simpática aguda: HR ↑↑, HAS, espasmo coronariano, IAM em jovens.',
          },
        ]},

        // ----- Hematológicas / coagulação -----
        { name: 'Hematológicas / coagulação', items: [
          { key:'anemia_cr', lbl:'Anemia crônica',
            effects: {chronotropy:+0.25, contractility:+0.15, afterload:-0.20, compliance:+0.10},
            notes:   'Estado hiperdinâmico para manter DO₂ com Hb baixa: HR ↑, CO ↑, SVR ↓, PP largo.',
          },
          { key:'plaquetop', lbl:'Plaquetopenia / coagulopatia',
            effects: {},
            notes:   'Sem impacto hemodinâmico direto; modulará farmacologia/sangramento.',
          },
          { key:'warfarin', lbl:'Anticoagulação crônica (warfarin)',
            effects: {},
          },
          { key:'doac', lbl:'Anticoagulação crônica (DOAC)',
            effects: {},
          },
          { key:'dapt', lbl:'Antiagregação dupla (AAS + clopidogrel)',
            effects: {},
          },
        ]},

        // ----- Neurológicas / outras -----
        { name: 'Neurológicas / outras', items: [
          { key:'avc_seq', lbl:'AVC prévio com sequela',
            effects: {},
          },
          { key:'parkinson', lbl:'Doença de Parkinson',
            effects: {afterload:-0.05},
            notes:   'Disautonomia leve; risco de hipotensão ortostática.',
          },
          { key:'miastenia', lbl:'Miastenia gravis',
            effects: {},
          },
          { key:'epilepsia', lbl:'Epilepsia',
            effects: {},
          },
        ]},
      ]
    },

    // ============================================================
    // 2. CARDIOPATIAS
    // ============================================================
    cardio: {
      label: 'Cardiopatias',
      groups: [

        // ----- Doença coronariana -----
        { name: 'Doença coronariana', items: [
          { key:'dac', lbl:'DAC sem IAM prévio',
            effects: {contractility:-0.05, compliance:-0.05},
          },
          { key:'iam_antigo', lbl:'IAM antigo (>30 dias)',
            effects: {contractility:-0.20, compliance:-0.10, preload:+0.10, lv_filling:+0.25, afterload:+0.10},
            waves:   {ecg:{p:'iam_infra', prio:15}},
            notes:   'Cicatriz miocárdica; pode ter Q persistente / strain residual; disfunção diastólica residual eleva PAOP levemente.',
          },
          { key:'iam_ve_recente', lbl:'IAM de VE recente (<30 dias)',
            effects: {contractility:-0.45, compliance:-0.20, preload:+0.30, lv_filling:+0.65, afterload:+0.30, chronotropy:+0.25},
            waves:   {ecg:{p:'iam_supra', prio:55}},
            notes:   'Anterior/lateral. Disfunção VE → CO ↓, PAOP ↑↑ (~22-26), CVP normal-↑, taqui + vasoconstrição compensatórias. Cuidado com volume (congestão pulmonar). Inotrópico/inodilatador (milrinona) ajuda. Risco de complicações mecânicas.',
          },
          { key:'iam_vd_recente', lbl:'IAM de VD recente (<30 dias)',
            effects: {contractility:-0.10, rv_contractility:-0.55, preload:+1.20, lv_filling:-0.20, afterload:+0.25, chronotropy:-0.20},
            waves:   {ecg:{p:'iam_supra', prio:55}, cvp:{p:'cannon_a', prio:30}},
            notes:   'Geralmente associado a IAM inferior. Disfunção VD isolada (contratilidade VE preservada) → CVP ↑↑ (~15-20), PAOP NORMAL-BAIXO (LV preload limitado), RVEF ↓↓ (~25%), CO ↓ (LV não recebe volume). **FLUID RESPONSIVE** (volume melhora — sustenta preload VE através do VD). BAV de 1-2-3º grau frequentes. EVITAR nitratos/diuréticos. Inotrópico VD (dobutamina/milrinona).',
          },
          { key:'iam_bi_recente', lbl:'IAM biventricular recente',
            effects: {contractility:-0.45, rv_contractility:-0.35, preload:+0.85, lv_filling:+0.45, afterload:+0.30, chronotropy:+0.15},
            waves:   {ecg:{p:'iam_supra', prio:55}},
            notes:   'IAM extenso comprometendo VE e VD. Choque misto: CVP e PAOP ambos elevados, RVEF ↓ (~30%), CO ↓↓. Pior prognóstico. Manejo difícil — balancear pré-carga VD (precisa volume) e pós-carga pulmonar. IABP/Impella/ECMO frequentemente.',
          },
          { key:'angina_est', lbl:'Angina estável',
            effects: {contractility:-0.05},
          },
          { key:'sca', lbl:'SCA / angina instável',
            effects: {contractility:-0.30, preload:+0.25, lv_filling:+0.40, afterload:+0.20, chronotropy:+0.20},
            waves:   {ecg:{p:'iam_supra', prio:50}},
          },
          { key:'crm', lbl:'CRM (revascularização) prévia',
            effects: {contractility:-0.05},
          },
          { key:'stent_dapt', lbl:'Stent farmacológico em DAPT (<12 meses)',
            effects: {contractility:-0.05},
          },
        ]},

        // ----- Disfunção / cardiomiopatias -----
        { name: 'Disfunção / cardiomiopatias', items: [
          { key:'icc_fer', lbl:'IC com FE reduzida (<40%)',
            effects: {contractility:-0.50, preload:+1.0, lv_filling:+1.0, afterload:+0.50, chronotropy:+0.30},
            waves:   {arterial:{p:'alternans', prio:45}},
            notes:   'CO baixo (~3.5), SVR alta (compensatória ~1700), CVP ↑↑ (~14), PAOP ↑↑ (~24), HR ↑ (~95). Congestão bilateral.',
          },
          { key:'icc_fei', lbl:'IC com FE intermediária (40–49%)',
            effects: {contractility:-0.30, preload:+0.50, lv_filling:+0.55, afterload:+0.30, chronotropy:+0.15},
          },
          { key:'icc_fep', lbl:'IC com FE preservada (≥50%)',
            effects: {preload:+0.65, lv_filling:+0.85, compliance:-0.30, chronotropy:+0.10, afterload:+0.15},
            notes:   'Disfunção DIASTÓLICA predominante: PAOP > CVP, ambos altos. DC normal-baixo. Frequente HAS associada.',
          },
          { key:'cmd', lbl:'Cardiomiopatia dilatada',
            effects: {contractility:-0.50, preload:+0.85, lv_filling:+0.85, chronotropy:+0.20, afterload:+0.30},
            waves:   {arterial:{p:'alternans', prio:30}},
          },
          { key:'cmho', lbl:'Cardiomiopatia hipertrófica obstrutiva (CMHO)',
            effects: {contractility:+0.05, preload:-0.30, lv_filling:+0.50, compliance:-0.55, afterload:+0.10},
            waves:   {arterial:{p:'bisferiens', prio:40}},
            notes:   'CO normal em repouso, dP/dt ↑↑ (alta P intraventricular), pulso bisferiens. **Descasamento clássico**: PAOP elevada (VE rígido) com CVP normal/baixa. Preload-sensível (volume melhora obstrução, inotrópico agrava, vasodilatador agrava).',
          },
          { key:'cm_restritiva', lbl:'Cardiomiopatia restritiva',
            effects: {contractility:-0.20, preload:+1.1, lv_filling:+1.1, compliance:-0.50},
            waves:   {cvp:{p:'constritiva', prio:50}},
            notes:   'Padrão M/W na CVP; PVC ~18-22 e PAOP ~22-28 (equalização das pressões diastólicas).',
          },
          { key:'miocardite', lbl:'Miocardite ativa',
            effects: {contractility:-0.40, chronotropy:+0.30, preload:+0.20, lv_filling:+0.40},
          },
          { key:'chagas', lbl:'Cardiopatia chagásica',
            effects: {contractility:-0.45, preload:+0.50, lv_filling:+0.55, chronotropy:-0.05},
            waves:   {ecg:{p:'bcre', prio:25}},
            notes:   'BCRD/BCRE clássicos, BAV em estágios avançados, dilatação VE marcada.',
          },
        ]},

        // ----- Valvopatias -----
        { name: 'Valvopatias', items: [
          { key:'eao_grave', lbl:'Estenose aórtica grave',
            effects: {contractility:-0.15, afterload:+0.20, compliance:-0.20, lv_filling:+0.35},
            waves:   {arterial:{p:'estenose_aortica', prio:55}},
            notes:   'Parvus et tardus, gradiente VE-Ao alto, PP estreito; dP/dt elevado; PAOP ↑ (HVE com disfunção diastólica).',
          },
          { key:'eao_moderada', lbl:'Estenose aórtica moderada',
            effects: {contractility:-0.05, afterload:+0.10, compliance:-0.10, lv_filling:+0.15},
            waves:   {arterial:{p:'estenose_aortica', prio:25}},
          },
          { key:'iao_grave', lbl:'Insuficiência aórtica grave',
            effects: {compliance:+0.50, preload:+0.50, lv_filling:+0.35, chronotropy:+0.20, contractility:+0.15},
            waves:   {arterial:{p:'insuf_aortica', prio:65}},
            notes:   'Water-hammer; PAS ↑ (~155), PAD ↓↓ (~45), PP enorme; VE dilatado mas compensado (PAOP moderadamente ↑).',
          },
          { key:'em_grave', lbl:'Estenose mitral grave',
            effects: {preload:-0.10, lv_filling:+1.30, pvr:+0.80, contractility:-0.30, chronotropy:+0.15, rv_contractility:-0.10},
            notes:   '**Descasamento clássico**: PAOP altíssima (~25-30, reflete pressão AE) com CVP normal-baixa (VD pode ainda estar OK). HAP secundária marcada (PAP ~40); CO reduzido por enchimento VE limitado (modelado via contractility, já que valva restringe inflow apesar da pressão AE alta).',
          },
          { key:'im_grave', lbl:'Insuficiência mitral grave',
            effects: {preload:+0.50, lv_filling:+0.85, contractility:-0.15, pvr:+0.40, chronotropy:+0.10},
            notes:   'PAOP com onda v gigante (~22-30), HAP secundária leve. Volume regurgitante eleva pressão AE de forma marcada na sístole.',
          },
          { key:'pvm', lbl:'Prolapso de valva mitral',
            effects: {},
            notes:   'Geralmente assintomático; sem impacto hemodinâmico.',
          },
          { key:'it_grave', lbl:'Insuficiência tricúspide grave',
            effects: {preload:+0.85, rv_contractility:-0.30, contractility:-0.05, chronotropy:+0.15},
            waves:   {cvp:{p:'v_gigante_TR', prio:55}},
            notes:   'Onda v gigante na CVP (PVC ~18-22), x descent obliterada; RVEF reduzida (sobrecarga crônica). CO reduzido (forward flow ↓ pelo VD ineficiente).',
          },
          { key:'protese_mec', lbl:'Prótese valvar mecânica',
            effects: {chronotropy:+0.05},
          },
          { key:'protese_bio', lbl:'Prótese valvar biológica',
            effects: {},
          },
        ]},

        // ----- Arritmias / condução -----
        { name: 'Arritmias / condução', items: [
          { key:'fa_cronica', lbl:'Fibrilação atrial crônica',
            effects: {chronotropy:+0.20, contractility:-0.15, preload:+0.10},
            waves:   {ecg:{p:'fa', prio:30}, arterial:{p:'fa', prio:20}, cvp:{p:'fa', prio:20}},
            notes:   'Sem onda a, RR irregular, perda do kick atrial. SVV/PPV não interpretáveis.',
          },
          { key:'flutter', lbl:'Flutter atrial',
            effects: {chronotropy:+0.10},
            waves:   {ecg:{p:'flutter', prio:35}},
          },
          { key:'bav1', lbl:'BAV de 1º grau',
            effects: {},
            waves:   {ecg:{p:'bav1', prio:15}},
          },
          { key:'bav2', lbl:'BAV de 2º grau',
            effects: {chronotropy:-0.10},
            waves:   {ecg:{p:'bav2_mobitz2', prio:40}},
          },
          { key:'bavt', lbl:'BAV total (BAVT)',
            effects: {chronotropy:-0.85, contractility:-0.40, afterload:+0.20},
            waves:   {ecg:{p:'bav3', prio:60}, cvp:{p:'cannon_a', prio:50}},
            notes:   'Dissociação AV; HR ~30-40 (escape ventricular), CO reduzido (DC ~3 L/min). Modelagem aproximada — engine não acopla DC a HR×VS, então usamos contractility neg pra puxar CO; VS real está aumentado por ↑tempo de enchimento.',
          },
          { key:'mp', lbl:'Marcapasso definitivo',
            effects: {},
            waves:   {ecg:{p:'pacemaker', prio:55}},
          },
          { key:'cdi', lbl:'CDI implantado',
            effects: {},
            notes:   'Sem repercussão visível em repouso (até choque).',
          },
          { key:'wpw', lbl:'WPW / pré-excitação',
            effects: {},
            waves:   {ecg:{p:'wpw', prio:25}},
          },
          { key:'tv_msc', lbl:'TV / morte súbita reanimada',
            effects: {},
            notes:   'Marca contexto / cuidado com pró-arrítmicos.',
          },
        ]},

        // ----- Pericárdio / vasculares -----
        { name: 'Pericárdio / vasculares', items: [
          { key:'peri_constr', lbl:'Pericardite constritiva',
            effects: {preload:+1.20, lv_filling:+1.20, contractility:-0.15, compliance:-0.40, chronotropy:+0.20},
            waves:   {cvp:{p:'constritiva', prio:60}},
            notes:   'EQUALIZAÇÃO das pressões diastólicas (CVP ≈ PAOP ≈ PADd, todas ~18-22), sinal de Kussmaul (CVP sobe na inspiração), taqui compensatória.',
          },
          { key:'derrame_peri', lbl:'Derrame pericárdico crônico',
            effects: {preload:+0.40, lv_filling:+0.30, chronotropy:+0.10},
          },
          { key:'aneur_aorta', lbl:'Aneurisma de aorta',
            effects: {afterload:+0.15, compliance:+0.10},
          },
          { key:'dissec_prev', lbl:'Dissecção aórtica prévia',
            effects: {afterload:+0.15, compliance:-0.05},
          },
          { key:'hap', lbl:'Hipertensão pulmonar (HAP)',
            effects: {pvr:+1.5, preload:+0.50, rv_contractility:-0.30, contractility:-0.05, chronotropy:+0.20},
            waves:   {pap:{p:'hap_primaria', prio:50}},
            notes:   'PAP ~30-50, PVC ↑, RVEF reduzida (sobrecarga crônica VD). CO levemente reduzido por limitação VD.',
          },
          { key:'tep_cronico', lbl:'TEP crônico (HP tromboembólica)',
            effects: {pvr:+1.20, preload:+0.40, rv_contractility:-0.25, contractility:-0.05, chronotropy:+0.15},
            waves:   {pap:{p:'hap_primaria', prio:45}},
          },
          { key:'endocardite', lbl:'Endocardite infecciosa ativa',
            effects: {contractility:-0.15, chronotropy:+0.30, afterload:-0.20, permeability:+0.20},
            notes:   'Febre, taquicardia, vasodilatação periférica; bacteremia + dano vascular leve; pode ter regurgitação valvar aguda.',
          },
        ]},

        // ----- Congênitas (adulto) -----
        { name: 'Congênitas (adulto)', items: [
          { key:'cia', lbl:'CIA não corrigida',
            effects: {pvr:+0.20, preload:+0.10},
            notes:   'Shunt E→D, sobrecarga VD.',
          },
          { key:'civ', lbl:'CIV não corrigida',
            effects: {pvr:+0.15, preload:+0.10},
          },
          { key:'fallot_corr', lbl:'Tetralogia de Fallot corrigida',
            effects: {contractility:-0.10},
          },
          { key:'coarct_corr', lbl:'Coarctação de aorta corrigida',
            effects: {afterload:+0.10},
            notes:   'HAS persistente é comum.',
          },
        ]},
      ]
    },

    // ============================================================
    // 3. DOENÇAS RESPIRATÓRIAS
    // ============================================================
    resp: {
      label: 'Doenças respiratórias',
      groups: [

        // ----- Obstrutivas -----
        { name: 'Obstrutivas', items: [
          { key:'asma_leve', lbl:'Asma leve / intermitente',
            effects: {},
          },
          { key:'asma_mod', lbl:'Asma moderada',
            effects: {pvr:+0.05},
          },
          { key:'asma_grave', lbl:'Asma grave / mal controlada',
            effects: {pvr:+0.15, chronotropy:+0.10, oxygenation:-0.10},
          },
          { key:'dpoc_12', lbl:'DPOC GOLD 1–2 (leve a moderado)',
            effects: {pvr:+0.10},
          },
          { key:'dpoc_34', lbl:'DPOC GOLD 3–4 (grave a muito grave)',
            effects: {pvr:+0.55, chronotropy:+0.15, preload:+0.20, oxygenation:-0.10},
            waves:   {pap:{p:'hap_primaria', prio:30}},
            notes:   'PAP ~25-35 leve; sinais incipientes de sobrecarga VD; hipoxemia leve (PaO₂ ~70-85).',
          },
          { key:'dpoc_corpulm', lbl:'DPOC com cor pulmonale',
            effects: {pvr:+1.50, preload:+0.80, rv_contractility:-0.35, contractility:-0.05, chronotropy:+0.25, oxygenation:-0.20},
            waves:   {pap:{p:'hap_primaria', prio:50}},
            notes:   'VD sobrecarregado e disfuncional; PAP ~30-50, PVC ~15-22, RVEF ↓↓ (~25-35%); HAP secundária à hipoxemia crônica (PaO₂ ~55-65). VE preservado.',
          },
          { key:'bronquiec', lbl:'Bronquiectasias',
            effects: {pvr:+0.10},
          },
          { key:'fc', lbl:'Fibrose cística',
            effects: {pvr:+0.20},
          },
        ]},

        // ----- Restritivas -----
        { name: 'Restritivas', items: [
          { key:'fpi', lbl:'Fibrose pulmonar idiopática',
            effects: {pvr:+0.50, chronotropy:+0.20, preload:+0.20, oxygenation:-0.20},
            waves:   {pap:{p:'hap_primaria', prio:25}},
            notes:   'Restrição grave; PAP ~20-32, hipoxemia (PaO₂ ~55-75), taqui em repouso por hipoxemia.',
          },
          { key:'dpi', lbl:'Doença pulmonar intersticial',
            effects: {pvr:+0.35, chronotropy:+0.10, oxygenation:-0.10},
            waves:   {pap:{p:'hap_primaria', prio:20}},
          },
          { key:'tb_seq', lbl:'Sequela de tuberculose',
            effects: {pvr:+0.10},
          },
          { key:'cifoescoli', lbl:'Cifoescoliose grave',
            effects: {pvr:+0.20},
          },
          { key:'soh', lbl:'Síndrome obesidade-hipoventilação',
            effects: {pvr:+0.55, preload:+0.30, chronotropy:+0.15, afterload:+0.20, oxygenation:-0.15},
            waves:   {pap:{p:'hap_primaria', prio:25}},
            notes:   'Hipóxia + hipercapnia crônicas (PaO₂ ~60-75); HAP secundária + HAS associada; PAP ~22-35.',
          },
        ]},

        // ----- Apneia do sono -----
        { name: 'Apneia do sono', items: [
          { key:'saos_leve', lbl:'SAOS leve',
            effects: {pvr:+0.05, afterload:+0.05},
          },
          { key:'saos_mod', lbl:'SAOS moderada',
            effects: {pvr:+0.10, afterload:+0.10},
          },
          { key:'saos_grave', lbl:'SAOS grave / em CPAP',
            effects: {pvr:+0.40, afterload:+0.25, chronotropy:+0.10, preload:+0.10},
            notes:   'SAOS grave: HAS quase sempre, HAP leve, sobrecarga VD inicial.',
          },
        ]},

        // ----- Vasculares pulmonares -----
        { name: 'Vasculares pulmonares', items: [
          { key:'hap_prim', lbl:'HAP primária / idiopática',
            effects: {pvr:+2.5, preload:+1.5, rv_contractility:-0.55, contractility:-0.05, chronotropy:+0.30},
            waves:   {pap:{p:'hap_primaria', prio:60}},
            notes:   'HAP severa: PAP m 45-80, PVR ↑↑, RVEF ↓↓ (15-30%), CO baixo (~3), PVC ↑↑ (~18). Falência VD com VE preservado (mas sub-cargado por falha de transferência).',
          },
          { key:'hap_sec', lbl:'HAP secundária',
            effects: {pvr:+1.50, preload:+0.40, lv_filling:+0.50, rv_contractility:-0.30, contractility:-0.05, chronotropy:+0.15},
            waves:   {pap:{p:'hap_primaria', prio:55}},
            notes:   'Quando secundária a IC esquerda (grupo 2): pós-capilar, PAOP elevada (>15). Discrimina de HAP primária pré-capilar.',
          },
          { key:'tep_agudo', lbl:'TEP agudo',
            effects: {pvr:+2.0, preload:+0.30, rv_contractility:-0.55, contractility:-0.05, chronotropy:+0.45, afterload:+0.20, permeability:+0.20},
            waves:   {pap:{p:'tep_agudo', prio:70}},
            notes:   'PAP eleva agudamente (m 28-40), trace afilado/spiky — distinto da HAP crônica. Falência VD aguda (RVEF ~20%); VE preservado. Taquicardia marcada, vasoconstrição compensatória sistêmica.',
          },
        ]},

        // ----- Agudas / sequelas -----
        { name: 'Agudas / sequelas', items: [
          { key:'pneumonia', lbl:'Pneumonia',
            effects: {chronotropy:+0.25, pvr:+0.15, afterload:-0.10, contractility:+0.05, permeability:+0.30, oxygenation:-0.15},
            notes:   'Estado pré-séptico em casos graves: hiperdinâmico, taqui, vasodilatação leve, EVLW levemente ↑, hipoxemia leve a moderada.',
          },
          { key:'sdra', lbl:'SDRA / SARA',
            effects: {pvr:+0.80, chronotropy:+0.30, contractility:-0.05, permeability:+2.5, oxygenation:-0.40},
            waves:   {pap:{p:'hap_primaria', prio:35}},
            notes:   'Edema de permeabilidade (não cardiogênico): EVLW 15-30, PVPI >3 (defining feature). PaO₂/FiO₂ <300 (Berlin). PAP elevada (vasoconstrição hipóxica + edema); taqui marcada.',
          },
          { key:'covid_seq', lbl:'COVID-19 — sequela pulmonar',
            effects: {pvr:+0.10},
          },
          { key:'pneumotorax', lbl:'Pneumotórax recente',
            effects: {preload:-0.10, oxygenation:-0.15},
          },
          { key:'derrame_pleur', lbl:'Derrame pleural',
            effects: {pvr:+0.05},
          },
          { key:'traqueost', lbl:'Traqueostomia',
            effects: {},
          },
        ]},
      ]
    },
  };

  /* ============================================================================
     CAPS DE SATURAÇÃO POR DIMENSÃO FISIOLÓGICA.
     Empilhar várias comorbidades na mesma dimensão satura via tanh —
     o efeito efetivo nunca passa do cap, evita acúmulo ilimitado.
     ============================================================================ */
  const DIM_CAPS = {
    contractility:    0.55, // contratilidade VE (afeta SV/CO/dPdt/SAP/DAP — lado sistêmico)
    rv_contractility: 0.55, // contratilidade VD (afeta RVEF/EDV/CO via "starvation" do VE)
    afterload:        0.85, // sepse pode despencar ~50%; HAS+IC compensatória puxa pra cima
    preload:          1.50, // pré-carga VD / congestão sistêmica (CVP, retorno venoso)
    lv_filling:       1.50, // pressão de enchimento VE (PAOP) — pode divergir de preload
                            // (ex: EM grave tem lv_filling ↑↑ com preload ↓; HAP isolada o oposto)
    chronotropy:      0.65, // BAVT cai pra ~30; sepse/feo/hipertireo sobe pra ~130
    pvr:              4.0,  // HAP grave pode quintuplicar PAP
    compliance:       0.50,
    permeability:     2.0,  // SDRA, anafilaxia, sepse pulmonar — dano endotelial/capilar.
                            // 0 em comorbidades crônicas compensadas (EVLW só sobe em cenário agudo).
    oxygenation:      0.45, // hipoxemia: SHP, SDRA, pneumonia, DPOC severo, TEP. NEGATIVO reduz PaO₂/SaO₂.
                            // ±45% permite PaO₂ ~52 em SDRA grave (real ~50-60) e ~95 normal.
  };

  /* ============================================================================
     DERIVAÇÃO — gera os mapas que o engine consome a partir do STRUCTURE único.
     ============================================================================ */
  function buildEffects(structure){
    const out = {};
    for(const catKey in structure){
      for(const grp of structure[catKey].groups){
        for(const it of grp.items){
          out[it.key] = it.effects || {};
        }
      }
    }
    return out;
  }
  function buildWaves(structure){
    const out = {};
    for(const catKey in structure){
      for(const grp of structure[catKey].groups){
        for(const it of grp.items){
          if(it.waves && Object.keys(it.waves).length){
            out[it.key] = it.waves;
          }
        }
      }
    }
    return out;
  }

  // Engine espera COMORBIDITIES no formato { catKey: { label, groups:[{name, items:[{key,lbl,...}]}] } }.
  // Campos extras (effects/waves/notes/refs) nos items são ignorados pela UI — passam inertes.
  global.COMORBIDITIES   = STRUCTURE;
  global.COMORB_EFFECTS  = buildEffects(STRUCTURE);
  global.COMORB_WAVES    = buildWaves(STRUCTURE);
  global.COMORB_DIM_CAPS = DIM_CAPS;

})(typeof window !== 'undefined' ? window : globalThis);
