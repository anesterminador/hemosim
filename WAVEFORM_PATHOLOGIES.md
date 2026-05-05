# Biblioteca de Morfologias Patológicas — Simulador Hemosphere

Baseado no *Atlas of Cardiovascular Monitoring* (Mark, 1998).
Use este documento como referência ao implementar `WAVE_PRESETS` no simulador.

## Componentes da onda PVC normal

| Componente | Fase φ | Amp típica | Origem mecânica |
|---|---|---|---|
| a wave | 0.07 | +3.2 mmHg | Contração atrial (após P) |
| c wave | 0.20 | +1.5 mmHg | Contração isovol. VD (após R) |
| x descent | 0.30 | −1.8 mmHg | Relaxamento atrial sistólico |
| v wave | 0.48 | +2.6 mmHg | Enchimento atrial (após T) |
| y descent | 0.60 | −2.0 mmHg | Abertura tricúspide |

## PVC patológico

### Cannon a wave (AV dissociation)
- **Visual:** onda gigante (até +20 mmHg) durante o QRS; átrio contra valva fechada
- **Receita:** `cvpY = 18 * gauss(phi, 0.18, 0.025)` substituindo a/c. Apenas em ~30% dos batimentos (random).

### Onda v gigante (regurgitação tricúspide)
- **Visual:** v atinge 15–25 mmHg, atrasado (~120ms após T), x descent some
- **Receita:** `cvpY += 12 * gauss(phi, 0.55, 0.060) - 4*gauss(phi, 0.30, 0.030)`. Mean 12–18.

### Onda a gigante (estenose tricúspide)
- **Visual:** a wave 15–20 mmHg, x normal, v normal
- **Receita:** `cvpY = 12*gauss(phi, 0.07, 0.020) + componentes normais`. Mean 10–15.

### Pericardite constritiva (sinal "M"/"W")
- **Visual:** a-c E v ambas proeminentes, x E y MUITO íngremes
- **Receita:**
  ```
  cvpY = 5*gauss(phi,0.10,0.020) + 5*gauss(phi,0.48,0.040)
       - 6*gauss(phi,0.27,0.020) - 6*gauss(phi,0.62,0.030)
  mean = 14
  ```
- **Sinal de Kussmaul:** PVC SOBE na inspiração (inverter sinal de respMod)

### Tamponamento cardíaco
- **Visual:** mean 18–22, x DOMINANTE, y OBLITERADA (quase plana)
- **Receita:** ondas a/c normais×1.2, x −5 mmHg, v normal, **y removida**
- **Combina com pulsus paradoxus arterial**

### Fibrilação atrial
- **Visual:** a wave SOME, ondas f finas (350–600/min), RR irregular, y descent proeminente
- **Receita:** `a=0`, adicionar `0.5*sin(phi*2*PI*8) + ruído`. RR log-normal σ=0.15.

### RV infarction (com x e y proeminentes, similar a constrição)
- **Receita:** mesma da constrição mas mean 13.

## PA arterial sistêmica patológica

### Hipovolemia
- **Visual:** pico estreito, PP ~30, PAM baixa, swing respiratório PPV>13%
- **Receita:** `pp = pp*0.5; map *= 0.7; upEnd = 0.06; decayK = 5.5; ppvBoost = 2.5`

### Hipertensão sistêmica (idoso)
- **Visual:** PP largo (>60), pico tardio em φ 0.12, dichrotic notch DESAPARECE
- **Receita:** `sap=170, dap=75, upEnd=0.12, decayK=1.8, notch_amp=0.02*pp`

### Insuficiência aórtica (water-hammer / Corrigan)
- **Visual:** SAP altíssima (160–180), DAP MUITO baixa (40–50), PP enorme (>80), upstroke abrupto, decay extremamente rápido, sem notch
- **Receita:** `sap=170, dap=45, upEnd=0.04, decayK=6.5, notch=false`

### Estenose aórtica (parvus et tardus)
- **Visual:** upstroke lento, "ombro" anacrótico, pico tardio E baixo, PP estreito
- **Receita:**
  ```
  sap=110, dap=70, upEnd=0.16
  if(phi_s < 0.05) art = dap + pp*0.3*(phi_s/0.05)
  else if(phi_s < 0.16) art = dap + pp*0.3 + pp*0.7*((phi_s-0.05)/0.11)
  ```

### Pulso bisferiens (CMHO + AI)
- **Visual:** dois picos sistólicos com vale entre
- **Receita:** dois picos em φ 0.06 e 0.16 com vale em 0.10

### Pulso alternante (ICC grave)
- **Visual:** amplitude alterna sístole forte / fraca
- **Receita:** `sapBeat = beat%2===0 ? sap*1.10 : sap*0.75`

### Pulso paradoxal (tamponamento, asma)
- **Visual:** queda >10 mmHg na sistólica durante INSPIRAÇÃO espontânea
- **Receita:** `sapBeat = sap0 * (1 + 0.18*sin(2*PI*respPhi - PI))`

