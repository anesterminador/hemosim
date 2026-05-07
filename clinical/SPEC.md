# Manual Clínico das Comorbidades — Simulador Hemosphere

**Propósito:** referência clínica única para o que cada comorbidade deve produzir no simulador (números, curvas, contexto). É o "spec sheet" usado pra revisar e calibrar `clinical/comorbidities.js`.

**Convenções:**

- **Faixas, não valores únicos**: cada variável é registrada como faixa típica em paciente compensado, com nota se descompensado/grave muda muito.
- **Adulto típico** assumido: ~70 kg, ~1,7 m, BSA ~1,8 m², Hb 12–14 g/dL, sem co-medicação, em repouso, com sensores acoplados (Swan-Ganz CCO + arterial + ScvO₂ + StO₂). Quando o paciente típico da comorbidade fugir disso, anoto.
- **Paciente compensado em repouso**: o número descreve o estado basal, não a crise aguda. Cenário clínico ("Choque cardiogênico", "Crise hipertensiva") fica responsável pela superposição aguda.
- **Saturação no engine**: empilhar comorbidades pelas dimensões nunca passa do cap; números aqui descrevem a comorbidade SOZINHA num paciente sem outras.
- **Status**: ✅ revisado · 🔧 inicial (pode estar inacurado) · ⏳ pendente

---

## Glossário de variáveis

**Hemodinâmica**: FC (freq. cardíaca, bpm) · PAS/PAD/PAM (pressões, mmHg) · DC (débito cardíaco, L/min) · IC (índice cardíaco, L/min/m²) · VS / SV (volume sistólico, mL) · ISVS / SVI (índice de VS, mL/m²) · RVS (resistência vascular sistêmica, dyn·s·cm⁻⁵) · IRVS (idem indexada).

**Pressões venosas e pulmonares**: PVC (mmHg) · PAP (s/d/m, mmHg) · PAOP/PAWP (pressão de oclusão pulmonar / wedge, mmHg) · PVR / IRVP (resistência vascular pulmonar; WU ou dyn·s·cm⁻⁵).

**Volumes (Swan-Ganz CCO)**: EDV / EDVI (volume diastólico final do VD; mL e mL/m²) · RVEF (fração de ejeção do VD, %).

**Volumes (VolumeView/PiCCO transpulmonar)**: GEDV/GEDI (global end-diastolic volume; mL e mL/m²; "pré-carga global") · ITBV/ITBVI (intrathoracic blood volume) · EVLW/EVLWI (extravascular lung water — edema pulmonar) · PVPI (pulmonary vascular permeability index — discrimina edema cardiogênico vs. inflamatório) · CFI (cardiac function index, /min) · GEF (global ejection fraction, %).

**Variabilidade respiratória (preload responsiveness)**: VVS / SVV (stroke volume variation, %) · ΔPP / PPV (pulse pressure variation, %) · ΔPOP / PVI (pleth variability index, %).

**Acumen IQ / contratilidade**: HPI (hypotension prediction index, 0–100) · dP/dt (derivada da curva arterial; surrogate de contratilidade VE; mmHg/s) · Eadyn (elastância arterial dinâmica = PPV/SVV; prediz resposta a vasopressor).

**Oximetria**: ScvO₂ (saturação venosa central, %) · StO₂ (saturação tecidual cerebral/somática por NIRS, %) · SpO₂ (periférica, %) · PaO₂ (arterial, mmHg) · A-aO₂ (gradiente alvéolo-arterial).

**Morfologia das ondas** (5 canais possíveis): **ECG** (ritmo, ST/T, QRS) · **Arterial** (sistêmica) · **CVP** (pressão venosa central, ondas a/c/x/v/y) · **PAP** (pressão arterial pulmonar) · **Pleth** (curva pletismográfica).

**Faixas normais (paciente saudável)**:

| Variável | Normal |
|---|---|
| FC | 60–80 |
| PAS / PAD / PAM | 110–130 / 70–85 / 85–95 |
| DC / IC | 4.5–6.5 / 2.5–4.0 |
| VS / SVI | 60–90 / 35–50 |
| RVS / IRVS | 900–1300 / 1700–2400 |
| PVC | 2–8 |
| PAP m / PAOP | 10–18 / 6–12 |
| PVR | <2 WU (<200 dyn·s·cm⁻⁵) |
| EDV / EDVI | 80–160 / 60–100 |
| RVEF | 40–60% |
| GEDV / GEDI | 680–800 / 680–800 |
| ITBV / ITBVI | 850–1000 / 850–1000 |
| EVLW / EVLWI | <10 / 3–7 |
| PVPI | 1–3 |
| CFI | 4.5–6.5 |
| GEF | 25–35% |
| SVV / PPV | <13% (preload-responsivo se ≥13%) |
| PVI | <14% |
| HPI | <50 (≥85 = alerta) |
| dP/dt | 800–1200 |
| Eadyn | 0.7–1.0 |
| ScvO₂ | 70–75% |
| StO₂ | 60–80% |
| SpO₂ / PaO₂ | 96–100% / 80–100 |

---

## Sumário

