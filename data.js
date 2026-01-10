/* Dados do Planner (offline) */
const STUDY_DATA = {
  "meta": {
    "title": "Planejamento de Estudos — Vestibular UEL",
    "version": "1.0",
    "generated_on": "2026-01-09",
    "notes": [
      "Planejamento baseado no modelo descrito no Manual do Candidato do Processo Seletivo Vestibular UEL 2026 (fase única: 1º dia com Prova de Conhecimentos Gerais — 60 questões objetivas — e Prova de Redação; 2º dia (quando exigido pelo curso) com Prova de Conhecimentos Específicos discursiva).",
      "Obras literárias indicadas para o ciclo 2025–2026–2027 estão incluídas na seção Literatura.",
      "O plano semanal e a revisão programada (1–3–7–14–30 dias) são gerados no navegador, a partir da sua data de prova e carga horária.",
      "Seu progresso é salvo localmente (no navegador). Use Exportar/Importar para backup ou para trocar de dispositivo."
    ]
  },
  "uel": {
    "tracks": [
      {
        "id": "A",
        "name": "Trilha A — Cursos sem Prova de Conhecimentos Específicos",
        "exam_model": {
          "days": [
            {
              "day": 1,
              "components": [
                "Conhecimentos Gerais (Objetiva)",
                "Redação"
              ]
            }
          ],
          "key_points": [
            "1º dia: Prova de Conhecimentos Gerais (objetiva) com 60 questões de múltipla escolha.",
            "Prova de Redação: 1 (uma) única proposta.",
            "Gestão de tempo: questões + redação no mesmo dia.",
            "Treine com provas anteriores no formato UEL e corrija por um caderno de erros."
          ]
        },
        "focus": [
          "Dominar interpretação de textos e redação (alta alavancagem).",
          "Treinar ritmo de prova: 60 questões + redação no mesmo dia."
        ],
        "default_weights": {
          "Português & Redação": 0.3,
          "Matemática": 0.18,
          "Ciências da Natureza": 0.2,
          "Humanas": 0.2,
          "Língua Estrangeira": 0.08,
          "Sociologia (reforço)": 0.04
        }
      },
      {
        "id": "B",
        "name": "Trilha B — Cursos com Prova de Conhecimentos Específicos (Discursiva)",
        "exam_model": {
          "days": [
            {
              "day": 1,
              "components": [
                "Conhecimentos Gerais (Objetiva)",
                "Redação"
              ]
            },
            {
              "day": 2,
              "components": [
                "Conhecimentos Específicos (Discursiva) — Sociologia + 2 disciplinas prioritárias"
              ]
            }
          ],
          "key_points": [
            "1º dia: Prova de Conhecimentos Gerais (objetiva) + Redação (1 proposta).",
            "2º dia (quando exigido pelo curso): Conhecimentos Específicos com 9 questões discursivas em 3 disciplinas.",
            "Sociologia é comum e obrigatória; as outras 2 são disciplinas prioritárias do curso.",
            "Treine resposta discursiva: tese → justificativa → exemplo → conclusão."
          ]
        },
        "focus": [
          "Além do núcleo comum, elevar MUITO as 2 disciplinas prioritárias.",
          "Treinar respostas discursivas: argumentação, justificativa e clareza."
        ],
        "default_weights": {
          "Português & Redação": 0.24,
          "Matemática": 0.1,
          "Ciências da Natureza": 0.16,
          "Humanas": 0.14,
          "Língua Estrangeira": 0.08,
          "Sociologia (obrigatória)": 0.1,
          "Prioridade 1": 0.09,
          "Prioridade 2": 0.09
        }
      }
    ],
    "literature": {
      "title": "Obras literárias indicadas (UEL 2025–2026–2027)",
      "items": [
        {
          "type": "obra",
          "title": "O rei da vela",
          "author": "Oswald de Andrade"
        },
        {
          "type": "obra",
          "title": "O seminarista",
          "author": "Bernardo Guimarães"
        },
        {
          "type": "obra",
          "title": "Niketche",
          "author": "Paulina Chiziane"
        },
        {
          "type": "obra",
          "title": "Torto arado",
          "author": "Itamar Vieira Junior"
        },
        {
          "type": "obra",
          "title": "Melhores poemas",
          "author": "Fernando Pessoa"
        },
        {
          "type": "obra",
          "title": "Chove sobre minha infância",
          "author": "Miguel Sanches Neto"
        },
        {
          "type": "obra",
          "title": "Cartas chilenas",
          "author": "Tomás Antônio Gonzaga"
        },
        {
          "type": "álbum",
          "title": "Cabeça dinossauro",
          "author": "Titãs"
        }
      ]
    },
    "revision_intervals_days": [
      1,
      3,
      7,
      14,
      30
    ]
  },
  "subjects": [
    {
      "id": "port",
      "name": "Língua Portuguesa",
      "area": "Linguagens",
      "modules": [
        {
          "id": "port-int",
          "title": "Interpretação de texto e leitura crítica",
          "hours": 8,
          "outcomes": [
            "Localizar ideias centrais e inferências",
            "Identificar tese, argumentos e estratégias retóricas",
            "Resolver questões de interpretação com rapidez"
          ],
          "practice": [
            "Questões de provas anteriores (foco em textos longos)",
            "Mapa de ideias por parágrafo (1–2 linhas)"
          ]
        },
        {
          "id": "port-gram",
          "title": "Gramática em contexto",
          "hours": 10,
          "outcomes": [
            "Concordância e regência mais cobradas",
            "Crase e colocação pronominal",
            "Pontuação e efeitos de sentido"
          ],
          "practice": [
            "10 itens por tópico + correção ativa",
            "Reescrever frases mudando pontuação e sentido"
          ]
        },
        {
          "id": "port-sint",
          "title": "Sintaxe e coesão",
          "hours": 8,
          "outcomes": [
            "Período composto e funções sintáticas",
            "Coesão referencial e sequencial",
            "Conectivos e organização lógica"
          ],
          "practice": [
            "Identificar função de termos em frases reais",
            "Criar parágrafos com conectivos-alvo"
          ]
        },
        {
          "id": "port-lit",
          "title": "Literatura: movimentos e leitura comparada",
          "hours": 10,
          "outcomes": [
            "Reconhecer escolas literárias",
            "Relacionar contexto histórico e estética",
            "Comparar narrador, linguagem e temas"
          ],
          "practice": [
            "Quadros comparativos por movimento",
            "Mini-ensaios (10–12 linhas) sobre obras"
          ]
        }
      ]
    },
    {
      "id": "red",
      "name": "Redação",
      "area": "Linguagens",
      "modules": [
        {
          "id": "red-base",
          "title": "Dissertação-argumentativa: estrutura e tese",
          "hours": 8,
          "outcomes": [
            "Tese clara + 2 argumentos fortes",
            "Paragrafação funcional",
            "Conclusão propositiva (quando aplicável)"
          ],
          "practice": [
            "1 redação/semana no começo, 2/semana no meio, 3/semana no fim",
            "Checklist de revisão (ortografia, coesão, tema)"
          ]
        },
        {
          "id": "red-rep",
          "title": "Repertório sociocultural e exemplos",
          "hours": 6,
          "outcomes": [
            "Construir banco de repertórios por tema",
            "Usar dados e referências sem decorar demais",
            "Citar sem inventar"
          ],
          "practice": [
            "Cartões de repertório (tema → 3 exemplos)",
            "Reescrever introduções mudando repertório"
          ]
        },
        {
          "id": "red-rev",
          "title": "Revisão e reescrita estratégica",
          "hours": 6,
          "outcomes": [
            "Diagnosticar erros recorrentes",
            "Reescrever melhorando coesão e precisão",
            "Gerenciar tempo de prova"
          ],
          "practice": [
            "Reescrever 1 texto antigo por semana",
            "Cronometrar 60–80 min por redação (treino)"
          ]
        }
      ]
    },
    {
      "id": "mat",
      "name": "Matemática",
      "area": "Exatas",
      "modules": [
        {
          "id": "mat-fund",
          "title": "Fundamentos, álgebra e proporcionalidade",
          "hours": 10,
          "outcomes": [
            "Operações, frações, potências, radicais",
            "Razão, proporção, regra de três, porcentagem",
            "Equações e inequações"
          ],
          "practice": [
            "Lista mista de 30 questões/semana",
            "Erro log: registrar 5 erros e refazer após 3 dias"
          ]
        },
        {
          "id": "mat-fun",
          "title": "Funções (afim, quadrática, exponencial, log)",
          "hours": 12,
          "outcomes": [
            "Analisar gráficos e variações",
            "Resolver problemas contextualizados",
            "Transformações e composição simples"
          ],
          "practice": [
            "10 questões por tipo + 2 problemas longos",
            "Desenhar gráfico à mão (treino de visão)"
          ]
        },
        {
          "id": "mat-geo",
          "title": "Geometria e trigonometria",
          "hours": 12,
          "outcomes": [
            "Semelhança, áreas, volumes",
            "Trigonometria no triângulo e círculo",
            "Geometria analítica básica"
          ],
          "practice": [
            "Problemas de figura + justificativa",
            "Criar “fichas de fórmulas” e testar sem cola"
          ]
        },
        {
          "id": "mat-prob",
          "title": "Probabilidade e estatística",
          "hours": 8,
          "outcomes": [
            "Leitura de gráficos/tabelas",
            "Média, mediana, desvio/variância no essencial",
            "Probabilidade básica e contagem"
          ],
          "practice": [
            "Resolver questões com dados reais",
            "Criar 3 questões próprias e resolver"
          ]
        }
      ]
    },
    {
      "id": "fis",
      "name": "Física",
      "area": "Natureza",
      "modules": [
        {
          "id": "fis-cin",
          "title": "Cinemática e dinâmica",
          "hours": 12,
          "outcomes": [
            "MRU/MRUV, gráficos",
            "Leis de Newton e forças",
            "Trabalho, energia e potência"
          ],
          "practice": [
            "Questões por gráfico + unidade",
            "Resolução discursiva: sempre escrever hipótese e fórmula"
          ]
        },
        {
          "id": "fis-ond",
          "title": "Ondulatória, óptica e termologia",
          "hours": 10,
          "outcomes": [
            "Características de ondas",
            "Óptica geométrica e formação de imagens",
            "Calorimetria e mudanças de estado"
          ],
          "practice": [
            "Problemas de espelho/lente",
            "Exercícios de conservação de energia térmica"
          ]
        },
        {
          "id": "fis-ele",
          "title": "Eletricidade e magnetismo (essencial)",
          "hours": 10,
          "outcomes": [
            "Circuitos simples (Lei de Ohm)",
            "Potência elétrica",
            "Campo magnético e indução (noção)"
          ],
          "practice": [
            "Montar mapas de circuito",
            "10 questões de associação conceito→situação"
          ]
        }
      ]
    },
    {
      "id": "qui",
      "name": "Química",
      "area": "Natureza",
      "modules": [
        {
          "id": "qui-mat",
          "title": "Matéria, átomos, ligações e estequiometria",
          "hours": 12,
          "outcomes": [
            "Modelos atômicos e tabela periódica",
            "Ligações e propriedades",
            "Cálculos estequiométricos"
          ],
          "practice": [
            "Lista de cálculos curtos diária (15–20min)",
            "Reescrever passos de cálculo sem pular etapa"
          ]
        },
        {
          "id": "qui-sol",
          "title": "Soluções, termoquímica e cinética",
          "hours": 10,
          "outcomes": [
            "Concentrações e diluição",
            "Entalpia e calor",
            "Fatores que afetam velocidade"
          ],
          "practice": [
            "Problemas de concentração com unidades",
            "Questões de gráfico energia vs reação"
          ]
        },
        {
          "id": "qui-equ",
          "title": "Equilíbrio, ácido-base e eletroquímica",
          "hours": 12,
          "outcomes": [
            "Le Chatelier",
            "pH/pOH (nível vestibular)",
            "Pilhas e eletrólise (conceitos)"
          ],
          "practice": [
            "Quadros de comparação (ácidos/bases)",
            "Problemas de pilhas com identificação de ânodo/cátodo"
          ]
        },
        {
          "id": "qui-org",
          "title": "Orgânica (funções e reações mais comuns)",
          "hours": 12,
          "outcomes": [
            "Identificar funções orgânicas",
            "Isomeria básica",
            "Reações: combustão, adição, substituição (no essencial)"
          ],
          "practice": [
            "Nomear 20 estruturas/semana",
            "Criar flashcards de função→exemplo"
          ]
        }
      ]
    },
    {
      "id": "bio",
      "name": "Biologia",
      "area": "Natureza",
      "modules": [
        {
          "id": "bio-cel",
          "title": "Citologia e metabolismo",
          "hours": 10,
          "outcomes": [
            "Organelas e funções",
            "Membrana e transportes",
            "Respiração e fotossíntese (visão sistêmica)"
          ],
          "practice": [
            "Desenhar célula e explicar",
            "Questões com pegadinhas de organelas"
          ]
        },
        {
          "id": "bio-gen",
          "title": "Genética e biotecnologia",
          "hours": 12,
          "outcomes": [
            "Leis de Mendel e cruzamentos",
            "DNA/RNA e síntese proteica",
            "Noções de biotecnologia e ética"
          ],
          "practice": [
            "Resolver 15 cruzamentos/semana",
            "Explicar em voz alta (técnica Feynman)"
          ]
        },
        {
          "id": "bio-eco",
          "title": "Ecologia e evolução",
          "hours": 10,
          "outcomes": [
            "Ciclos biogeoquímicos",
            "Dinâmica de populações",
            "Seleção natural e evidências"
          ],
          "practice": [
            "Mapas de ciclos (carbono, nitrogênio)",
            "Questões com gráficos populacionais"
          ]
        },
        {
          "id": "bio-fis",
          "title": "Fisiologia humana (alta recorrência)",
          "hours": 14,
          "outcomes": [
            "Sistemas: digestório, respiratório, circulatório",
            "Endócrino e nervoso",
            "Imunologia básica"
          ],
          "practice": [
            "Resumo por sistema em 1 página",
            "Questões intersistêmicas (ex.: exercício físico)"
          ]
        }
      ]
    },
    {
      "id": "his",
      "name": "História",
      "area": "Humanas",
      "modules": [
        {
          "id": "his-bra",
          "title": "História do Brasil (Colônia → República)",
          "hours": 14,
          "outcomes": [
            "Processos (não só datas)",
            "Economia, sociedade e política",
            "Interpretação de fontes (charges, textos)"
          ],
          "practice": [
            "Linha do tempo temática",
            "Responder 2 questões discursivas/semana"
          ]
        },
        {
          "id": "his-ger",
          "title": "História Geral (Antiga → Contemporânea)",
          "hours": 12,
          "outcomes": [
            "Formações políticas e revoluções",
            "Guerras mundiais e Guerra Fria",
            "Descolonização e globalização"
          ],
          "practice": [
            "Quadros causa→consequência",
            "Resumo de 8–10 linhas por tema"
          ]
        },
        {
          "id": "his-par",
          "title": "Paraná e regionalidades (quando aparecer)",
          "hours": 4,
          "outcomes": [
            "Noções de formação regional",
            "Economia e sociedade paranaense"
          ],
          "practice": [
            "Estudo dirigido + questões de provas anteriores"
          ]
        }
      ]
    },
    {
      "id": "geo",
      "name": "Geografia",
      "area": "Humanas",
      "modules": [
        {
          "id": "geo-fis",
          "title": "Geografia física (clima, relevo, hidrografia)",
          "hours": 10,
          "outcomes": [
            "Processos climáticos e fenômenos",
            "Relevo brasileiro e mundial",
            "Questões ambientais"
          ],
          "practice": [
            "Interpretar mapas e climogramas",
            "Relacionar clima→bioma→uso do solo"
          ]
        },
        {
          "id": "geo-hum",
          "title": "Geografia humana e economia",
          "hours": 12,
          "outcomes": [
            "Urbanização e redes",
            "Agricultura e indústria",
            "Globalização e geopolítica"
          ],
          "practice": [
            "Estudos de caso (Brasil/PR)",
            "Questões com gráficos socioeconômicos"
          ]
        },
        {
          "id": "geo-car",
          "title": "Cartografia e leitura de dados",
          "hours": 6,
          "outcomes": [
            "Escala, coordenadas e projeções",
            "Leitura de mapas temáticos",
            "Interpretação de tabelas"
          ],
          "practice": [
            "10 exercícios de escala",
            "Construir mapa mental de tipos de projeção"
          ]
        }
      ]
    },
    {
      "id": "fil",
      "name": "Filosofia",
      "area": "Humanas",
      "modules": [
        {
          "id": "fil-his",
          "title": "História da filosofia (antiga → contemporânea)",
          "hours": 10,
          "outcomes": [
            "Reconhecer autores e problemas filosóficos",
            "Comparar correntes",
            "Aplicar conceitos a situações"
          ],
          "practice": [
            "Fichas: autor→conceito→exemplo",
            "Mini-redações de 12 linhas"
          ]
        },
        {
          "id": "fil-et",
          "title": "Ética e política",
          "hours": 8,
          "outcomes": [
            "Virtude, dever, utilitarismo",
            "Estado, poder, democracia",
            "Direitos e justiça"
          ],
          "practice": [
            "Debate escrito: tese e antítese",
            "Questões discursivas (argumentação)"
          ]
        }
      ]
    },
    {
      "id": "soc",
      "name": "Sociologia",
      "area": "Humanas",
      "modules": [
        {
          "id": "soc-cl",
          "title": "Clássicos (Marx, Durkheim, Weber)",
          "hours": 10,
          "outcomes": [
            "Fato social, ação social, mais-valia, etc.",
            "Aplicar conceitos em exemplos brasileiros"
          ],
          "practice": [
            "Cartões de conceitos",
            "Questões discursivas com argumento+exemplo"
          ]
        },
        {
          "id": "soc-tem",
          "title": "Temas contemporâneos",
          "hours": 10,
          "outcomes": [
            "Cultura e mídia",
            "Trabalho, desigualdade e raça/gênero (conceitual)",
            "Movimentos sociais e política"
          ],
          "practice": [
            "Resumos temáticos de 1 página",
            "Responder: “como isso aparece no Brasil?”"
          ]
        }
      ]
    },
    {
      "id": "ing",
      "name": "Língua Estrangeira (Inglês/Espanhol)",
      "area": "Linguagens",
      "modules": [
        {
          "id": "ing-read",
          "title": "Leitura e estratégias (skimming/scanning)",
          "hours": 8,
          "outcomes": [
            "Entender ideia central rapidamente",
            "Reconhecer cognatos e falsos cognatos",
            "Inferir vocabulário pelo contexto"
          ],
          "practice": [
            "1 texto curto/dia + 5 questões",
            "Anotar 10 palavras úteis/semana"
          ]
        },
        {
          "id": "ing-gram",
          "title": "Gramática funcional para leitura",
          "hours": 6,
          "outcomes": [
            "Tempos verbais mais comuns",
            "Pronomes, conectivos e voz passiva",
            "Estruturas de comparação/condição"
          ],
          "practice": [
            "Exercícios de identificação em textos",
            "Reescrita curta (transformações)"
          ]
        }
      ]
    },
    {
      "id": "art",
      "name": "Artes (reforço opcional)",
      "area": "Linguagens",
      "modules": [
        {
          "id": "art-bas",
          "title": "Elementos da linguagem visual + história da arte (panorama)",
          "hours": 6,
          "outcomes": [
            "Elementos: cor, forma, composição",
            "Movimentos principais",
            "Leitura de imagens"
          ],
          "practice": [
            "Analisar 1 obra/semana (descrição→interpretação)",
            "Questões com imagens (provas anteriores quando houver)"
          ]
        }
      ]
    }
  ],
  "exercise_bank": {
    "note": "Exercícios aqui são originais (não copiam questões da UEL). Use provas anteriores para treino real.",
    "items": [
      {
        "module_id": "port-int",
        "questions": [
          {
            "type": "multipla",
            "prompt": "Em um texto argumentativo, qual alternativa melhor descreve a função de um exemplo concreto dentro do parágrafo?",
            "options": [
              "Substituir a tese por uma narrativa",
              "Ilustrar e sustentar o argumento apresentado",
              "Evitar a necessidade de conectivos",
              "Trocar o tema por outro mais fácil"
            ],
            "answer": 1,
            "explanation": "Exemplos concretos servem para sustentar/ilustrar o argumento e tornar a ideia verificável."
          },
          {
            "type": "multipla",
            "prompt": "Ao identificar a tese de um texto, você deve procurar principalmente:",
            "options": [
              "Uma lista de dados numéricos",
              "A opinião central defendida pelo autor",
              "A primeira palavra do texto",
              "A biografia do autor"
            ],
            "answer": 1,
            "explanation": "A tese é a posição central que organiza o texto."
          },
          {
            "type": "discursiva",
            "prompt": "Explique (em 5–7 linhas) a diferença entre 'resumo' e 'paráfrase' e diga quando cada um é útil em estudos.",
            "answer_text": "Resumo: condensação das ideias principais com pouca extensão. Paráfrase: reescrita com outras palavras mantendo sentido. Resumo é ótimo para memorizar estrutura e priorizar; paráfrase ajuda a testar compreensão e evitar cópia literal."
          }
        ]
      },
      {
        "module_id": "mat-fun",
        "questions": [
          {
            "type": "multipla",
            "prompt": "Uma função afim f(x)=ax+b é crescente quando:",
            "options": [
              "a<0",
              "a=0",
              "a>0",
              "b>0"
            ],
            "answer": 2,
            "explanation": "A inclinação (a) define crescimento/decrescimento."
          },
          {
            "type": "discursiva",
            "prompt": "Dada f(x)=2x-5, encontre x quando f(x)=9 e explique o passo a passo.",
            "answer_text": "2x-5=9 ⇒ 2x=14 ⇒ x=7. Isola-se x somando 5 e dividindo por 2."
          }
        ]
      },
      {
        "module_id": "soc-cl",
        "questions": [
          {
            "type": "discursiva",
            "prompt": "Em 8–10 linhas, use um conceito de Durkheim para explicar por que certas regras sociais parecem 'naturais' para quem vive em um grupo.",
            "answer_text": "Durkheim fala em fato social: maneiras de agir/pensar exteriores ao indivíduo e dotadas de poder coercitivo. Ao nascer em um grupo, o indivíduo internaliza normas por educação, punições e recompensas; com o tempo, parecem naturais, embora sejam construídas socialmente."
          }
        ]
      },
      {
        "module_id": "qui-mat",
        "questions": [
          {
            "type": "multipla",
            "prompt": "Se você dobrar a quantidade de reagente limitante mantendo o excesso constante, o que tende a acontecer com a quantidade máxima de produto?",
            "options": [
              "Diminui",
              "Aumenta (aprox. proporcionalmente)",
              "Fica igual",
              "Vira imprevisível"
            ],
            "answer": 1,
            "explanation": "O reagente limitante determina o teto de produto; dobrá-lo tende a dobrar o máximo, se tudo mais permite."
          }
        ]
      }
    ]
  }
};