### Fibrilação atrial
- **Visual:** SAP varia conforme RR_anterior (Frank-Starling)
- **Receita:** `sapBeat = sap0 * (RR_prev/RR_avg)^0.6`. RR irregular log-normal.

### Bigeminismo
- **Visual:** sístole forte → extrassístole fraca → pausa compensatória
- **Receita:** beat%2: forte / fraco (×0.55) com RR alternado

### Bypass cardiopulmonar (CPB)
- **Visual:** trace NÃO PULSÁTIL, só ruído da bomba
- **Receita:** `art = map + 2*sin(phi*2*PI*40) + ruído` (sem pulsação)

### Balão intra-aórtico (IABP 1:1)
- **Visual:** diástole AUMENTADA (insuflação), pré-sístole reduzida (deflação)
- **Receita:**
  ```
  if(phi_s > 0.42 && phi_s < 0.65)
    art += 0.7*pp*sin(PI*(phi_s-0.42)/0.23)
  if(phi_s > 0.85) art -= 0.15*pp
  ```

### Choque cardiogênico
- **Receita:** `sap=85, dap=65, pp=20, decayK=2.5`

### Choque séptico
- **Receita:** `sap=95, dap=45, pp=50, upEnd=0.06`

## PA pulmonar patológica

### Hipertensão pulmonar
- **Receita:** `papS=80, papD=30, papMean=50`

### TEP agudo
- **Receita:** `papS=55, papD=20, papMean=32, spiky=true`

## PCWP / Wedge patológica

### Estenose mitral
- **Receita:** `aWave=18 mmHg em φ 0.18, mean=22`

### Insuficiência mitral
- **Confirmado pelo Atlas (Fig 17.8–17.10):** v wave gigante, **picos APÓS T** (~120ms após pico arterial sistêmico), upstroke gradual
- **Receita:**
  ```
  pcwpY = 3*gauss(phi,0.18,0.020)
        + 25*gauss(phi,0.55,0.060)
        - 4*gauss(phi,0.65,0.040)
  mean = 28
  ```
- **Pode contaminar PA pulmonar** dando aspecto bífido com pico v atrasado

### Pericardite constritiva
- Equalização de pressões: PCWP, PVC, PAd ~15–18 mmHg

## ECG patológico

### Fibrilação atrial
- **Receita:** sem P, ondas f irregulares (350–600/min), RR log-normal σ=0.15

### Flutter atrial
- **Receita:** dente de serra `0.20 * abs(sin(phi*2*PI*5))`, condução variável (4:1, 2:1)

### Bloqueio AV 1º grau
- PR > 200 ms (P em 0.04, QRS em 0.22–0.24)

### Bloqueio AV 2º Mobitz I (Wenckebach)
- PR alongando: 180, 220, 260, 300, sem QRS, reset

### Bloqueio AV 2º Mobitz II
- PR fixo, alguns P sem QRS (2:1 ou 3:1)

### Bloqueio AV 3º grau
- Atrium ~80 bpm, ventricle ~30–40 bpm, COMPLETAMENTE dissociados
- P_phi e R_phi rodando independentes
- **Cannon a waves no PVC**

### Bloqueio de ramo
- QRS > 120 ms, alargado e entalhado: `R=1.0*gauss(phi,0.18,0.020) + 0.6*gauss(phi,0.215,0.015)`

### Isquemia/IAM
- ST elevado +0.25 mV no segmento (φ 0.24–0.36)

### Hipertrofia VE
- R muito alta (>2 mV), ST tipo "strain" (-0.15 mV)

### Pré-excitação WPW
- PR curto, onda delta no upslope: `+0.15*gauss(phi, 0.155, 0.008)`

### Marcapasso
- Espícula: `if(phi>0.155 && phi<0.158) y=1.5`, depois QRS alargado

### Extrassístole ventricular
- A cada N batimentos: QRS prematuro alargado, sem P, pausa compensatória

### TSV
- HR fixo 180, complexo estreito, P escondida

### TV monomórfica
- HR 180, QRS largo (>120), monomorfico

### Torsades de pointes
- Amplitude varia em "envelope": `R *= (1.0 + 0.8*sin(phi*2*PI*0.3))`

### Bradicardia
- HR < 50 ou pausas de 3–4s

## Pleth patológica

### Pulso paradoxal (PVI alto)
- `pleth *= (1 + 0.3*sin(2*PI*respPhi))`

### Sinal pobre
- `pleth = 0.4 + 0.2*shape + 0.15*random`

### Choque
- Amplitude quase ausente

## Estrutura JS sugerida

```javascript
const WAVE_PRESETS = {
  arterial: { /* ... */ },
  cvp: { /* ... */ },
  pap: { /* ... */ },
  pcwp: { /* ... */ },
  ecg: { /* ... */ },
  pleth: { /* ... */ },
};

state.wavePresets = { arterial:'normal', cvp:'normal', ecg:'normal', /* ... */ };

// Click handler na onda → modal
// Ao escolher patologia → tickWave usa as receitas do preset
```
