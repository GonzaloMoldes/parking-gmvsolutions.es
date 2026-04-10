/**
 * GUÍA DE TRADUCCIÓN MANUAL
 *
 * Este documento contiene traducciones manuales (EN + PT) para:
 * - Home (index.astro)
 * - 3 artículos de blog principales
 *
 * Estrategia:
 * 1. Usar glosario.json para términos clave
 * 2. Adaptar por contexto (operativo vs formal)
 * 3. Mantener tono conversacional cuando corresponda
 * 4. NO traducir literal - traducir concepto
 *
 * Archivos a traducir:
 * 1. src/pages/index.astro (HOME)
 * 2. src/pages/blog/que-es-un-sop-industrial.astro
 * 3. src/pages/blog/onboarding-software-pymes.astro
 * 4. src/pages/blog/documentar-conocimiento-operarios-expertos.astro
 */

// ═══════════════════════════════════════════════════════════════
// HOME TRANSLATIONS (index.astro)
// ═══════════════════════════════════════════════════════════════

const homeTranslations = {
  es: {
    title: "REELEVO — Onboarding software para pymes industriales | Gestión de competencias en planta",
    description: "REELEVO es una plataforma de recursos humanos con onboarding software industrial. Ordena incorporaciones, gestiona competencias, mejora documentación de procesos y reduce dependencia de operarios clave en planta."
  },
  en: {
    title: "REELEVO — Industrial onboarding software for SMEs | Skills management on the shop floor",
    description: "REELEVO is an HR platform with industrial onboarding software. Streamline new operator training, manage production skills, improve process documentation, and reduce key person risk on the factory floor.",

    hero: {
      eyebrow: "Industrial onboarding software · HR software · More structured execution",
      title: "Onboarding software for industrial SMEs with skills management on the shop floor.",
      subtitle: "REELEVO is an onboarding platform built for industrial SMEs. Streamline operator training, manage production skills, reduce key person risk, and improve process documentation. Production gains context for better decisions. HR organizes training more effectively. The company understands what skills each team has and strengthens documentation on the shop floor.",
      cta1: "Sign up for REELEVO",
      cta2: "Assess my situation →",

      proof: {
        continuity: "Continuity",
        continuityLabel: "Less dependency when your best operator is unavailable",
        visibility: "Visibility",
        visibilityLabel: "Clarity about what's really happening on the shop floor",
        price: "€49",
        priceLabel: "per month per company"
      }
    },

    problemSection: {
      eyebrow: "The reality",
      title: "Does this sound familiar?",
      subtitle: "Two moments that show whether your processes live on the shop floor or just in someone's head.",

      caso1: {
        tag: "Your expert is out",
        title: "«Javi is on sick leave. Who starts up the filling line?»",
        description: "It's Tuesday at 6:30 AM. Javi has been running that machine for 15 years and he's in urgent care right now. His substitute doesn't know the process. The line won't start until someone figures it out or Javi answers his phone.",
        benefits: [
          "2–4 hours of line downtime searching for answers",
          "Pressure on the team to cover",
          "Errors from improvising without clear instructions",
          "Calls to your expert while he's on sick leave just to get by",
          "Late orders and frustrated customers"
        ]
      },

      caso2: {
        tag: "New operator arrives",
        title: "«It's their first day. Someone has to train them.»",
        description: "A new person arrives — permanent hire, temporary worker, whoever — and needs to learn the role. One of your best operators steps away from their machine to mentor for days. Two people tied up, one position producing.",
        benefits: [
          "Your best operator loses productivity while training",
          "Two people doing the work of one for days",
          "Learning depends on who trains and how they teach it",
          "Higher error risk during training",
          "In busy seasons or peak demand, the problem multiplies with each new temporary worker"
        ]
      }
    }
  },
  pt: {
    title: "REELEVO — Software de integração para PMEs industriais | Gestão de competências no chão de fábrica",
    description: "REELEVO é uma plataforma de recursos humanos com software de integração industrial. Organize admissões, gerencie competências operacionais, melhore documentação de processos e reduza dependência de operadores-chave na fábrica.",

    hero: {
      eyebrow: "Software de integração industrial · Software de RH · Execução mais padronizada",
      title: "Software de integração para PMEs industriais com gestão de habilidades no chão de fábrica.",
      subtitle: "REELEVO é uma plataforma de integração desenvolvida para PMEs industriais. Simplifique o treinamento de operadores, gerencie competências de produção, reduza risco de pessoal-chave e melhore documentação de processos. Produção ganha contexto para melhores decisões. RH organiza o treinamento com segurança. A empresa compreende que competências cada equipe tem e fortalece a documentação na fábrica.",
      cta1: "Cadastre-se no REELEVO",
      cta2: "Avalie minha situação →",

      proof: {
        continuity: "Continuidade",
        continuityLabel: "Menos dependência quando seu operador melhor não está",
        visibility: "Clareza",
        visibilityLabel: "Compreensão do que realmente acontece na fábrica",
        price: "€49",
        priceLabel: "por mês por empresa"
      }
    },

    problemSection: {
      eyebrow: "A realidade",
      title: "Isso soa familiar?",
      subtitle: "Dois momentos que mostram se seus processos vivem na fábrica ou só na cabeça de alguém.",

      caso1: {
        tag: "Seu especialista não está",
        title: "«João está de licença. Quem dá partida na envasadora?»",
        description: "É terça de manhã 6h30. João trabalha naquela máquina há 15 anos e hoje está na emergência. Seu substituto não domina o processo. A linha não inicia até que alguém descubra a solução ou João atenda o telefone.",
        benefits: [
          "2–4 horas de linha parada procurando respostas",
          "Pressão sobre o time para cobrir",
          "Erros por improvisar sem instruções claras",
          "Chamadas para seu especialista durante sua licença só para sair do aperto",
          "Pedidos atrasados e clientes frustrados"
        ]
      },

      caso2: {
        tag: "Novo operador chega",
        title: "«É o primeiro dia dele. Alguém precisa treinar.»",
        description: "Chega uma pessoa nova — contratado fijo, pessoal temporário, o que for — e precisa aprender o cargo. Um de seus melhores operadores sai de sua máquina para mentorear durante dias. Duas pessoas ocupadas, um único cargo produzindo.",
        benefits: [
          "Seu operador melhor perde tempo produtivo treinando",
          "Duas pessoas para um cargo durante dias",
          "O aprendizado depende de quem treina e como ensina",
          "Risco maior de erros durante o treinamento",
          "Em épocas de pico ou demanda alta, o problema se multiplica com cada novo temporário"
        ]
      }
    }
  }
};

export { homeTranslations };