### 1. Cardiopatias
- 1.1 [Doença coronariana](#11-doenca-coronariana)
- 1.2 [Disfunção / cardiomiopatias](#12-disfuncao--cardiomiopatias)
- 1.3 [Valvopatias](#13-valvopatias)
- 1.4 [Arritmias / condução](#14-arritmias--conducao)
- 1.5 [Pericárdio / vasculares](#15-pericardio--vasculares)
- 1.6 [Congênitas (adulto)](#16-congenitas-adulto)

### 2. Doenças crônicas comuns ⏳ *pendente*
- 2.1 Cardiometabólicas / endócrinas
- 2.2 Renais
- 2.3 Hepáticas (cirrose já tem dados em comorbidities.js — vai virar prioridade)
- 2.4 Hábitos / históricos
- 2.5 Hematológicas / coagulação
- 2.6 Neurológicas

### 3. Doenças respiratórias ⏳ *pendente*
- 3.1 Obstrutivas
- 3.2 Restritivas
- 3.3 Apneia do sono
- 3.4 Vasculares pulmonares
- 3.5 Agudas / sequelas

---

# 1. Cardiopatias

## 1.1 Doença coronariana

### DAC sem IAM prévio 🔧
- **Etiologia**: aterosclerose coronariana com >50% estenose mas sem evento agudo.
- **Compensação**: VE com função preservada; isquemia eventual sob estresse.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 60–80 | Normal em repouso |
| PAS / PAD / PAM | 110–135 / 70–85 / 85–98 | Frequente HAS associada |
| DC / IC | 4.5–6.0 / 2.5–3.5 | Normal em repouso |
| VS / SVI | 60–85 / 35–48 | Normal |
| RVS | 1000–1400 | Normal |
| PVC | 2–8 | |
| PAP m / PAOP | 10–18 / 6–12 | |
| EDV / RVEF | 80–140 / 40–55% | |
| SVV / PPV | <13% | |
| dP/dt | 750–1100 | Levemente reduzido |
| Eadyn | 0.7–1.0 | |
| HPI | <50 | |
| ScvO₂ / StO₂ | 68–74% / 58–75% | |

**Morfologia**: ECG em repouso geralmente NORMAL (alterações isquêmicas só sob estresse). Pode ter onda Q de IAM silencioso. Demais canais normais.

**Notas clínicas**: risco de isquemia perioperatória; sensibilidade β-bloqueador. Resposta a inotrópicos preservada; resposta a vasodilatador (NTG) pode reduzir gradiente coronariano benéfico.

---

### IAM antigo (>30 dias) 🔧
- **Etiologia**: cicatriz miocárdica pós-infarto.
- **Compensação**: remodelamento; pode ter área aquinética/disquinética; FE preservada ou reduzida.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 65–85 | |
| PAS / PAD / PAM | 105–125 / 65–80 / 80–95 | |
| DC / IC | 3.8–5.5 / 2.2–3.2 | Levemente reduzido |
| VS / SVI | 50–75 / 28–42 | |
| RVS | 1100–1500 | Levemente aumentado |
| PVC | 4–10 | Levemente elevada |
| PAP m / PAOP | 12–20 / 8–15 | |
| EDV / RVEF | 100–160 / 35–50% | Dilatação leve |
| GEF | 20–30% | |
| SVV / PPV | <13% | |
| dP/dt | 600–900 | Reduzido pela cicatriz |
| Eadyn | 0.7–0.9 | |
| HPI | 30–60 | |
| ScvO₂ | 65–72% | |

**Morfologia**: ECG com **ondas Q persistentes** ou **infradesnivelamento de ST tipo strain** (preset `iam_infra` no simulador). Inversão de T na parede afetada. Demais canais normais ou levemente alterados.

**Notas**: risco aumentado de arritmia ventricular. Tolera mal taquicardia (aumento de MVO₂). NTG benéfico em isquemia de demanda.

---

### IAM de VE recente (<30 dias) 🔧
- **Etiologia**: infarto anterior, lateral ou anterolateral nas últimas 4 semanas.
- **Compensação**: parede aquinética/discinética VE; PAOP elevada; vasoconstrição compensatória.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–110 | Taquicardia compensatória |
| PAS / PAD / PAM | 95–120 / 60–80 / 75–93 | Pode cair em complicações mecânicas |
| DC / IC | 3.0–4.5 / 1.7–2.6 | Reduzido |
| VS / SVI | 40–60 / 22–35 | Reduzido |
| RVS | 1300–1800 | Vasoconstrição reflexa |
| PVC | 6–12 | Levemente elevada |
| **PAOP** | **22–28** | **Marcadamente elevada** (LV congestão) |
| PAP m | 22–32 | Elevada secundária à PAOP alta |
| EDV / RVEF | 100–160 / 35–45% | Dilatação VE; VD geralmente preservado |
| GEDV/GEDI | aumentado (~850–1050) | Dilatação assimétrica |
| EVLW/EVLWI | 6–10 | Sobe se PAOP cruza threshold (~18) |
| CFI / GEF | 3.0–4.0 / 18–25% | Reduzido |
| SVV / PPV | 5–10% | Volume-irresponsivo (Frank-Starling no platô VE) |
| dP/dt | 400–700 | Marcadamente reduzido |
| Eadyn | 0.6–0.8 | Limitada responsividade |
| HPI | 50–85 | Alto risco de hipotensão |
| ScvO₂ / StO₂ | 55–65% / 50–65% | Extração ↑ |

**Morfologia**: ECG com **supra de ST** (preset `iam_supra`) — V1–V4 anterior, V5–V6 + DI–aVL lateral. Inversão de T após reperfusão. Arterial pode mostrar pulso reduzido. CVP com componentes preservados.

**Notas clínicas**: **CUIDADO COM VOLUME** (piora congestão pulmonar — paciente já está com PAOP alta). Vasopressor: noradrenalina baixa dose. Inotrópico/inodilatador (milrinona, levosimendana) ajuda — aumenta CO sem aumentar MVO₂ tanto. Diuréticos se sinais de edema. IABP em choque cardiogênico.

**Refs**: ACC/AHA STEMI 2022 guidelines.

---

### IAM de VD recente (<30 dias) 🔧
- **Etiologia**: geralmente associado a IAM inferior (oclusão proximal de coronária direita); raro isolado.
- **Compensação**: VD aquinético → falha de bomba direita; LV preload limitado pela falha de transferência via pulmão. **VE preservado, é só o VD que falhou.**

| Variável | Faixa | Notas |
|---|---|---|
| FC | 50–75 | **Bradi/BAV frequentes** (eixo nodal afetado em IAM inferior) |
| PAS / PAD / PAM | 90–115 / 55–75 / 70–88 | Pode cair em hipovolemia relativa |
| DC / IC | 3.5–4.8 / 2.0–2.7 | Reduzido (LV não recebe volume suficiente do VD) |
| VS / SVI | 50–75 / 28–42 | Reduzido moderadamente |
| RVS | 1100–1500 | Vasoconstrição leve |
| **PVC** | **15–22** | **Marcadamente elevada** (VD falhando, retorno venoso represado) |
| **PAOP** | **5–10** | **NORMAL ou BAIXA** (LV preload limitado) |
| PAP m | 14–22 | Pode estar normal ou levemente ↑ |
| EDV / RVEF | aumentado / **20–35%** | **Disfunção VD marcada** |
| GEDV/GEDI | normal-↑ | |
| EVLW/EVLWI | normal (3–7) | **Não há edema pulmonar** (VE OK) |
| SVV / PPV | 13–25% | **Preload-responsivo** (paradoxo!) |
| dP/dt | 600–900 | VE preservado |
| ScvO₂ | 55–65% | Reduzido por baixo CO |

**Morfologia**: ECG **supra de ST inferior** (II, III, aVF — preset `iam_supra`); supra em V4R confirma envolvimento VD (não modelado no sim). **CVP** com **onda a-cannon ocasional** se BAV (preset `cannon_a`); descida x e y proeminentes (similar a constrição). Arterial pulso amplo se BAV.

**Notas clínicas**: **PARADOXO**: este paciente é **fluid-responsive**! Volume MELHORA o quadro porque sustenta o preload VE através do VD dependente. **EVITAR**: nitratos, diuréticos, morfina (todos reduzem pré-carga VD → colapso). Inotrópico VD: dobutamina, milrinona, levosimendana. Manter ritmo sinusal (cardioversão imediata se FA — perda do kick atrial é crítica). NO inalado se PVR alta. Marcapasso se BAVT.

**Refs**: ACC/AHA STEMI 2022; Goldstein JA — RV infarction review.

---

### IAM biventricular recente 🔧
- **Etiologia**: IAM extenso (anterior maciço + envolvimento VD, ou múltiplos territórios) ou IAM inferior + envolvimento septal/lateral.
- **Compensação**: ambos ventrículos comprometidos — **choque misto** com pressões de enchimento bilateralmente elevadas. Pior prognóstico.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 90–115 | Taquicardia compensatória |
| PAS / PAD / PAM | 80–105 / 50–70 / 65–82 | Hipotensão frequente |
| DC / IC | 2.0–3.5 / 1.1–2.0 | **Marcadamente reduzido** |
| VS / SVI | 30–50 / 17–28 | |
| RVS | 1200–1700 | Vasoconstrição |
| **PVC** | **12–18** | Elevada (componente VD) |
| **PAOP** | **20–26** | Elevada (componente VE) |
| PAP m | 25–38 | Elevada |
| EDV / RVEF | aumentado / 20–35% | Ambos ventrículos disfuncionais |
| EVLW/EVLWI | 7–12 | Edema pulmonar leve a moderado |
| dP/dt | 350–600 | Muito reduzido |
| HPI | 70–95 | Risco crítico |
| ScvO₂ | 50–60% | Hipoperfusão sistêmica |

**Morfologia**: ECG supra ST extenso (anterior + inferior ou septal). Múltiplos bloqueios possíveis.

**Notas clínicas**: **Manejo difícil** — equilibrar volume (precisa pra VD) sem sobrecarregar VE. Inotrópico bilateral (milrinona, levosimendana). **IABP/Impella/ECMO** em choque refratário. Mortalidade alta.

**Refs**: ACC/AHA STEMI 2022; Hochman JS — cardiogenic shock review.

---

### Angina estável 🔧
- **Etiologia**: DAC obstrutiva com isquemia previsível ao esforço, sem alteração em repouso.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 65–80 | Normal em repouso |
| PAS / PAD / PAM | 115–135 / 70–85 / 88–98 | Frequente HAS |
| DC / IC | 4.5–6.0 / 2.5–3.5 | Normal |
| RVS | 1000–1400 | |
| dP/dt | 750–1050 | Levemente reduzido |
| Demais | dentro da normalidade | |

**Morfologia**: ECG em repouso normal (achados aparecem só em teste de esforço).

**Notas**: nitrato sublingual alivia isquemia aguda; β-bloqueador profilático.

---

### SCA / angina instável 🔧
- **Etiologia**: ruptura de placa coronariana com sintomas em repouso ou crescente; sem necrose extensa estabelecida.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–100 | Variável; simpático ↑ |
| PAS / PAD / PAM | 100–135 / 60–85 / 78–95 | Pode estar alta (estresse) ou baixa (choque iminente) |
| DC / IC | 3.5–5.0 / 2.0–2.9 | Reduzido |
| VS / SVI | 45–70 / 26–40 | |
| RVS | 1200–1600 | Vasoconstrição |
| PVC | 5–12 | Elevada |
| PAP m / PAOP | 14–24 / 10–18 | |
| EDV / RVEF | 90–150 / 35–50% | |
| dP/dt | 500–800 | Reduzido |
| Eadyn | 0.6–0.9 | |
| HPI | 40–75 | |
| ScvO₂ | 60–70% | |

**Morfologia**: ECG com **infra de ST e/ou T invertida** (preset `iam_infra`) durante a dor. Pode normalizar em repouso. Alteração dinâmica é a regra.

**Notas**: contraindica inotrópico (aumento de MVO₂). Manter MAP 75–85 (perfusão coronariana sem hiperestímulo). Heparinização e DAPT comum — afetam abordagem cirúrgica.

---

### CRM (revascularização) prévia 🔧
- **Etiologia**: pacientes pós-bypass coronariano; geralmente FE preservada ou levemente reduzida; pode ter dor de coto esternal.

| Variável | Faixa | Notas |
|---|---|---|
| Demais | semelhantes a DAC sem IAM | Cicatriz cirúrgica não muda hemodinâmica em repouso |
| RVEF | 40–55% | Geralmente preservada |
| dP/dt | 700–1000 | Levemente reduzido |

**Morfologia**: ECG com possíveis bloqueios pós-cirúrgicos (BCRD comum); ondas Q residuais se IAM prévio.

**Notas**: pode ter ponte mamária, pontes safena. Fluxo colateral preservado em geral.

---

### Stent farmacológico em DAPT (<12 meses) 🔧
- **Etiologia**: implante recente com DAPT (AAS + clopidogrel/ticagrelor/prasugrel).

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | dentro da normalidade ou semelhante a DAC | DAPT não muda hemodinâmica |
| Sangramento | risco aumentado | Suspensão de DAPT eleva trombose intra-stent |

**Morfologia**: sem alterações específicas.

**Notas**: não é um fenótipo hemodinâmico, mas é contexto cirúrgico crítico. Modula farmacologia e sangramento. Suspensão de DAPT perto de cirurgia é decisão de risco.

---

## 1.2 Disfunção / cardiomiopatias

### IC com FE reduzida (<40%) 🔧
- **Etiologia**: pós-IAM extenso, CMD idiopática, chagásica avançada, miocardite cicatricial.
- **Compensação**: vasoconstrição reflexa + taquicardia + retenção volêmica. PAM preservada inicialmente, cai em descompensação.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–110 | Taquicardia compensatória |
| PAS / PAD / PAM | 95–115 / 60–80 / 75–90 | <70 se descompensada/cardiogênico |
| DC / IC | 2.5–3.8 / 1.4–2.0 | Marcadamente reduzido |
| VS / SVI | 35–55 / 20–32 | |
| RVS | 1400–2000 | Vasoconstricção compensatória |
| PVC | 10–18 | Congestão direita |
| PAP m / PAOP | 22–35 / 18–28 | HAP secundária leve, P enchimento VE alta |
| PVR | 200–400 | Levemente ↑ |
| EDV / EDVI | aumentado (>180/>110) | Dilatação |
| RVEF | 25–40% | Reduzido |
| GEDV / GEDI | aumentado (>900) | Sobrecarga volêmica |
| ITBV/ITBVI | aumentado | |
| EVLW/EVLWI | normal-↑ (10–15) | ↑ em descompensação |
| CFI | <3.5 | |
| GEF | <20% | Reduzido |
| SVV / PPV | <8% | Frank-Starling no platô — preload-irresponsivo |
| PVI | <10% | |
| dP/dt | 400–700 | Contratilidade reduzida |
| Eadyn | <0.7 | Limitada responsividade a vasopressor |
| HPI | 60–90 | Alto risco de hipotensão |
| ScvO₂ | 55–65% | Extração ↑ |
| StO₂ | 50–65 | |

**Morfologia**: **ECG** strain VE / T invertida lateral / **BCRE comum** (QRS largo > 120 ms) / pode coexistir FA crônica / extrassístoles ventriculares frequentes. **Arterial** pulso alternante (`alternans`) em casos avançados — sístole forte / fraca alternadas. **CVP** onda v aumentada se IT funcional secundária. **PAP** elevada (preset `hap_primaria` leve). **Pleth** modulação respiratória reduzida.

**Notas clínicas**: resposta atenuada a inotrópicos por **down-regulação β1** (40–60% de redução vs paciente sem IC). Volume agrava congestão e edema pulmonar. NTG reduz pré-carga e melhora dispneia mas pode piorar hipoperfusão. Preferir inodilatador (milrinona) ou levosimendana se descompensado.

**Refs**: ESC HF guidelines 2021, AHA HF 2022, Bristow ML — β-receptor down-regulation.

---

### IC com FE intermediária (40–49%) 🔧
- **Etiologia**: zona cinzenta, frequentemente DAC com disfunção moderada; transição entre FEr e FEp.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–95 | Levemente elevada |
| PAS / PAD / PAM | 105–125 / 65–80 / 80–93 | |
| DC / IC | 3.5–5.0 / 2.0–2.8 | Reduzido moderadamente |
| VS / SVI | 50–70 / 28–40 | |
| RVS | 1200–1700 | Levemente aumentado |
| PVC | 6–12 | |
| PAP m / PAOP | 16–26 / 12–20 | |
| EDV / RVEF | 100–150 / 35–50% | |
| GEF | 20–25% | |
| SVV / PPV | 5–13% | |
| dP/dt | 600–850 | |
| Eadyn | 0.7–0.9 | |
| HPI | 30–60 | |
| ScvO₂ | 62–70% | |

**Morfologia**: ECG pode ter alterações inespecíficas, BCRE eventual; arterial sem alternans típico; demais canais normais.

**Notas**: comportamento intermediário; tolerância razoável a volume e a inotrópico.

---

### IC com FE preservada (≥50%) 🔧
- **Etiologia**: idoso, HAS de longa data, DM, obesidade. Disfunção diastólica predominante.
- **Compensação**: enchimento dependente do "kick atrial" (perda em FA descompensa).

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–90 | |
| PAS / PAD / PAM | 120–150 / 70–90 / 88–105 | HAS frequente |
| DC / IC | 4.0–5.5 / 2.3–3.2 | Normal-baixo em repouso |
| VS / SVI | 50–75 / 28–42 | |
| RVS | 1200–1700 | ↑ por HAS |
| PVC | 8–14 | Elevada (rigidez VE) |
| PAP m / PAOP | 18–28 / 14–22 | Elevada |
| EDV / EDVI | normal-pequeno (60–110/40–80) | VE não dilatado |
| RVEF | 45–60% | Preservada |
| GEDV / GEDI | normal | |
| EVLW | normal | ↑ em descompensação aguda |
| SVV / PPV | <8% | Rígido — preload-irresponsivo |
| dP/dt | 800–1100 | Preservada (sistólica OK) |
| Eadyn | 0.7–1.0 | |
| ScvO₂ | 65–72% | |

**Morfologia**: **ECG** HVE com strain (preset `hve` opcional). **Arterial** sem alternans. **CVP** onda a proeminente (atriotomia rígida). **PAP** elevada se descompensada. **Pleth** normal.

**Notas**: muito sensível à FA (perda do kick atrial ⇒ descompensação súbita). Tolera mal volume excessivo. Resposta a NTG limitada. Beta-bloqueador para controle de FC pode descompensar.

---

### Cardiomiopatia dilatada 🔧
- **Etiologia**: idiopática, alcoólica, viral, gestacional.
- **Compensação**: IC FEr clássica; muito similar a IC FEr de etiologia isquêmica.

Hemodinâmica e morfologia praticamente idênticas a **IC FEr**. Diferenças sutis:

| Variável | Faixa | Notas vs IC FEr |
|---|---|---|
| EDV / EDVI | muito aumentado (>200/>120) | Dilatação maior |
| RVEF | 20–40% | |
| Risco arrítmico | TV monomórfica + extrassístoles abundantes | |

**Notas**: risco de trombo intracavitário (anticoagulação frequente).

---

### CM hipertrófica obstrutiva (CMHO) 🔧
- **Etiologia**: hipertrofia septal assimétrica com obstrução dinâmica VSVE; SAM mitral (movimento sistólico anterior).
- **Compensação**: VE hiperdinâmico em repouso, gradiente VSVE dependente de pré-carga e contratilidade.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 65–85 | Bradicardia favorece (mais tempo de enchimento) |
| PAS / PAD / PAM | 110–135 / 70–85 / 85–98 | Variável |
| DC / IC | 4.0–5.5 / 2.3–3.2 | Geralmente normal em repouso |
| VS / SVI | 55–80 / 32–45 | |
| RVS | 1100–1500 | |
| PVC | 5–10 | |
| PAP m / PAOP | 14–22 / 10–18 | |
| EDV / EDVI | normal-pequeno | VE espesso, pequeno |
| RVEF | 50–65% | Preservada (hiperdinâmico) |
| GEF | 30–40% | Pode estar aumentado |
| SVV / PPV | <8% | Preload-sensível paradoxal |
| dP/dt | 1000–1500 | **Aumentado** (hiperdinâmico) |
| Eadyn | 0.8–1.1 | |
| HPI | 30–55 | |
| ScvO₂ | 70–75% | |

**Morfologia**: **ECG** HVE marcada / Q profunda em V5-V6 ("pseudo-infarto") / ST-T anormal. **Arterial** **pulso bisferiens** (preset `bisferiens`) — dois picos sistólicos. **CVP** onda a proeminente. **PAP/Pleth** normais.

**Notas clínicas**: **paradoxo do volume**: hipovolemia AGRAVA obstrução; volume melhora. **Inotrópico AGRAVA** (aumenta gradiente). Vasodilatador AGRAVA (queda de afterload aumenta gradiente). Vasopressor (fenilefrina) **alivia** a obstrução. β-bloqueador é tratamento de base.

**Refs**: AHA/ACC HCM 2020.

---

### Cardiomiopatia restritiva 🔧
- **Etiologia**: amiloidose, sarcoidose, hemocromatose, fibrose endomiocárdica, radiação.
- **Compensação**: enchimento prejudicado, padrão hemodinâmico similar à pericardite constritiva.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–95 | |
| PAS / PAD / PAM | 95–120 / 60–80 / 75–93 | Pode estar baixa |
| DC / IC | 3.0–4.5 / 1.7–2.5 | Reduzido |
| VS / SVI | 40–60 / 22–35 | Reduzido (enchimento limitado) |
| RVS | 1200–1700 | |
| PVC | 14–22 | **Muito elevada** |
| PAP m / PAOP | 22–32 / 18–26 | Pressões de enchimento muito altas |
| EDV / EDVI | normal-pequeno | VE não dilatado |
| RVEF | 35–50% | Pode estar preservada |
| GEDV/GEDI | normal-reduzido | |
| EVLW/EVLWI | normal-↑ | |
| SVV / PPV | <8% | Restrito |
| dP/dt | 600–850 | |
| Eadyn | 0.7–0.9 | |
| ScvO₂ | 60–68% | |

**Morfologia**: **CVP** padrão **M/W** (preset `constritiva`) — descidas x e y muito íngremes. Sinal de Kussmaul (PVC sobe na inspiração). **ECG** pode ter baixa voltagem (especialmente amiloidose) e QS pseudoinfarto. **Arterial/PAP/Pleth** sem padrão específico.

**Notas**: muito sensível ao volume (pequena alteração ⇒ grande mudança de PVC). Diferencial difícil com pericardite constritiva (biópsia/RM ajuda).

---

### Miocardite ativa 🔧
- **Etiologia**: viral (COVID, parvovírus B19, enterovírus), autoimune, induzida por drogas/checkpoint inhibitors.
- **Compensação**: disfunção sistólica aguda, frequentemente com componente inflamatório e arritmogênico.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 90–120 | Taquicardia (febre + disfunção) |
| PAS / PAD / PAM | 95–115 / 60–75 / 75–88 | Pode cair em fulminante |
| DC / IC | 3.0–4.5 / 1.7–2.5 | Reduzido |
| RVS | 1100–1500 | |
| PVC | 8–14 | |
| PAP m / PAOP | 16–24 / 12–20 | |
| EDV / RVEF | normal-aumentado / 30–45% | |
| dP/dt | 500–800 | Reduzido |
| HPI | 40–75 | |
| ScvO₂ | 60–68% | |

**Morfologia**: **ECG** alterações difusas de ST-T, BCRE/BCRD novos, BAV (pode evoluir pra BAVT em miocardites graves), arritmias ventriculares. **Arterial/CVP/PAP** sem padrão específico, podem espelhar IC FEr leve. **Pleth** normal.

**Notas**: alto risco arrítmico — TV/FV. Inotrópicos em fulminante; suporte mecânico (IABP/ECMO) em casos graves.

---

### Cardiopatia chagásica 🔧
- **Etiologia**: *Trypanosoma cruzi*; fase crônica com cardiomiopatia dilatada + disautonomia + bloqueios.
- **Compensação**: dilatação progressiva, disfunção AV, alta arritmogenicidade.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 60–85 | Pode estar BAIXA por bloqueio AV |
| PAS / PAD / PAM | 100–125 / 65–80 / 78–95 | |
| DC / IC | 3.0–4.5 / 1.7–2.6 | Reduzido |
| RVS | 1200–1600 | |
| PVC | 8–14 | |
| PAP m / PAOP | 18–26 / 14–22 | |
| EDV / EDVI | aumentado (>160/>100) | Dilatação |
| RVEF | 25–40% | Reduzida |
| GEDV/GEDI | aumentado | |
| dP/dt | 500–750 | |
| Eadyn | 0.7–0.9 | |
| ScvO₂ | 60–68% | |

**Morfologia**: **ECG** **BCRD ou BCRD + HBAE clássicos** (preset `bcre`); BAV de qualquer grau (1º, 2º, BAVT) — disautonomia + lesão direta. Fibrilação atrial em estágio avançado. Onda Q em parede inferior comum (cicatriz). **Arterial** pode ter alternans. **CVP** v ↑ se IT por dilatação. **PAP** elevada. **Pleth** normal.

**Notas**: alta prevalência de morte súbita arrítmica. Marcapasso/CDI frequentemente indicado. Tromboembolismo cerebral comum (trombo apical).

**Refs**: SBC/AHA Chagas heart disease consensus.

---

## 1.3 Valvopatias

### Estenose aórtica grave 🔧
- **Etiologia**: degenerativa (idoso), bicúspide, reumática.
- **Compensação**: HVE concêntrica, gradiente VE-Ao ≥ 40 mmHg, área <1.0 cm².
- **Risco**: baixa pré-carga colapsa o paciente; baixa SVR também (sem reserva pra aumentar DC).

| Variável | Faixa | Notas |
|---|---|---|
| FC | 60–80 | Bradicardia favorece (mais tempo de ejeção) |
| PAS / PAD / PAM | 100–130 / 70–85 / 80–100 | PP **estreito** (parvus) |
| DC / IC | 3.5–5.0 / 2.0–2.8 | Reduzido moderadamente |
| VS / SVI | 40–60 / 22–35 | Reduzido (VE espesso, pequeno) |
| RVS | 1100–1500 | Levemente aumentado |
| PVC | 5–10 | |
| PAP m / PAOP | 16–24 / 12–20 | Elevadas pela disfunção diastólica |
| EDV / EDVI | normal-pequeno (60–100/35–60) | VE pequeno, espesso |
| RVEF | 50–60% | Preservada (FE compensada) |
| dP/dt | 1100–1500 | **Aumentado** (alta pressão intraventricular) |
| Eadyn | 0.7–0.9 | |
| HPI | 40–70 | Sensível a hipovolemia/hipotensão |
| ScvO₂ | 65–72% | |

**Morfologia**: **Arterial** **parvus et tardus** (preset `estenose_aortica`) — upstroke lento, pico atrasado e baixo, ombro anacrótico. **ECG** HVE com strain. **CVP** onda a proeminente (rigidez VE). **PAP/Pleth** normais.

**Notas**: **manter pré-carga e SVR**. Vasodilatador (NTG) pode causar colapso (queda de SVR sem aumento compensatório de DC). Fenilefrina segura. Bradicardia melhor que taquicardia (mais tempo pra ejeção).

---

### Estenose aórtica moderada 🔧
- **Etiologia**: igual à grave, gradiente médio 20–40 mmHg, área 1.0–1.5 cm².

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | similar à EAo grave mas atenuada | |
| dP/dt | 950–1300 | Levemente ↑ |
| Mortalidade cirúrgica | menor que grave | |

**Morfologia**: **Arterial** parvus parcial (preset `estenose_aortica` com magnitude reduzida). Demais semelhantes à EAo grave em forma menor.

---

### Insuficiência aórtica grave 🔧
- **Etiologia**: degenerativa, bicúspide, endocardite, dissecção, sífilis.
- **Compensação**: VE dilatado tolerante a sobrecarga volêmica crônica; FE preservada por longo tempo.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–95 | Taquicardia favorece (menos tempo de regurgitação) |
| PAS / PAD / PAM | 140–170 / 35–55 / 75–95 | **PP enorme** (water-hammer) |
| DC / IC | 5.0–7.5 / 2.8–4.2 | Hiperdinâmico (anterógrado + regurg) |
| VS / SVI | 80–130 / 45–75 | **Aumentado** |
| RVS | 800–1200 | Reduzido |
| PVC | 4–10 | |
| PAP m / PAOP | 14–22 / 10–18 | |
| EDV / EDVI | aumentado (>180/>110) | Dilatação volêmica |
| RVEF | 45–60% | Preservada se compensada |
| GEDV/GEDI | aumentado | |
| SVV / PPV | <8% | Aumento crônico de volemia |
| dP/dt | 900–1300 | Variável |
| Eadyn | 0.5–0.8 | Reduzido (PP largo) |
| ScvO₂ | 68–74% | |

**Morfologia**: **Arterial** **water-hammer/Corrigan** (preset `insuf_aortica`) — upstroke abrupto, pico precoce alto, queda diastólica vertiginosa. Sinais clínicos: pulso de Quincke, sinal de De Musset. **ECG** HVE volume (ondas R altas, sem strain). **CVP** normal. **PAP** normal-leve elevação. **Pleth** com ampla amplitude.

**Notas**: **vasodilatador favorece** (reduz regurgitação). Bradicardia agrava (mais tempo de regurgitação). Manter MAP 65–75 (descarga distal) e FC 80–90.

---

### Estenose mitral grave 🔧
- **Etiologia**: reumática (>90%), congênita rara, calcificação anular.
- **Compensação**: AE dilatado/hipertenso, HAP secundária frequentemente significativa.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–95 | FA crônica frequente |
| PAS / PAD / PAM | 100–125 / 65–80 / 78–95 | Tendência à hipotensão |
| DC / IC | 3.0–4.5 / 1.7–2.5 | Reduzido (limitação no enchimento VE) |
| VS / SVI | 40–60 / 22–35 | |
| RVS | 1200–1600 | |
| PVC | 6–12 | |
| PAP m / PAOP | **30–50 / 22–35** | **HAP secundária marcada**; PAOP ≈ pressão AE |
| PVR | 300–600 | Aumentado |
| EDV / EDVI | normal-pequeno | VE não dilatado |
| RVEF | 30–45% | Reduzida pelo overload VD |
| dP/dt | 700–950 | |
| ScvO₂ | 60–70% | |

**Morfologia**: **ECG** P mitral (P "bífida" >120 ms em D2), eixo direito, HVD, **FA crônica em ~50%**. **Arterial** sem padrão específico, pode ter alternans em IC avançada. **CVP** onda a proeminente se VD em sobrecarga. **PAP** elevada (preset `hap_primaria` parcial). **Pleth** normal.

**Notas**: bradicardia favorece (mais tempo de enchimento via valva estreita). Taquicardia descompensa rapidamente. Vasodilatador pulmonar (sildenafil) ajuda em HAP severa.

---

### Insuficiência mitral grave 🔧
- **Etiologia**: prolapso mitral, isquêmica (disfunção/ruptura de músculo papilar), reumática, dilatação anular (IC).
- **Compensação**: AE muito dilatado em crônica; FE compensatoriamente alta (ejeção retrógrada barata).

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–95 | |
| PAS / PAD / PAM | 100–125 / 65–80 / 78–95 | |
| DC / IC | 3.5–5.0 / 2.0–2.8 | DC anterógrado reduzido |
| VS / SVI | 50–70 / 28–40 | Anterógrado; total ejetado é maior |
| RVS | 1100–1500 | |
| PVC | 6–12 | |
| PAP m / PAOP | 22–32 / 16–26 | PAOP alta com **onda v gigante** |
| EDV / EDVI | aumentado (>160) | Sobrecarga volêmica VE+AE |
| RVEF | 40–55% | |
| dP/dt | 700–1000 | |
| Eadyn | 0.6–0.8 | |
| ScvO₂ | 62–70% | |

**Morfologia**: **PAOP** com **onda v gigante** (regurgitação sistólica). **ECG** P mitral, FA frequente. **Arterial** geralmente normal; em IM aguda grave (ruptura de cordoalha) pode haver pulso bisferiens. **CVP** onda v normal a aumentada. **PAP** elevada. **Pleth** normal.

**Notas**: vasodilatador favorece (reduz regurgitação). Taquicardia ajuda. Em **IM aguda grave** (ex: ruptura papilar pós-IAM): edema pulmonar fulminante, choque cardiogênico.

---

### Prolapso de valva mitral 🔧
- **Etiologia**: degenerativa (mixomatosa); geralmente assintomática.
- Hemodinâmica em repouso: praticamente normal. Pode ter discreto regurg.

| Variável | Faixa | Notas |
|---|---|---|
| Demais | dentro da normalidade | |

**Morfologia**: ECG normal ou T invertida inferior; **arterial** ocasionalmente bisferiens leve. Demais normais.

**Notas**: contexto pra arritmias supraventriculares. Sem repercussão hemodinâmica em repouso.

---

### Insuficiência tricúspide grave 🔧
- **Etiologia**: funcional (dilatação anular por HAP/IC direita), endocardite (em usuários de drogas IV), reumática, anomalia de Ebstein, pós-marcapasso/CDI.
- **Compensação**: AD muito dilatado, regurgitação grande, congestão sistêmica.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–95 | FA frequente |
| PAS / PAD / PAM | 95–120 / 60–75 / 75–90 | Pode estar baixa |
| DC / IC | 3.0–4.5 / 1.7–2.6 | Reduzido (preload AE diminuído) |
| RVS | 1100–1500 | |
| PVC | **15–25** | **Muito elevada** com onda v gigante |
| PAP m / PAOP | 18–28 / 12–20 | |
| PVR | 200–500 | |
| EDV / EDVI | aumentado | Dilatação VD |
| RVEF | 25–40% | Reduzida |
| GEDV/GEDI | aumentado | |
| ScvO₂ | 55–65% | Extração ↑ |

**Morfologia**: **CVP** **onda v gigante** (preset `v_gigante_TR`) — atinge 20–25 mmHg, descida x abolida, descida y íngreme. **ECG** AD aumentado (P alta), HVD, BCRD. **Arterial** pulso pode ser pequeno (low forward flow). **PAP** se IT for funcional por HAP, PAP alta. **Pleth** normal.

**Notas**: pulso hepático palpável; congestão hepática. Diuréticos cuidadosos (preload-dependente para forward flow). Inotrópico VD direito (milrinona, dobutamina) ajuda.

---

### Prótese valvar mecânica 🔧
- **Etiologia**: substituição valvar (aórtica ou mitral) com prótese metálica.
- **Compensação**: gradiente leve esperado; risco de trombose, embolia, hemólise.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | quase normal se prótese funcionando | |
| FC | 70–85 | |

**Morfologia**: ECG geralmente normal ou alterações pré-existentes. **Arterial** pode ter sinais de gradiente residual em prótese aórtica. **Auscultatório** clique mecânico característico.

**Notas**: **anticoagulação obrigatória** (warfarin INR 2.5–3.5). Suspensão pra cirurgia exige bridge com heparina. Risco de trombose intra-prótese.

---

### Prótese valvar biológica 🔧
- **Etiologia**: substituição valvar com prótese de pericárdio bovino/porcino.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | quase normal | |

**Morfologia**: sem padrão específico. Auscultatório sem clique.

**Notas**: **não exige anticoagulação crônica** após 3 meses. Durabilidade limitada (10–15 anos). Sem grande impacto hemodinâmico ou farmacológico.

---

## 1.4 Arritmias / condução

### Fibrilação atrial crônica 🔧
- **Etiologia**: HAS, valvopatia mitral, ICC, hipertireoidismo, álcool, idiopática.
- **Compensação**: perda do "kick atrial" (~20% do enchimento VE), resposta ventricular irregular.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–110 | Irregular (lenta a rápida) |
| PAS / PAD / PAM | 100–130 / 65–85 / 78–98 | Variável batimento-a-batimento |
| DC / IC | 3.5–5.0 / 2.0–2.8 | Reduzido (perda de kick atrial) |
| VS / SVI | variável | Cada batimento diferente (Frank-Starling) |
| RVS | 1100–1400 | |
| PVC | 5–10 | Onda a ABOLIDA |
| PAP m / PAOP | 14–22 / 10–18 | |
| EDV / EDVI | normal-aumentado | |
| RVEF | 35–55% | |
| SVV / PPV | **alto e variável** | Não confiável (irregularidade ≠ resp. ao volume) |
| dP/dt | 700–1000 | Variável |
| Eadyn | variável | Não confiável em FA |
| ScvO₂ | 65–72% | |

**Morfologia**: **ECG** sem onda P, **ondas f finas** caóticas (350–600/min), **RR irregularmente irregular** (preset `fa`). **Arterial** amplitude varia conforme RR anterior (Frank-Starling — RR longo ⇒ pulso forte) (preset `fa`). **CVP** sem onda a; ondas f finas (preset `fa`); descida y proeminente. **PAP** normal. **Pleth** modulação irregular.

**Notas**: SVV/PPV/Eadyn **não interpretáveis** em FA (pré-requisito é ritmo regular). Anticoagulação se CHA₂DS₂-VASc ≥ 2. Cardioversão elétrica/química em descompensação aguda.

**Refs**: ESC AF guidelines 2020.

---

### Flutter atrial 🔧
- **Etiologia**: macroentrada AD (típico, antihorário); HAS, valvopatia, pós-cirurgia cardíaca.
- **Compensação**: FA atrial 250–300/min, condução ventricular variável (2:1, 3:1, 4:1).

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–150 | Depende da condução (2:1 ⇒ 150) |
| Demais | similar a FA mas RR mais regular | |

**Morfologia**: **ECG** **ondas F serrilhadas** ("dentes de serra") em D2/D3/aVF (preset `flutter`); ausência de linha de base entre QRS. RR pode ser regular (2:1) ou variável.

**Notas**: cardioversão elétrica costuma ser muito eficaz (<50J). Risco tromboembólico similar a FA.

---

### BAV 1º grau 🔧
- **Etiologia**: degenerativa, vagotonia, drogas (β-bloq, digital, BCC), miocardite.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | normal | |

**Morfologia**: **ECG** PR > 200 ms (preset `bav1`); demais normal.

**Notas**: assintomático isolado. Pode progredir pra BAV de maior grau.

---

### BAV 2º grau (Mobitz I/II) 🔧
- **Etiologia**: Mobitz I (Wenckebach) — vagotonia, IAM inferior, drogas. Mobitz II — degenerativa, IAM anterior, sistema His-Purkinje.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 50–80 | Reduzida (algum batimento bloqueado) |
| Demais | normal-leve repercussão | |

**Morfologia**: **ECG** Mobitz II clássico — PR fixo, QRS bloqueado periodicamente (preset `bav2_mobitz2`). Mobitz I — alargamento progressivo do PR até bloqueio.

**Notas**: Mobitz II tem alto risco de progressão pra BAVT — frequentemente indica marcapasso. Mobitz I costuma ser benigno se isolado.

---

### BAV total (BAVT) 🔧
- **Etiologia**: degenerativa (Lev/Lenègre), IAM (especialmente inferior), pós-cirurgia, chagásica.
- **Compensação**: dissociação AV completa, ritmo de escape ventricular ou juncional.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 30–50 | Escape ventricular lento |
| PAS / PAD / PAM | 90–115 / 55–75 / 70–88 | Cai por baixa FC |
| DC / IC | 2.5–4.0 / 1.4–2.3 | Reduzido (FC baixa) |
| VS / SVI | aumentado (60–100/35–55) | Mais tempo de enchimento ⇒ VS maior |
| RVS | 1200–1700 | Compensatória |
| PVC | 5–12 | |
| PAP m / PAOP | 14–22 / 10–18 | |
| dP/dt | 600–900 | |
| ScvO₂ | 60–68% | |

**Morfologia**: **ECG** P e QRS dissociados (preset `bav3`); QRS largo (escape ventricular); FC ventricular ~30–40, FC atrial preservada. **CVP** **ondas a-cannon** intermitentes (preset `cannon_a`) quando AD contrai contra TV fechada (até 20 mmHg). **Arterial** pulso lento, amplitude grande. **PAP** normal. **Pleth** ondas separadas.

**Notas**: indicação **classe I de marcapasso**. Bradicardia sintomática ⇒ atropina (rara resposta) ou marcapasso transcutâneo de emergência. Síncope/Adams-Stokes risco alto.

---

### Marcapasso definitivo 🔧
- **Etiologia**: BAV, doença do nó sinusal, ressincronização (CRT) em ICC.
- Modos: VVI (ventricular único), DDD (dual chamber), CRT-D (com CDI).

| Variável | Faixa | Notas |
|---|---|---|
| FC | 60–80 | Programada (não responde a esforço se VVI fixo) |
| Hemodinâmica | depende da etiologia subjacente | |
| Sincronia | DDD: preserva kick atrial; VVI: perde | |

**Morfologia**: **ECG** **espícula** característica antes do QRS (preset `pacemaker`); QRS **alargado** (estimulação não-fisiológica). DDD com espícula AV alternada. CRT com 2 espículas (V direito + V esquerdo).

**Notas**: cuidado com cautério (interferência) → modo magnético (assíncrono). Compatibilidade com RM exige modelo específico.

---

### CDI implantado 🔧
- **Etiologia**: TV/FV recuperada (prevenção secundária), ICC FEr <35% (prevenção primária), CMHO de alto risco, síndromes genéticas (Brugada, QT longo).

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso | depende da cardiopatia subjacente | |
| Função | choca em FV/TV rápida; pode ter MP integrado | |

**Morfologia**: **ECG** sem alteração até choque (artefato grande). Demais normais.

**Notas**: **desativar antes de cautério** (reduz risco de choque inadvertido). Reativar pós-procedimento. Ímã sobre o gerador inibe terapia (mantém marcapasso se houver).

---

### WPW / pré-excitação 🔧
- **Etiologia**: feixe acessório (Kent) com condução AV anterógrada rápida.
- **Compensação**: sem repercussão hemodinâmica em repouso; risco de TSV ortodrômica e FA com condução pré-excitada (FV).

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso | normal | |

**Morfologia**: **ECG** **PR curto (<120 ms)**, **onda delta** no início do QRS (preset `wpw`), QRS largo. ST/T podem estar alterados.

**Notas**: ablação por radiofrequência cura definitiva. **EVITAR digital, BCC e β-bloqueador em FA pré-excitada** (podem favorecer condução pelo feixe acessório → FV). Procainamida ou amiodarona nessa situação.

---

### TV / morte súbita reanimada 🔧
- **Etiologia**: contexto de cardiopatia estrutural (DAC, IC FEr), canalopatia (QT longo), CMHO.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso | depende da cardiopatia subjacente | |
| Função basal | geralmente IC FEr ou CMHO de fundo | |

**Morfologia**: **ECG** em repouso pode ter QT prolongado, ondas Q de IAM, HVE/strain (depende da causa).

**Notas**: marca contexto crítico — risco arrítmico alto. Geralmente CDI implantado. Anestésicos com cuidado (evitar prolongamento de QT — ondansetron, droperidol; evitar agentes proarrítmicos).

---

## 1.5 Pericárdio / vasculares

### Pericardite constritiva 🔧
- **Etiologia**: pós-cirurgia cardíaca, tuberculose (em endemia), radiação torácica, idiopática/viral.
- **Compensação**: enchimento limitado pela "casca" pericárdica calcificada.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 80–100 | Taquicardia compensatória |
| PAS / PAD / PAM | 90–115 / 55–75 / 70–90 | Pulso paradoxal pode aparecer |
| DC / IC | 2.8–4.0 / 1.6–2.3 | Reduzido (enchimento limitado) |
| VS / SVI | 35–55 / 20–32 | Reduzido |
| RVS | 1200–1600 | |
| PVC | **18–25** | **Muito elevada** |
| PAP m / PAOP | 22–32 / 18–28 | Equalização das pressões diastólicas (PVC ≈ PAOP ≈ PADd) |
| EDV / EDVI | normal-pequeno | Ventrículos não dilatados |
| RVEF | 35–55% | Pode estar preservada |
| GEDV/GEDI | reduzido | |
| EVLW/EVLWI | normal | |
| SVV / PPV | <8% | Restrito |
| dP/dt | 700–950 | |
| ScvO₂ | 60–68% | |

**Morfologia**: **CVP** **padrão M/W** (preset `constritiva`) — descidas x **e** y muito íngremes; **sinal de Kussmaul** (CVP sobe na inspiração). **Arterial** pulso paradoxal possível. **ECG** baixa voltagem; T invertida difusa. **PAP** elevada. **Pleth** modulação respiratória reversa.

**Notas**: diferencial com CM restritiva (biópsia/RM ajuda). Tratamento definitivo é pericardiectomia. Manejo cirúrgico delicado (cuidado com volume — pequeno excesso descompensa).

---

### Derrame pericárdico crônico 🔧
- **Etiologia**: idiopático, autoimune, hipotireoidismo, neoplásico, urêmico.
- **Distinção crítica**: derrame **não-tamponante** (assintomático/oligossintomático) vs. **tamponando** (cenário clínico).

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | quase normal se não tamponando | |
| PVC | 7–13 | Levemente elevada |

**Morfologia**: **ECG** baixa voltagem difusa; alternans elétrico em derrames grandes. Demais canais normais.

**Notas**: se evolui pra tamponamento → cenário clínico ("Tamponamento cardíaco" com pulso paradoxal e CVP↑↑). Em derrame não-tamponante crônico, pouca repercussão.

---

### Aneurisma de aorta 🔧
- **Etiologia**: degenerativo (idoso, HAS), Marfan, bicúspide aórtica, sífilis, vasculite.
- **Distinção**: torácico vs. abdominal; estável vs. roto (cenário agudo separado).

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | em geral normal se estável | HAS frequentemente associada |
| PAS / PAD / PAM | 130–160 / 75–95 / 95–115 | Frequente HAS |
| Compliance arterial | levemente aumentada | Aorta aneurismática "absorve" pulsação |

**Morfologia**: ECG normal ou HVE. **Arterial** sem padrão específico. Demais canais normais.

**Notas**: contexto pra cirurgia eletiva (controle de PA, FC). Roto = emergência hemorrágica (cenário separado).

---

### Dissecção aórtica prévia 🔧
- **Etiologia**: hipertensão grave, Marfan, bicúspide, gravidez, trauma.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | normal se cicatrizada | Frequente HAS, pode ter IAo associada |

**Morfologia**: ECG e curvas geralmente normais.

**Notas**: contexto cirúrgico. Em dissecção AGUDA → cenário separado (PAS muito alta, dor torácica, PA assimétrica MMSS).

---

### Hipertensão pulmonar (HAP) 🔧
- **Etiologia**: idiopática (grupo 1), secundária a IC esquerda (grupo 2), pulmonar (grupo 3 — DPOC, FPI), tromboembólica (grupo 4 — TEP crônico), miscelânea (grupo 5).
- **Definição**: mPAP > 20 mmHg em repouso (PVR ≥ 3 WU se pré-capilar).

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–95 | Compensatória |
| PAS / PAD / PAM | 100–125 / 65–80 / 78–95 | |
| DC / IC | 3.5–5.0 / 2.0–2.8 | Reduzido (limitação VD) |
| VS / SVI | 40–65 / 22–37 | |
| RVS | 1000–1400 | |
| PVC | 8–14 | Sobrecarga VD |
| **PAP m** | **30–50** | Marcadamente elevada |
| PAOP | 6–12 (pré-cap.) ou 16–22 (grupo 2) | Discrimina grupos |
| **PVR** | **300–800** (3–8 WU) | Aumentada |
| EDV / RVEF | aumentado VD / 25–40% | Disfunção VD |
| GEDV/GEDI | normal-↑ | |
| dP/dt | 700–1000 | VE preservado |
| ScvO₂ | 60–68% | |

**Morfologia**: **PAP** **morfologia preservada mas em pressão alta** (preset `hap_primaria`) — sistólica ~80, diastólica ~30, média ~50. **ECG** HVD (R alta em V1, S profunda em V6, eixo direito), strain VD. **Arterial** pulso pode estar reduzido em HAP severa. **CVP** onda a proeminente (AD trabalha contra VD rígido). **Pleth** normal.

**Notas**: **evitar tudo que aumente PVR** — hipóxia, hipercapnia, acidose, dor. Vasodilatador pulmonar (sildenafil, óxido nítrico inalado, prostaciclina). Vasopressor sistêmico (noradrenalina) preferível a inotrópico que reduza SVR.

**Refs**: ESC PH guidelines 2022.

---

### TEP crônico (HP tromboembólica) 🔧
- **Etiologia**: TEP recorrentes não resolvidos → fibrose dos vasos pulmonares.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | similar a HAP grupo 4 | |
| PVR | 400–800 | |

**Morfologia**: **PAP** preset `hap_primaria` (forma similar mas etiologia distinta). Demais canais como HAP.

**Notas**: tratamento é endarterectomia pulmonar em casos selecionados. Anticoagulação crônica obrigatória.

---

### Endocardite infecciosa ativa 🔧
- **Etiologia**: bacteriana (S. aureus, Streptococcus, Enterococcus), fúngica.
- **Compensação**: depende da válvula afetada e do grau de regurgitação induzida.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 95–130 | Taquicardia (febre + estresse) |
| PAS / PAD / PAM | 95–115 / 55–75 / 75–88 | Pode estar baixa em sepse |
| DC / IC | 4.0–7.0 / 2.3–4.0 | Hiperdinâmico (sepse) |
| RVS | 700–1100 | Reduzido (vasodilatação) |
| PVC | 4–10 | |
| ScvO₂ | 70–80% | Alto (hiperdinâmico) |

**Morfologia**: depende da válvula afetada (IM aguda → onda v gigante PAOP; IAo aguda → water-hammer; IT aguda → CVP com v gigante).

**Notas**: febre, calafrios, manchas de Janeway/Osler. Antibioticoterapia 4–6 semanas. Cirurgia se: insuficiência cardíaca por destruição valvar, vegetações grandes (>10 mm), embolia recorrente, abscesso paravalvar.

---

## 1.6 Congênitas (adulto)

### CIA não corrigida 🔧
- **Etiologia**: comunicação interatrial congênita persistente.
- **Compensação**: shunt E→D crônico, sobrecarga volêmica VD.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–90 | |
| PAS / PAD / PAM | 110–130 / 65–80 / 80–95 | |
| DC / IC | 4.5–6.0 / 2.5–3.5 | Sistêmico normal-reduzido |
| RVS | 1000–1300 | |
| PVC | 4–10 | |
| PAP m / PAOP | 18–28 / 6–12 | PAP elevada por hiperfluxo pulmonar |
| PVR | 200–400 | |
| EDV/EDVI VD | aumentado | Sobrecarga volêmica VD |
| RVEF | 35–50% | |
| GEDV/GEDI | aumentado | |

**Morfologia**: **ECG** BCRD incompleto, eixo direito, P pulmonale leve. Outros canais normais.

**Notas**: pode evoluir pra Eisenmenger se PVR sobe (shunt reverso). Profilaxia para embolia paradoxal.

---

### CIV não corrigida 🔧
- **Etiologia**: comunicação interventricular congênita.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | similar a CIA | |
| PVR | 200–400 | |
| PAP m | 20–35 | |

**Morfologia**: ECG HVE/HVD dependendo do tamanho. **Arterial** pode ter pulso "vivo" em CIV grande.

**Notas**: risco de Eisenmenger se grande e não corrigida.

---

### Tetralogia de Fallot corrigida 🔧
- **Etiologia**: pós-correção de Fallot na infância.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | quase normal | |
| RVEF | 35–50% | Pode estar reduzida (cicatriz cirúrgica + IPul) |
| PAP m | 12–22 | Pode ter IPul residual |

**Morfologia**: **ECG** **BCRD** clássico pós-correção; Q de cicatriz. **PAP** geralmente normal.

**Notas**: IPul residual frequente — sobrecarga volêmica VD ao longo de décadas. Pode precisar troca valvar pulmonar tardia.

---

### Coarctação de aorta corrigida 🔧
- **Etiologia**: pós-correção de coarctação na infância/adolescência.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–85 | |
| **PAS / PAD / PAM** | 130–155 / 80–95 / 95–110 | **HAS persistente comum** |
| DC / IC | 4.5–6.0 / 2.5–3.5 | |
| RVS | 1300–1600 | Aumentada |
| Demais | normal | |

**Morfologia**: ECG pode ter HVE residual.

**Notas**: aneurisma na zona de reparo é complicação tardia. Manter controle pressórico rigoroso.

---

# 2. Doenças crônicas comuns

## 2.1 Cardiometabólicas / endócrinas

### HAS (Hipertensão arterial sistêmica) 🔧
- **Etiologia**: primária (essencial, 90%), secundária (renal, endócrina).
- **Compensação**: SVR aumentada cronicamente; rigidez arterial em longa data.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 65–85 | Normal |
| PAS / PAD / PAM | 130–155 / 80–95 / 95–115 | HAS estágio 1-2 controlada |
| DC / IC | 4.5–6.0 / 2.5–3.5 | Normal |
| VS / SVI | 60–85 / 35–48 | |
| RVS | 1300–1700 | Aumentada |
| PVC | 4–10 | |
| PAP m / PAOP | 12–20 / 8–14 | Normal-leve elevação |
| EDV / RVEF | normal-aumentado / 50–60% | HVE concêntrica |
| dP/dt | 850–1200 | Normal-aumentado |
| Eadyn | 0.7–1.0 | |
| ScvO₂ | 65–73% | |

**Morfologia**: **ECG** HVE leve (preset `hve` opcional, prio 5). **Arterial** PP largo, pico tardio, sem entalhe dicrótico claro em idoso (preset `hipertensao`). **CVP** onda a discreta. Demais normais.

**Notas**: tolera mal hipotensão induzida (autorregulação cerebral deslocada à direita). Suspender IECA/ARB no dia da cirurgia se hipotensão pós-indução é provável. β-bloqueador continuado.

---

### HAS refratária / de difícil controle 🔧
- **Etiologia**: HAS resistente a 3+ classes em dose máxima; frequentemente associada a SAOS, hiperaldosteronismo, DRC, feocromocitoma.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–90 | |
| PAS / PAD / PAM | 150–185 / 90–110 / 115–135 | Mesmo em tratamento |
| DC / IC | 4.0–5.5 / 2.3–3.2 | |
| RVS | 1500–2000 | Marcadamente aumentada |
| PVC | 5–10 | |
| PAP m / PAOP | 14–22 / 10–18 | |
| EDV / RVEF | normal-aumentado / 45–60% | HVE marcada |
| dP/dt | 900–1300 | |
| Eadyn | 0.8–1.1 | |
| ScvO₂ | 65–72% | |

**Morfologia**: **ECG** HVE com strain (preset `hve`, prio 15). **Arterial** PP largo, hipertensão sistólica isolada comum em idoso (preset `hipertensao`, prio 20). **CVP** onda a proeminente. Demais normais.

**Notas**: investigar causa secundária se idade <40 ou início abrupto. Risco maior de evento perioperatório (AVC, IAM). Perfusão de órgão-alvo deslocada — manter MAP basal.

---

### DM tipo 1 🔧
- **Etiologia**: autoimune; insulinopenia absoluta.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | praticamente normal em jovem sem complicações | |
| RVS | 1000–1400 | Normal |
| Compliance arterial | levemente reduzida | Glicação proteica precoce |

**Morfologia**: ECG e ondas geralmente normais.

**Notas**: contexto pra controle glicêmico perioperatório. Cetoacidose perioperatória é risco real. Polineuropatia autonômica em DM longa pode causar hipotensão induzida.

---

### DM tipo 2 🔧
- **Etiologia**: resistência insulínica; frequentemente associado a obesidade, HAS, dislipidemia.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–85 | |
| PAS / PAD / PAM | 125–145 / 75–90 / 90–105 | HAS associada frequente |
| DC / IC | 4.5–6.0 / 2.5–3.4 | Normal |
| RVS | 1100–1500 | Levemente ↑ |
| Compliance | levemente reduzida | |
| dP/dt | 800–1100 | Normal |

**Morfologia**: sem padrão específico se sem complicações.

**Notas**: risco de DAC silente em longa data — investigar baseline antes de cirurgia maior.

---

### DM com complicações (nefro/retino/neuro) 🔧
- **Etiologia**: DM avançado com lesão de órgão-alvo; vasculopatia disseminada.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–95 | Pode ter taquicardia em repouso (disautonomia) |
| PAS / PAD / PAM | 130–160 / 75–95 / 95–115 | HAS quase sempre |
| DC / IC | 4.0–5.5 / 2.3–3.2 | Levemente reduzido |
| VS / SVI | 50–75 / 28–42 | |
| RVS | 1300–1700 | ↑ por HAS + nefropatia |
| Compliance | reduzida | Glicação proteica avançada |
| dP/dt | 700–1000 | Levemente reduzido (cardiomiopatia diabética) |
| ScvO₂ | 62–70% | |

**Morfologia**: **ECG** alterações inespecíficas; pode ter HVE, T isquêmica residual de IAM silente. Arterial com PP largo (compliance ↓). Demais normais.

**Notas**: **disautonomia** importante — hipotensão ortostática, taquicardia fixa, resposta atenuada a vasopressor. Risco de IAM silente. DAC frequentemente coexiste.

---

### Dislipidemia 🔧
- **Etiologia**: primária ou secundária; risco aterosclerótico.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | normal | |

**Morfologia**: sem padrão específico.

**Notas**: marca risco aterosclerótico. Sem repercussão hemodinâmica direta. Estatinas continuadas perioperatório.

---

### Síndrome metabólica 🔧
- **Etiologia**: agrupamento de obesidade, HAS, dislipidemia, resistência insulínica.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–85 | |
| PAS / PAD / PAM | 130–150 / 80–95 / 95–110 | |
| RVS | 1200–1500 | |
| Compliance | reduzida | |

**Morfologia**: ECG pode ter HVE leve. Arterial com PP discretamente aumentado.

**Notas**: risco cardiovascular global elevado; manejo similar a HAS + DM.

---

### Hipotireoidismo 🔧
- **Etiologia**: Hashimoto, pós-iodo radioativo, pós-tireoidectomia.
- **Compensação**: redução metabólica global, bradicardia, derrame pericárdico.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 50–70 | Bradicardia |
| PAS / PAD / PAM | 100–125 / 70–85 / 80–98 | |
| DC / IC | 3.5–5.0 / 2.0–2.8 | Reduzido (consumo de O2 baixo) |
| VS / SVI | 50–75 / 28–42 | Reduzido |
| RVS | 1200–1600 | Aumentada |
| PVC | 5–12 | Pode ter derrame pericárdico |
| dP/dt | 600–900 | Reduzido (hipodinâmico) |
| ScvO₂ | 70–78% | Alto (extração baixa) |

**Morfologia**: **ECG** bradicardia sinusal; baixa voltagem (derrame pericárdico em mixedema); QT prolongado às vezes. Demais canais normais.

**Notas**: **mixedema severo é emergência** — coma, hipotermia, choque. Reposição de hormônio tireoidiano gradual em idoso/coronariopata.

---

### Hipertireoidismo 🔧
- **Etiologia**: Graves, bócio multinodular tóxico, tireoidite subaguda, amiodarona.
- **Compensação**: estado hiperdinâmico, alto consumo de O₂, alta sensibilidade β-adrenérgica.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 95–130 | Taquicardia sinusal (ou FA em 10–20%) |
| PAS / PAD / PAM | 130–155 / 60–80 / 85–105 | PP largo (alto DC + ↓ SVR) |
| DC / IC | 6.0–9.0 / 3.5–5.2 | Hiperdinâmico marcado |
| VS / SVI | 75–110 / 42–62 | Aumentado |
| RVS | 700–1000 | Reduzido |
| PVC | 4–10 | |
| PAP m / PAOP | 14–22 / 10–18 | |
| EDV / RVEF | normal-aumentado / 55–70% | Hiperdinâmico |
| dP/dt | 1100–1500 | Aumentado |
| Eadyn | 0.8–1.1 | |
| ScvO₂ | 72–80% | Alto |

**Morfologia**: **ECG** taquicardia sinusal; **FA em ~15%** (preset `fa` se selecionado). HVE leve em casos crônicos. **Arterial** PP largo, water-hammer-like (alto VS + baixa SVR). Demais canais normais.

**Notas**: **tempestade tireoidiana** = emergência (febre, taqui, choque). β-bloqueador (propranolol) é base. Cirurgia eletiva idealmente após eutireoidismo. Anestésicos: evitar simpatomiméticos (cetamina, efedrina).

---

### Insuficiência adrenal / corticoide crônico 🔧
- **Etiologia**: Addison primário, supressão por corticoide crônico (uso prolongado), pan-hipopituitarismo.
- **Compensação**: depleção de cortisol → vasoplegia, intolerância ao estresse.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 80–110 | Taqui compensatória |
| PAS / PAD / PAM | 90–115 / 55–75 / 70–88 | Tendência à hipotensão |
| DC / IC | 4.0–5.5 / 2.3–3.2 | Pode estar alto se compensa |
| VS / SVI | 55–80 / 32–45 | |
| RVS | 700–1000 | **Reduzida** (vasoplegia) |
| PVC | 2–6 | Baixa (hipovolemia relativa) |
| dP/dt | 700–1000 | |
| Eadyn | 0.5–0.8 | Reduzida |
| HPI | 50–80 | |
| ScvO₂ | 65–73% | |

**Morfologia**: ECG geralmente normal; pode ter baixa voltagem se hipovolêmico crônico. Demais canais normais.

**Notas**: **dose de estresse de corticoide perioperatória** é mandatória. Crise adrenal: hipotensão refratária a vasopressor, hiponatremia, hipercalemia. Hidrocortisona 100 mg IV pré-indução em paciente com risco.

---

### Feocromocitoma 🔧
- **Etiologia**: tumor cromafim secretor de catecolaminas (adrenal ou paraganglioma).
- **Compensação**: HAS paroxística ou sustentada, depleção volêmica crônica.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 90–130 | Taquicardia |
| PAS / PAD / PAM | 160–220 / 100–130 / 120–155 | **HAS extrema paroxística** |
| DC / IC | 4.5–7.0 / 2.5–4.0 | Hiperdinâmico |
| VS / SVI | 70–110 / 38–60 | |
| RVS | 1500–2200 | Marcadamente aumentada |
| PVC | 2–8 | Pode estar baixa (depleção) |
| PAP m / PAOP | 14–22 / 10–18 | |
| dP/dt | 1100–1500 | Aumentado |
| Eadyn | 0.9–1.2 | |
| HPI | varia paroxisticamente | |
| ScvO₂ | 70–78% | |

**Morfologia**: **ECG** taquicardia, HVE em crônicos, alterações isquêmicas em crises. **Arterial** picos hipertensivos súbitos, PP largo (preset `hipertensao`, prio 25). Demais canais geralmente normais.

**Notas**: **bloqueio α PRIMEIRO** (fenoxibenzamina/doxazosina por ≥10 dias), depois β-bloqueador. **Nunca β isolado** (HAS crítica por α sem oposição). Cirurgia: crises intra-op por manipulação tumoral; preparar nitroprussiato e fentolamina; pós-clampagem da veia: vasoplegia súbita, preparar volume + noradrenalina.

---

## 2.2 Renais

### DRC estágio 3 (TFG 30–59) 🔧
- **Etiologia**: nefroesclerose hipertensiva, diabética, glomerulopatias.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–90 | |
| PAS / PAD / PAM | 130–155 / 80–95 / 95–115 | HAS quase sempre |
| DC / IC | 4.5–6.0 / 2.5–3.4 | |
| VS / SVI | 60–85 / 33–47 | |
| RVS | 1200–1600 | Aumentada |
| PVC | 6–12 | Volemia limítrofe |
| PAP m / PAOP | 14–22 / 10–18 | |
| dP/dt | 800–1100 | |
| Eadyn | 0.7–1.0 | |
| Hb | 10–13 | Anemia leve |
| ScvO₂ | 65–73% | |

**Morfologia**: ECG pode ter HVE pela HAS associada. Demais normais.

**Notas**: ajustar drogas renais (rocurônio, vancomicina). Evitar AINEs e contraste. Anemia tolerada se estável.

---

### DRC estágio 4–5 (TFG <30) 🔧
- **Etiologia**: progressão de DRC.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–95 | |
| PAS / PAD / PAM | 140–170 / 85–105 / 105–125 | HAS difícil de controlar |
| DC / IC | 4.5–6.0 / 2.5–3.4 | Hiperdinâmico (anemia) |
| VS / SVI | 65–90 / 36–50 | |
| RVS | 1300–1700 | Aumentada |
| PVC | 8–15 | Sobrecarga volêmica |
| PAP m / PAOP | 18–28 / 14–22 | Elevadas |
| EVLW/EVLWI | levemente ↑ | |
| dP/dt | 700–1000 | Pode ter cardiomiopatia urêmica |
| Eadyn | 0.7–0.9 | |
| Hb | 8–11 | Anemia significativa |
| ScvO₂ | 60–70% | |

**Morfologia**: **ECG** HVE comum, alterações de repolarização inespecíficas; alterações hipercalêmicas (T apiculada, QRS largo, PR prolongado) em distúrbios eletrolíticos. Demais canais geralmente normais.

**Notas**: hipercalemia perioperatória é risco. Cardiomiopatia urêmica subclínica. Diálise pré-op idealmente recente (24-48h antes).

---

### DRC em hemodiálise 🔧
- **Etiologia**: terminal, dependência dialítica.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 80–100 | Taquicardia (anemia + estado urêmico) |
| PAS / PAD / PAM | depende do timing dialítico | Pós-diálise: ~110/70; pré-diálise: ~160/95 |
| DC / IC | 5.0–7.0 / 2.8–4.0 | Hiperdinâmico (anemia + fístula AV) |
| VS / SVI | 70–100 / 38–55 | Aumentado |
| RVS | 900–1300 | Reduzido (anemia, fístula AV) |
| PVC | 4–14 | Variável (depende de volemia) |
| Hb | 8–11 | Anemia tratada com EPO |
| dP/dt | 700–1000 | Cardiomiopatia urêmica |
| ScvO₂ | 60–68% | |

**Morfologia**: ECG com HVE comum; alterações de cálcio/potássio agudas. Pode ter calcificação valvar (especialmente aórtica) precoce.

**Notas**: **fístula AV** funciona como shunt — DC artificialmente alto. Não puncionar/medir PA no membro da fístula. Diálise pré-op ideal 12-24h antes (evitar hipovolemia pós-recente). Anestesia: evitar succinilcolina (hipercalemia).

---

### Lesão renal aguda (AKI) atual 🔧
- **Etiologia**: pré-renal (hipovolemia, choque), intrínseca (NTA, glomerulonefrite), pós-renal (obstrução).

| Variável | Faixa | Notas |
|---|---|---|
| FC | 80–110 | Variável |
| PAS / PAD / PAM | depende da etiologia | Hipovolemia: baixo; obstrução: variável |
| DC / IC | depende | |
| PVC | variável | Baixo se hipovolêmico, alto se sobrecarga |

**Morfologia**: depende da etiologia.

**Notas**: identificar e tratar causa. Manter MAP ≥ 65 (perfusão renal). Cuidado com nefrotóxicos. Diuréticos só após volemia restaurada.

---

### Transplante renal 🔧
- **Etiologia**: pós-Tx renal funcional.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–85 | |
| PAS / PAD / PAM | 125–145 / 75–90 / 90–105 | HAS frequentemente persistente |
| RVS | 1100–1400 | Normal-↑ |
| Demais | quase normal | |

**Morfologia**: dependendo de DRC residual.

**Notas**: imunossupressão (ciclosporina/tacrolimus) — interações farmacológicas e nefrotoxicidade. Manter perfusão do enxerto (MAP ≥ 70). Evitar AINEs.

---

## 2.3 Hepáticas

### Cirrose Child A ✅
- **Etiologia**: fibrose hepática inicial; insuficiência hepática mínima.
- **Compensação**: hiperdinâmico inicial.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–90 | Levemente elevada |
| PAS / PAD / PAM | 110–130 / 70–85 / 83–100 | Levemente reduzida |
| DC / IC | 5.5–7.0 / 3.0–3.9 | Hiperdinâmico inicial |
| VS / SVI | 70–100 / 38–55 | Aumentado |
| RVS | 900–1200 | Reduzida |
| IRVS | 1700–2200 | |
| PVC | 4–10 | |
| PAP m / PAOP | 14–22 / 10–18 | |
| EDV / RVEF | normal / 45–55% | |
| GEDV/GEDI | normal-↑ | |
| EVLW/EVLWI | normal | |
| SVV / PPV | 5–13% | Volemia variável (ascite) |
| dP/dt | 800–1100 | |
| Eadyn | 0.7–1.0 | |
| ScvO₂ | 70–78% | Alto (hiperdinâmico) |

**Morfologia**: geralmente normais em todos os canais. Pode ter alterações inespecíficas no ECG.

**Notas**: tolerância cirúrgica preservada. INR levemente alterado.

**Refs**: PMC1856081, AASLD core series.

---

### Cirrose Child B ✅
- **Etiologia**: fibrose moderada com sinais de descompensação (ascite, encefalopatia leve).
- **Compensação**: hiperdinâmico moderado.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 80–100 | |
| PAS / PAD / PAM | 100–125 / 60–80 / 75–95 | Tendência à hipotensão |
| DC / IC | 6.0–8.0 / 3.3–4.5 | Hiperdinâmico |
| VS / SVI | 80–115 / 44–65 | Aumentado |
| RVS | 700–1000 | Marcadamente reduzida |
| PVC | 5–12 | |
| PAP m / PAOP | 14–24 / 10–20 | |
| EDV / RVEF | normal-aumentado / 45–55% | |
| GEDV/GEDI | aumentado | Por sobrecarga volêmica + ascite |
| EVLW/EVLWI | normal | |
| Compliance | aumentada | Vasos hiperdinâmicos |
| SVV / PPV | 5–13% | Variável |
| dP/dt | 750–1050 | |
| Eadyn | 0.6–0.9 | Reduzida |
| ScvO₂ | 72–80% | Alto |

**Morfologia**: **Arterial** pode ter PP largo (alto VS, baixa SVR). Demais canais usualmente normais.

**Notas**: tolerância cirúrgica reduzida. Coagulopatia. Cuidado com depuração hepática de drogas.

**Refs**: PMC1856081.

---

### Cirrose Child C ✅
- **Etiologia**: insuficiência hepática avançada com ascite refratária / encefalopatia / icterícia.
- **Compensação**: hiperdinâmico avançado, MAP perto da margem.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 90–110 | Taquicardia compensatória |
| PAS / PAD / PAM | 95–115 / 50–70 / 70–85 | Hipotensão limítrofe |
| DC / IC | 7.0–9.5 / 3.9–5.5 | Hiperdinâmico marcado |
| VS / SVI | 90–130 / 50–72 | Aumentado |
| RVS | 550–800 | **Marcadamente reduzida** (~−40%) |
| IRVS | 1000–1450 | |
| PVC | 6–14 | Variável (ascite) |
| PAP m / PAOP | 18–28 / 14–22 | Elevadas |
| EDV / RVEF | aumentado / 40–55% | |
| GEDV/GEDI | aumentado (>900) | |
| EVLW/EVLWI | normal-↑ | |
| Compliance | marcadamente aumentada (1.39× normal) | |
| SVV / PPV | 5–13% | |
| dP/dt | 700–1000 | |
| Eadyn | 0.5–0.8 | Reduzida |
| HPI | 50–80 | |
| ScvO₂ | 73–82% | Muito alto |

**Morfologia**: **Arterial** PP largo, hiperdinâmico (sem preset específico — fenótipo numérico). **ECG** geralmente sem alterações específicas; pode ter intervalo QT prolongado (cardiomiopatia cirrótica). Demais canais normais.

**Notas**: **cardiopatia cirrótica** = resposta ATENUADA AO ESTRESSE (não DC baixo de repouso); inotrópico tem ação reduzida. Vasopressor preferencial é noradrenalina; vasopressina ajuda em síndrome hepatorrenal. Hiponatremia frequente — corrigir lentamente.

**Refs**: PMC1856081, AASLD, PMC3003209.

---

### Hipertensão portopulmonar (POPH) ✅
- **Etiologia**: HAP (mPAP >20, PVR ≥3 WU, PAWP ≤15) secundária a hipertensão portal.
- **Compensação**: sobrecarga de VD atenua o estado hiperdinâmico cirrótico.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–105 | Taqui mantida |
| PAS / PAD / PAM | 100–125 / 60–80 / 75–95 | |
| DC / IC | 4.5–6.5 / 2.5–3.7 | Reduzido vs cirrose pura (VD atenua) |
| VS / SVI | 55–85 / 30–48 | |
| RVS | 700–1000 | Reduzida (cirrose de fundo) |
| PVC | 8–15 | Sobrecarga VD |
| **PAP m** | **25–45** | **Marcadamente elevada** |
| PAOP | <15 | Pré-capilar |
| **PVR** | **300–700** (3–7 WU) | Aumentada |
| EDV / RVEF | aumentado / 25–40% | Disfunção VD |
| GEDV/GEDI | aumentado | |
| dP/dt | 700–1000 | |
| ScvO₂ | 65–75% | |

**Morfologia**: **PAP** elevada (preset `hap_primaria`, prio 55). **ECG** HVD, eixo direito. **CVP** onda a proeminente. Demais semelhantes à cirrose.

**Notas**: 5–10% dos cirróticos. **Contraindica transplante** se mPAP > 35 e PVR alta sem resposta a vasodilatador. Treprostinil/sildenafil podem ser ponte. Cuidado com aumento agudo de PVR (hipóxia, hipercapnia).

**Refs**: PMC10365198.

---

### Síndrome hepatopulmonar (SHP) ✅
- **Etiologia**: vasodilatação intrapulmonar com shunt → defeito de oxigenação.
- **Definição**: PaO₂ <80 ou A-aO₂ ≥15 em ar ambiente, em paciente com hepatopatia.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 80–100 | Cirrose de fundo |
| PAS / PAD / PAM | 100–125 / 60–80 / 75–95 | |
| DC / IC | 6.0–8.5 / 3.3–4.8 | Hiperdinâmico (cirrose) |
| RVS | 700–1000 | Reduzida |
| **PAP m** | **normal (10–18)** | **NÃO eleva — chave do diagnóstico** |
| PVR | normal | |
| **PaO₂** | **50–75** | Reduzida em ar ambiente |
| **A-aO₂** | **20–40** | Aumentada |
| **SpO₂** | **88–94%** | Hipoxemia, **piora em ortostase (ortodeoxia)** |
| ScvO₂ | 70–78% | Alto (cirrose) |

**Morfologia**: PAP **normal** (não há preset). ECG e demais canais como cirrose.

**Notas**: tratamento definitivo é **transplante hepático**. Sem terapia farmacológica eficaz consistente. Suplementação de O₂ ajuda em tipo I (vasodilatação capilar) mas não em tipo II (shunt anatômico).

**Refs**: NBK562169.

---

### Hepatite crônica ativa 🔧
- **Etiologia**: HBV, HCV, autoimune, alcoólica.
- Hemodinâmica: sem repercussão direta antes de cirrose.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | praticamente normal | |
| RVS | 1000–1300 | Pode estar levemente reduzida |

**Morfologia**: sem padrão específico.

**Notas**: contexto pra função hepática (TGO/TGP, INR, albumina). Ajustar drogas hepato-metabolizadas.

---

## 2.4 Hábitos / históricos

### Tabagismo ativo (>20 maços-ano) 🔧
- **Etiologia**: exposição prolongada à fumaça.
- **Compensação**: dano endotelial, aumento de PVR leve, aterosclerose acelerada.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–85 | |
| PAS / PAD / PAM | 120–140 / 75–90 / 90–105 | |
| RVS | 1100–1400 | Levemente ↑ |
| PAP m | 16–22 | Levemente ↑ |
| PVR | normal-↑ | |
| Compliance arterial | reduzida | |

**Morfologia**: ECG pode ter padrão de DPOC associado.

**Notas**: contexto pra DPOC, DAC, neoplasia. Risco aumentado de complicação pulmonar pós-op.

---

### Etilismo crônico 🔧
- **Etiologia**: consumo crônico (>40 g/dia).
- **Compensação**: cardiomiopatia alcoólica subclínica em uso prolongado.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–95 | |
| PAS / PAD / PAM | 120–145 / 75–90 / 90–105 | HAS associada |
| DC / IC | 4.0–5.5 / 2.3–3.2 | Levemente reduzido |
| RVS | 1100–1400 | |
| EDV / RVEF | levemente aumentado / 40–55% | Cardiomiopatia inicial |
| dP/dt | 600–900 | Reduzido |

**Morfologia**: ECG pode ter alterações inespecíficas; FA "holiday heart" em consumo agudo.

**Notas**: **abstinência perioperatória** = risco de delirium tremens, convulsão. Tiamina + benzodiazepínico se sinais. Cardiomiopatia em casos avançados.

---

### Uso de cocaína / drogas ilícitas 🔧
- **Etiologia**: uso de simpaticomiméticos (cocaína, anfetaminas, MDMA).
- **Compensação**: estimulação adrenérgica aguda; espasmo coronariano; risco de IAM em jovens.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 90–130 | Taquicardia |
| PAS / PAD / PAM | 140–180 / 90–110 / 110–130 | HAS aguda |
| DC / IC | 5.5–7.5 / 3.0–4.2 | Hiperdinâmico |
| RVS | 1200–1700 | Aumentada |
| dP/dt | 1100–1400 | Aumentado |
| HPI | variável | |

**Morfologia**: **ECG** taquicardia, possível elevação de ST por espasmo coronariano (preset `iam_supra` em casos agudos). Arterial com pressões elevadas.

**Notas**: **β-bloqueador isolado é contraindicado** (estímulo α sem oposição → HAS extrema). Usar α + β (labetalol) ou apenas BCC. Risco de IAM, dissecção aórtica.

---

## 2.5 Hematológicas / coagulação

### Anemia crônica 🔧
- **Etiologia**: ferropriva, doença crônica, talassemia, doença renal.
- **Compensação**: estado hiperdinâmico para manter DO₂.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–105 | Taquicardia compensatória |
| PAS / PAD / PAM | 100–125 / 60–80 / 75–95 | PP largo |
| DC / IC | 5.5–7.5 / 3.0–4.2 | Hiperdinâmico |
| VS / SVI | 70–100 / 38–55 | Aumentado |
| RVS | 800–1100 | Reduzida |
| dP/dt | 850–1200 | Aumentado |
| Hb | 7–10 | Definição |
| ScvO₂ | 60–68% | Reduzida (extração ↑) |
| StO₂ | 50–65 | Reduzida |

**Morfologia**: ECG normal em geral; pode ter sopro funcional (auscultatório).

**Notas**: tolerância à hemorragia perioperatória reduzida. Considerar transfusão pré-op se Hb <8 e cirurgia maior. EPO em DRC associada.

---

### Plaquetopenia / coagulopatia 🔧
- **Etiologia**: PTI, hepatopatia, quimio, sepse.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | sem repercussão direta | |

**Morfologia**: sem padrão específico.

**Notas**: contexto cirúrgico — risco hemorrágico. Limiar transfusional plaqueta: <50.000 cirurgia geral, <100.000 SNC/ocular. Cuidado com bloqueio neuroaxial.

---

### Anticoagulação crônica (warfarin) 🔧
- **Etiologia**: FA, prótese mecânica, TVP/TEP recorrente, SAF.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | sem repercussão direta | |

**Morfologia**: sem padrão específico.

**Notas**: **suspender 5 dias antes** de cirurgia eletiva; bridge com HBPM em prótese mecânica. INR alvo intra-op <1.5 (sangramento) ou <1.3 (neuroaxial). Reverter com vitamina K + plasma se urgência.

---

### Anticoagulação crônica (DOAC) 🔧
- **Etiologia**: FA, TVP/TEP.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | sem repercussão direta | |

**Morfologia**: sem padrão específico.

**Notas**: suspender 24-48h antes (depende da função renal e da droga). Idarucizumabe (dabigatran) ou andexanet alfa (Xa inibidor) para reversão urgente.

---

### Antiagregação dupla (AAS + clopidogrel) 🔧
- **Etiologia**: stent recente, SCA recente.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | sem repercussão direta | |

**Morfologia**: sem padrão específico.

**Notas**: **NÃO suspender em stent farmacológico <12 meses** sem discutir com cardiologista (risco de trombose intra-stent). Cirurgia eletiva idealmente após esse período. Em emergência: manter AAS, suspender clopidogrel 5-7 dias se possível.

---

## 2.6 Neurológicas / outras

### AVC prévio com sequela 🔧
- **Etiologia**: isquêmico ou hemorrágico.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | sem repercussão direta | |
| PA | autorregulação cerebral pode estar deslocada | |

**Morfologia**: sem padrão específico no monitor hemodinâmico.

**Notas**: manter MAP ≥ 80 (perfusão cerebral) em AVC isquêmico recente. Cuidado com hiperventilação (vasoconstrição cerebral). Evitar hipotensão intra-op.

---

### Doença de Parkinson 🔧
- **Etiologia**: degeneração de neurônios dopaminérgicos da substância negra.
- **Compensação**: disautonomia leve em estágios avançados.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–85 | Pode ter taqui em repouso (disautonomia) |
| PAS / PAD / PAM | 110–135 / 70–85 / 83–98 | Hipotensão ortostática frequente |
| RVS | 950–1300 | Levemente reduzida (disautonomia) |
| Demais | praticamente normal | |

**Morfologia**: sem padrão específico.

**Notas**: **manter levodopa perioperatória** (sonda gástrica se necessário); suspensão = rigidez, hipertermia. Evitar metoclopramida, droperidol (antagonistas dopaminérgicos). Risco de aspiração por disfagia.

---

### Miastenia gravis 🔧
- **Etiologia**: autoimune contra receptor de acetilcolina.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | sem repercussão direta | |

**Morfologia**: sem padrão específico.

**Notas**: **sensibilidade extrema a bloqueador neuromuscular não-despolarizante** (resistência paradoxal a succinilcolina). Risco de crise miastênica pós-op (insuficiência respiratória). Evitar aminoglicosídeos, magnésio.

---

### Epilepsia 🔧
- **Etiologia**: idiopática, pós-trauma, lesão estrutural.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | sem repercussão direta | |

**Morfologia**: sem padrão específico (entre crises).

**Notas**: manter anticonvulsivante perioperatório. **Evitar agentes pró-convulsivantes**: enflurano, sevoflurano em alta concentração (raro), meperidina, tramadol, propofol em bolus rápido (mioclonia ≠ crise).

---

# 3. Doenças respiratórias

## 3.1 Obstrutivas

### Asma leve / intermitente 🔧
- **Etiologia**: hiperreatividade brônquica.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso | normal | |

**Morfologia**: sem padrão específico em repouso.

**Notas**: contexto pra broncoespasmo perioperatório. Pré-medicar com broncodilatador. Evitar β-bloqueador, AINE em alérgicos.

---

### Asma moderada 🔧
- **Etiologia**: sintomas mais frequentes; uso de corticoide inalatório regular.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso | praticamente normal | |
| PAP m | 14–20 | Levemente elevada |
| PVR | normal-↑ | |

**Morfologia**: sem padrão específico em repouso.

**Notas**: maior risco de broncoespasmo. Otimização pré-op com broncodilatador + corticoide.

---

### Asma grave / mal controlada 🔧
- **Etiologia**: refratária a controle padrão; uso de corticoide oral / biológicos.
- **Compensação**: hiperinsuflação dinâmica, auto-PEEP.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–110 | Taquicardia (β-agonista + estresse) |
| PAS / PAD / PAM | 110–135 / 70–85 / 83–98 | |
| DC / IC | 4.0–5.5 / 2.3–3.2 | |
| RVS | 1000–1400 | |
| PVC | 4–10 | |
| PAP m / PAOP | 18–26 / 10–18 | Pulsus paradoxus em crise |
| PVR | 250–500 | Aumentada (vasoconstrição hipóxica) |
| EDV / RVEF | normal / 40–55% | |

**Morfologia**: **PAP** levemente elevada em crise. **Pleth** com modulação respiratória aumentada. Demais geralmente normais.

**Notas**: status asthmaticus = emergência (broncoespasmo refratário, hipercapnia). Cetamina como indutor de escolha (broncodilatador). Evitar histamino-liberadores (morfina, atracúrio).

---

### DPOC GOLD 1–2 (leve a moderado) 🔧
- **Etiologia**: tabagismo, alfa-1-antitripsina, exposição ocupacional.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–90 | |
| PAS / PAD / PAM | 120–140 / 75–90 / 90–105 | |
| RVS | 1000–1400 | |
| PAP m | 16–24 | Levemente elevada |
| PVR | 200–400 | |
| Demais | quase normais | |

**Morfologia**: ECG pode ter eixo direito incipiente. **PAP** levemente elevada.

**Notas**: tolerância respiratória reduzida. Otimizar pré-op. Evitar oxigênio em alto fluxo (perda do drive hipoxêmico).

---

### DPOC GOLD 3–4 (grave a muito grave) 🔧
- **Etiologia**: progressão de DPOC.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–105 | Taqui (hipoxemia + hipercapnia) |
| PAS / PAD / PAM | 110–135 / 70–85 / 83–98 | |
| DC / IC | 4.0–5.5 / 2.3–3.2 | |
| RVS | 1000–1400 | |
| PVC | 8–14 | Sobrecarga VD inicial |
| PAP m | 22–35 | Elevada |
| PAOP | 8–14 | Pré-capilar |
| PVR | 350–600 | Marcadamente aumentada |
| EDV VD / RVEF | aumentado / 30–45% | Disfunção VD inicial |
| GEDV/GEDI | aumentado | |
| ScvO₂ | 60–68% | |

**Morfologia**: **ECG** P pulmonale (P alta em D2 >2.5 mm), eixo direito, HVD com strain, BCRD. **PAP** elevada (preset `hap_primaria`, prio 30). **CVP** onda a proeminente. Demais usualmente normais.

**Notas**: ventilação delicada (auto-PEEP, hiperinsuflação). FiO₂ controlada. Bicarbonato baixo basal — corrigir gradualmente.

---

### DPOC com cor pulmonale 🔧
- **Etiologia**: DPOC avançada com falência VD secundária à HAP crônica hipoxêmica.
- **Compensação**: VD dilatado e disfuncional, congestão sistêmica.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 90–115 | Taquicardia |
| PAS / PAD / PAM | 95–120 / 60–75 / 75–90 | Pode estar baixa |
| DC / IC | 3.5–5.0 / 2.0–2.8 | Reduzido (limitação VD) |
| VS / SVI | 50–75 / 28–42 | |
| RVS | 1100–1500 | |
| PVC | **15–22** | **Marcadamente elevada** |
| PAP m | **30–50** | Marcadamente elevada |
| PAOP | 8–14 | Pré-capilar |
| PVR | 500–900 | Muito aumentada |
| EDV VD / RVEF | muito aumentado / 20–35% | Disfunção VD severa |
| GEDV/GEDI | aumentado | |
| dP/dt | 600–850 | |
| ScvO₂ | 55–65% | Reduzida |

**Morfologia**: **ECG** HVD marcada, P pulmonale, BCRD, eixo extremo direito. **PAP** elevada (preset `hap_primaria`, prio 50). **CVP** onda a-cannon ocasional, onda v aumentada se IT funcional. **Arterial** pulso paradoxal em descompensação. **Pleth** modulação respiratória marcada.

**Notas**: descompensação aguda → cor pulmonale agudo crônico = emergência. Manejo: O₂ controlado, otimizar VD (inotrópico VD: milrinona, dobutamina), reduzir PVR (iloprost inalado, sildenafil). Diurético cuidadoso.

---

### Bronquiectasias 🔧
- **Etiologia**: pós-infecciosa, fibrose cística, imunodeficiência, idiopática.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso | praticamente normal | |
| PVR | normal-↑ | |

**Morfologia**: ECG normal-leve eixo direito.

**Notas**: secreções abundantes, risco de infecção. Fisioterapia pré-op essencial.

---

### Fibrose cística 🔧
- **Etiologia**: mutação CFTR; doença multiorgânica.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 80–100 | Taqui (estado catabólico) |
| Hemodinâmica | depende do estágio pulmonar | |
| PVR | normal-↑ | |
| Hb | normal-↓ | |

**Morfologia**: ECG pode ter HVD em estágios avançados.

**Notas**: doença sistêmica — pâncreas, fígado, intestino, fertilidade. Otimização nutricional + secreções. Modulador de CFTR (ivacaftor/elexacaftor) muda muito o curso.

---

## 3.2 Restritivas

### Fibrose pulmonar idiopática 🔧
- **Etiologia**: idiopática; degenerativa.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–105 | |
| PAS / PAD / PAM | 110–130 / 70–85 / 83–98 | |
| DC / IC | 4.0–5.5 / 2.3–3.2 | |
| RVS | 1100–1400 | |
| PVC | 6–12 | |
| PAP m | 20–32 | Elevada |
| PVR | 250–500 | Aumentada |
| EDV VD / RVEF | aumentado / 35–50% | |
| ScvO₂ | 60–68% | |

**Morfologia**: **ECG** P pulmonale, HVD inicial. **PAP** elevada (preset `hap_primaria`, prio 25). Demais geralmente normais.

**Notas**: tolerância respiratória muito reduzida. Pirfenidona/nintedanibe modulam progressão. Transplante em casos avançados.

---

### Doença pulmonar intersticial (outras) 🔧
- **Etiologia**: pneumonites de hipersensibilidade, conectivopatias, induzida por drogas.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | similar a FPI mas faixa larga (depende da etiologia) | |
| PVR | 200–400 | |
| PAP m | 18–28 | |

**Morfologia**: **PAP** levemente elevada (preset `hap_primaria`, prio 20).

**Notas**: tratamento inclui imunossupressão. Considerar etiologia de fundo.

---

### Sequela de tuberculose 🔧
- **Etiologia**: cicatriz pulmonar pós-TB; pode ter restrição mecânica (calcificação pleural, fibrose).

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso | quase normal | |
| PVR | levemente ↑ | |

**Morfologia**: ECG geralmente normal.

**Notas**: risco aumentado de pneumotórax pós-procedimento (bolhas/cavidades residuais).

---

### Cifoescoliose grave 🔧
- **Etiologia**: idiopática, neuromuscular, pós-poliomielite.
- **Compensação**: restrição mecânica → HAP secundária a longo prazo.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 80–95 | |
| Hemodinâmica | depende do grau de restrição | |
| PVR | 200–500 | Aumentada se severa |
| PAP m | 18–30 | Elevada em casos severos |

**Morfologia**: **ECG** P pulmonale, HVD em casos severos.

**Notas**: tolerância anestésica reduzida. Posicionamento desafiador. Ventilação difícil.

---

### Síndrome obesidade-hipoventilação (SOH) 🔧
- **Etiologia**: obesidade mórbida + hipoventilação alveolar crônica (PaCO₂ >45 dia).
- **Compensação**: hipoxemia crônica → HAP secundária + cor pulmonale.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–100 | |
| PAS / PAD / PAM | 130–155 / 80–95 / 95–115 | HAS associada |
| DC / IC | 4.5–6.0 / 2.2–3.0 | IC reduzido por BSA grande |
| RVS | 1000–1400 | |
| PVC | 8–14 | Sobrecarga VD |
| PAP m | 22–35 | Elevada |
| PVR | 250–500 | |
| EDV VD / RVEF | aumentado / 30–45% | Disfunção VD |
| GEDV/GEDI | aumentado | |
| ScvO₂ | 60–68% | |

**Morfologia**: **ECG** P pulmonale, HVD, eixo direito. **PAP** elevada (preset `hap_primaria`, prio 25). **Pleth** modulação respiratória reduzida (apneia/hipopneia).

**Notas**: CPAP/BiPAP perioperatório. Posicionamento (cabeceira elevada). Risco de difícil intubação. Hipercapnia tolerada — não corrigir bruscamente.

---

## 3.3 Apneia do sono

### SAOS leve 🔧
- **Etiologia**: obstrução faríngea intermitente; IAH 5–15.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso (acordado) | quase normal | |
| PA | levemente elevada | HAS leve associada |

**Morfologia**: sem padrão específico em repouso.

**Notas**: risco de apneia pós-op com opioide. CPAP perioperatório se diagnosticado.

---

### SAOS moderada 🔧
- **Etiologia**: IAH 15–30.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 70–85 | |
| PAS / PAD / PAM | 130–150 / 80–95 / 95–110 | HAS frequente |
| RVS | 1100–1400 | |
| PAP m | 16–22 | Levemente elevada |
| PVR | normal-↑ | |

**Morfologia**: ECG normal acordado.

**Notas**: CPAP. Cuidado com sedativos.

---

### SAOS grave / em CPAP 🔧
- **Etiologia**: IAH >30; frequentemente com obesidade e SOH.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 75–90 | |
| PAS / PAD / PAM | 135–160 / 85–100 / 100–120 | HAS quase sempre |
| RVS | 1200–1500 | Aumentada |
| PVC | 6–12 | |
| PAP m | 20–30 | Elevada |
| PVR | 200–400 | Aumentada |
| EDV VD / RVEF | aumentado / 40–55% | Sobrecarga VD inicial |
| ScvO₂ | 65–73% | |

**Morfologia**: **ECG** pode ter HVE (HAS) e/ou HVD em SAOS grave de longa data. **PAP** levemente elevada.

**Notas**: **CPAP perioperatório obrigatório** (manter mesmo na sala). Risco de via aérea difícil. Monitorização contínua pós-op (apneia retardada por opioide).

---

## 3.4 Vasculares pulmonares

### HAP primária / idiopática 🔧
- **Etiologia**: idiopática (grupo 1 da OMS); pode ser hereditária (BMPR2).
- **Compensação**: VD severamente sobrecarregado, disfunção progressiva.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 85–110 | Taquicardia compensatória |
| PAS / PAD / PAM | 95–115 / 60–75 / 75–88 | Pode estar baixa |
| DC / IC | 2.5–4.0 / 1.4–2.3 | Marcadamente reduzido |
| VS / SVI | 35–55 / 20–32 | |
| RVS | 1100–1500 | |
| PVC | **15–22** | **Muito elevada** |
| **PAP m** | **45–80** | **Marcadamente elevada** |
| PAOP | <15 | Pré-capilar |
| **PVR** | **600–1400** (6–14 WU) | Muito aumentada |
| EDV VD / RVEF | muito aumentado / 15–30% | Falência VD |
| GEDV/GEDI | aumentado | |
| dP/dt | 500–800 | |
| Eadyn | 0.5–0.8 | |
| HPI | 60–90 | Alto risco |
| ScvO₂ | 50–62% | Baixa (DC reduzido) |

**Morfologia**: **ECG** HVD marcada, P pulmonale, BCRD, strain VD direita, eixo extremo direito. **PAP** elevada (preset `hap_primaria`, prio 60). **CVP** onda a-cannon, v aumentada (IT funcional comum). **Arterial** pulso reduzido. **Pleth** modulação respiratória marcada.

**Notas**: **emergência funcional** — qualquer estresse hemodinâmico pode levar a colapso. Vasodilatador pulmonar específico (sildenafil, bosentan, prostaciclina IV/inalada). Anestesia: **manter SVR** (noradrenalina), **reduzir PVR** (NO inalado), **manter pré-carga VD** sem sobrecarregar. Fenilefrina ajuda. Inotrópico para VD: milrinona, dobutamina (cuidado com taquicardia).

**Refs**: ESC PH 2022.

---

### HAP secundária 🔧
- **Etiologia**: secundária a IC esquerda (grupo 2), pulmonar (grupo 3), TEP crônico (grupo 4).

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | similar a HAP primária mas geralmente menos severa | |
| PAOP | depende do grupo | Grupo 2: alto (>15) — pós-capilar |
| PVR | 200–600 | |
| PAP m | 30–55 | |

**Morfologia**: **PAP** elevada (preset `hap_primaria`, prio 55). Demais como HAP primária.

**Notas**: tratamento varia conforme grupo. Grupo 2 (IC esquerda): otimizar IC esquerda, vasodilatador específico geralmente NÃO é eficaz. Grupo 3 (pulmonar): otimizar pulmão. Grupo 4 (TEP crônico): endarterectomia se cirúrgico.

---

### TEP agudo 🔧
- **Etiologia**: trombo (membro inferior, fonte cardíaca, idiopático), embolia gordurosa, séptica, líquido amniótico.
- **Compensação**: aumento súbito de PVR → disfunção VD aguda.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 110–140 | Taquicardia marcada |
| PAS / PAD / PAM | 80–110 / 50–70 / 65–85 | Hipotensão se TEP maciço |
| DC / IC | 2.5–4.0 / 1.4–2.3 | Marcadamente reduzido |
| RVS | 1300–1800 | Vasoconstrição compensatória |
| PVC | **15–22** | Muito elevada |
| **PAP s/d/m** | **45–60 / 18–25 / 28–40** | Elevada agudamente |
| PVR | 400–800 | Muito aumentada |
| EDV VD / RVEF | aumentado / 20–35% | Falência VD aguda |
| GEDV/GEDI | aumentado | |
| dP/dt | 500–800 | |
| HPI | 70–95 | Muito alto |
| ScvO₂ | 50–60% | Baixa |
| SpO₂ | 88–94% | Hipoxemia |

**Morfologia**: **PAP** elevada com **trace afilado/spiky** (preset `tep_agudo`, prio 70 — distinto da HAP crônica). **ECG** padrão **S1Q3T3** (clássico mas pouco sensível), taquicardia sinusal, BCRD novo, eixo direito agudo. **CVP** onda a aumentada, x descida abolida (sobrecarga VD). **Arterial** pulso reduzido, paradoxo possível.

**Notas**: trombolíticos se choque (TEP maciço). Heparinização imediata. **Cuidado com volume** — pode piorar disfunção VD por desvio do septo (interdependência ventricular). Inotrópico VD (dobutamina/milrinona) + vasopressor (noradrenalina). NO inalado pode reduzir PVR.

---

## 3.5 Agudas / sequelas

### Pneumonia 🔧
- **Etiologia**: bacteriana, viral, fúngica.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 90–115 | Taqui (febre + estresse) |
| PAS / PAD / PAM | 100–125 / 60–80 / 75–95 | Pode evoluir pra séptico |
| DC / IC | 5.0–7.0 / 2.8–4.0 | Hiperdinâmico (sepse) |
| RVS | 800–1200 | Reduzido |
| PVC | 4–10 | |
| PAP m | 18–25 | Levemente ↑ |
| PVR | normal-↑ | |
| ScvO₂ | 70–80% | Hiperdinâmico |
| SpO₂ | 88–96% | Hipoxemia variável |

**Morfologia**: ECG taquicardia sinusal; demais geralmente normais.

**Notas**: pode evoluir pra sepse/SDRA. Antibioticoterapia. Suporte respiratório.

---

### SDRA / SARA 🔧
- **Etiologia**: sepse, pneumonia, aspiração, trauma, transfusão (TRALI).
- **Compensação**: lesão alveolar difusa, infiltrado bilateral, redução grave da complacência.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 100–130 | Taquicardia |
| PAS / PAD / PAM | 95–125 / 55–80 / 75–95 | |
| DC / IC | 4.5–6.5 / 2.5–3.7 | |
| RVS | 800–1200 | |
| PVC | 8–14 | |
| PAP m | 25–40 | Elevada (vasoconstrição hipóxica + edema) |
| PAOP | 8–14 | Baixa-normal (pré-capilar) |
| PVR | 300–600 | Aumentada |
| **EVLW/EVLWI** | **15–30 / 10–20** | **Marcadamente aumentado** (edema não-cardiogênico) |
| **PVPI** | **>3** | **Aumentado** (alta permeabilidade) |
| EDV VD / RVEF | aumentado / 30–45% | Falência VD |
| GEDV/GEDI | normal-↑ | |
| dP/dt | 600–900 | |
| HPI | 60–85 | |
| ScvO₂ | 60–70% | |
| SpO₂ | 80–94% (PEEP+FiO₂) | |
| PaO₂/FiO₂ | <300 (Berlin) | Definição |

**Morfologia**: **PAP** elevada (preset `hap_primaria` recomendado, prio 35). **ECG** taquicardia, sinais de sobrecarga VD. **CVP** onda a aumentada. **Pleth** modulação respiratória marcada (sob ventilação mecânica).

**Notas**: VM protetora (Vt 6 mL/kg, PEEP otimizado, plateau <30). Pronação. EVLW/PVPI no PiCCO discriminam edema cardiogênico (PVPI baixo) de SDRA (PVPI alto). Diurético se sobrecarga.

---

### COVID-19 — sequela pulmonar 🔧
- **Etiologia**: pós-COVID com fibrose pulmonar / DPOC pós-viral.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica em repouso | praticamente normal-leve alteração | |
| PVR | normal-↑ | |
| PAP m | 14–22 | |

**Morfologia**: sem padrão específico.

**Notas**: avaliação funcional respiratória pré-op. Risco aumentado de tromboembolismo (sequela de hipercoagulabilidade COVID).

---

### Pneumotórax recente 🔧
- **Etiologia**: espontâneo (bolhas, FC), traumático, iatrogênico.
- **Compensação**: redução de pré-carga (compressão torácica) + ventilação prejudicada.

| Variável | Faixa | Notas |
|---|---|---|
| FC | 90–115 | Taquicardia |
| PAS / PAD / PAM | 100–125 / 60–80 / 75–95 | Pode estar baixa em hipertensivo |
| DC / IC | 3.5–5.0 / 2.0–2.8 | Reduzido (pré-carga ↓) |
| PVC | 4–10 | Pode estar elevada se hipertensivo |
| SVV / PPV | 13–25% | Aumentada (preload-responsivo) |
| SpO₂ | 88–96% | Hipoxemia |

**Morfologia**: **ECG** baixa voltagem do lado afetado; eixo direito. Demais canais normais geralmente.

**Notas**: pneumotórax HIPERTENSIVO = emergência (descompressão imediata). N₂O contraindicado (expande). Drenagem antes de cirurgia.

---

### Derrame pleural 🔧
- **Etiologia**: cardiogênico, infeccioso, neoplásico, autoimune.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | depende do volume e da etiologia | |
| Restrição mecânica em derrame grande | reduz CV, ↑ trabalho respiratório | |

**Morfologia**: ECG geralmente normal.

**Notas**: drenagem pré-op se grande / sintomático.

---

### Traqueostomia 🔧
- **Etiologia**: ventilação prolongada, obstrução de via aérea alta, proteção de via aérea.

| Variável | Faixa | Notas |
|---|---|---|
| Hemodinâmica | sem repercussão direta | |

**Morfologia**: sem padrão específico.

**Notas**: contexto de via aérea (acesso direto, sem necessidade de intubação oral). Cuidado com cânula deslocada / obstruída no transporte.

---

## Histórico de revisões

| Data | Versão | Mudança |
|---|---|---|
| 2026-05-06 | 0.1 | Estrutura inicial; Cardiopatias completas (44 itens, todos 🔧); demais como stubs ⏳. |
| 2026-05-06 | 0.2 | Crônicas (34 itens) e Respiratórias (25 itens) preenchidas. Hepáticas com cirrose+POPH+SHP marcadas ✅ (já revisadas com literatura). Demais 🔧 = inicial pendente revisão. |
