import { cookies, headers } from "next/headers";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

const defaultLocale: Locale = "en";
const localeCookieName = "wc26_locale";
const localeHeaderName = "x-wc26-locale";

export const translations = {
  en: {
    footer: "Data provided by football-data.org",
    settings: {
      title: "Settings",
      language: "Language",
      english: "English",
      spanish: "Spanish",
    },
    common: {
      backHome: "Back home",
      backDashboard: "Back to dashboard",
      signedInAs: "Signed in as",
      signOut: "Sign out",
      members: "members",
      inviteCode: "Invite code",
      openGroup: "Open group",
      noGroupsYet: "No groups yet",
      noGroupsCopy: "Create your first private group or join one with an invite code.",
      open: "Open",
      locked: "Locked",
      venueTbd: "Venue TBD",
      finalScore: "Final score",
      home: "Home",
      away: "Away",
      savePick: "Save pick",
      savingPick: "Saving...",
      savedPick: "Saved",
    },
    auth: {
      appName: "WC26 Predictions",
      signInTitle: "Passwordless sign-in for your World Cup prediction group.",
      signInCopy:
        "Enter your email and the app will issue a short-lived one-time code. If Resend is configured, the code is delivered by email. Otherwise, the app falls back to showing the code on the next screen for local development.",
      loginEyebrow: "Login",
      loginTitle: "Log in with your email",
      loginCopy:
        "Enter your email and we’ll send you a one-time code to get back into your account.",
      registerEyebrow: "Register",
      registerTitle: "Create your account",
      registerCopy:
        "Enter your email and choose a username so we can create your account before sending the code.",
      localAuth: "Passwordless local auth",
      authEyebrow: "Auth",
      authCardTitle: "Request a one-time sign-in code",
      authCardCopy:
        "If the email is new, the app will create the account after the code is verified using the username you provide here.",
      email: "Email",
      username: "Username",
      usernamePlaceholder: "Only needed for registration",
      sendCode: "Send sign-in code",
      verifyEyebrow: "Verify sign-in",
      verifyTitle: "Enter the one-time code for",
      verifyCopy: "The code expires after 15 minutes and can only be used once.",
      requestNewCode: "Request a new code",
      registerNow: "Register now",
      login: "Log in",
      noAccountTitle: "No account found for this email",
      noAccountCopy: "Check that the email is correct, or register now if this is a new account.",
      accountExistsTitle: "An account already exists",
      accountExistsCopy: "Try logging in with this email instead.",
      codeEyebrow: "Code",
      finishSignIn: "Finish signing in",
      verificationCode: "Verification code",
      developmentCode: "Development code",
      verifyAndSignIn: "Verify and sign in",
      continue: "Continue",
      switchToLogin: "Already have an account? Log in",
      switchToRegister: "Need an account? Register",
      productionEmailNote:
        "In production, you would normally receive this code by email.",
      emailPlaceholder: "you@example.com",
      verificationCodePlaceholder: "123456",
    },
    home: {
      appName: "World Cup 2026 Predictions",
      appSummary: "An app for World Cup predictions.",
      appIntro:
        "Make predictions for World Cup matches, join private groups, and track points with friends.",
      register: "Register",
      login: "Login",
      tagline: "Private groups. Match picks. Live leaderboard drama.",
      learnBanner: "Learn full stack by building something social and score-driven",
      heroTitle: "Make World Cup predictions with friends and rank every pick.",
      heroCopy:
        "This starter is designed around your project idea: users join a group, submit predictions before kickoff, earn points for exact scores or correct outcomes, and climb a shared leaderboard.",
      openDashboard: "Open dashboard",
      sampleLeaderboard: "View sample leaderboard",
      enterResults: "Enter match results",
      snapshot: "Matchday Snapshot",
      upcomingMatches: "Upcoming matches",
      snapshotCopy: "Today and tomorrow’s fixtures, in a short scrollable list.",
      today: "Today",
      tomorrow: "Tomorrow",
      noUpcomingMatches: "No upcoming matches right now.",
      rulesEyebrow: "Rules",
      rulesTitle: "How predictions work",
      rulesIntro:
        "Make one score prediction per match inside each private group before that prediction locks.",
      exactScoreRule: "Exact score",
      exactScoreRuleCopy: "Get the final score exactly right for 3 points.",
      outcomeRule: "Correct outcome",
      outcomeRuleCopy: "Pick the right winner or draw for 1 point if the score is not exact.",
      deadlineRule: "Prediction deadlines",
      deadlineRuleCopy:
        "Each match locks at its own kickoff, so you can keep editing a prediction until that game starts.",
      separateGroupsRule: "Separate groups",
      separateGroupsRuleCopy:
        "If you join more than one group, enter predictions in each group separately. Your picks can be different from group to group.",
      groups: "Groups",
      privateLeagues: "Private groups",
      scoring: "Scoring",
      exactOutcome: "Exact + outcome",
      competition: "Competition",
      liveRanking: "Live ranking",
      yourGroups: "Your groups",
      jumpIntoLeague: "Jump into a group and start making picks",
      create: "Create",
      startPrivateGroup: "Start a new private group",
      join: "Join",
      enterInviteCode: "Enter a group's invite code to join",
      users: "Users",
      usersTitle: "People create or join private groups",
      usersCopy:
        "Each group becomes its own mini competition. The app will support invites, membership roles, and a shared leaderboard so friends or coworkers can compete together.",
      predictions: "Predictions",
      predictionsTitle: "One pick per match before kickoff",
      predictionsCopy:
        "Users predict the home and away score for every match. Once kickoff passes, the prediction locks and waits for the official final result.",
      scoringTitle: "Simple rules that still feel competitive",
      scoringCopy:
        "The scoring model starts intentionally small so you can focus on learning the full stack before adding bonus questions or knockout tie-breakers.",
      scoringModel: "Scoring model for v1",
      exactScore: "Exact score",
      exactScoreCopy: "Predict the final scoreline correctly.",
      correctWinner: "Correct winner or draw",
      correctWinnerCopy: "Get the match outcome right even if the score is off.",
      wrongOutcome: "Wrong outcome",
      wrongOutcomeCopy: "No points for an incorrect winner or draw call.",
      sampleStandings: "Sample standings for a group",
      leaderboardCopy:
        "The real leaderboard lives on each group page. This sample shows the scoring shape before you have match results to total up.",
      nextTarget: "Next build target",
      nextTitle: "Group pages are now the center of the app",
      nextCopy:
        "Open a group to see the database-backed match list, save predictions, and watch the leaderboard update as results come in. Authentication now uses a simple Prisma-backed session so each user can have their own groups and picks.",
    },
    groupForms: {
      groupName: "Group name",
      groupNamePlaceholder: "Friday Friends",
      displayName: "Display name in this group",
      displayNamePlaceholder: "Kiara",
      createGroup: "Create group",
      inviteCode: "Invite code",
      inviteCodePlaceholder: "WC26DE",
      joinGroup: "Join group",
    },
    groupPage: {
      overview: "Group overview",
      makingPicks: "and making picks in this group.",
      matches: "Matches",
      navigate: "Navigate the tournament your way",
      leaderboard: "Leaderboard",
      leaderboardTitle: "Live standings for this group",
      leaderboardCopy:
        "Score 3 points for an exact score, 1 point for the correct winner or draw, and 0 points if the outcome is wrong.",
      members: "Members",
      inviteCode: "Invite code",
      player: "Player",
      exact: "Exact",
      outcome: "Outcome",
      total: "Total",
      ongoingPredictions: {
        eyebrow: "Live picks",
        title: "Predictions for the current match",
        copy:
          "From kickoff until shortly after the match, everyone in the group can see the picks for that game. Light green means the pick currently has the right outcome; stronger green means it matches the current score exactly.",
        currentScore: "Current score",
        noScore: "Score not available yet",
        noPick: "No pick",
        exact: "Exact",
        outcome: "Outcome",
      },
      management: {
        title: "Manage group",
        ownerTools: "Group settings",
        ownerToolsCopy:
          "Owners can remove members or delete the group. Any member can leave. Leaving or being removed deletes that member's predictions in this group.",
        transferOwner: "Choose a new owner before leaving",
        transferOwnerPlaceholder: "Select a member",
        removeMember: "Remove member",
        leaveGroup: "Leave group",
        deleteGroup: "Delete group",
        ownerBadge: "Owner",
        youBadge: "You",
        leaveWarning:
          "Are you sure you want to leave this group? All predictions you entered in this group will be lost.",
        removeWarning:
          "Are you sure you want to remove this member? All predictions they entered in this group will be lost.",
        deleteWarning:
          "Are you sure you want to delete this group? All members and all predictions entered in this group will be lost.",
      },
    },
    matchBrowser: {
      toggleMenu: "Toggle Menu",
      dateMenu: "Search matches by date",
      stageMenu: "Search matches by stage",
      groupStage: "Group stage",
      knockoutBracket: "Knockout bracket",
      backToGroups: "Back to groups",
      round: "Round",
      cup: "Cup",
      match: "match",
      matches: "matches",
    },
    admin: {
      dataOps: "Data Ops",
      title: "Sync World Cup fixtures and results",
      copy:
        "The app can pull matches and final scores from football-data.org, then automatically update prediction points for every group.",
      lastSync: "Last sync",
      noSync: "No automatic sync has run yet.",
      manualOverride: "Manual override",
      manualCopy:
        "You should not need this often, but it stays available in case an external result is delayed or needs correction.",
      syncNow: "Sync fixtures and results now",
      confirmed: "Confirmed",
      pending: "Pending",
      homeScore: "Home score",
      awayScore: "Away score",
      updateResult: "Update result",
      confirmResult: "Confirm result",
    },
  },
  es: {
    footer: "Datos proporcionados por football-data.org",
    settings: {
      title: "Configuración",
      language: "Idioma",
      english: "Inglés",
      spanish: "Español",
    },
    common: {
      backHome: "Volver al inicio",
      backDashboard: "Volver al inicio",
      signedInAs: "Sesión iniciada como",
      signOut: "Cerrar sesión",
      members: "miembros",
      inviteCode: "Código de invitación",
      openGroup: "Abrir grupo",
      noGroupsYet: "Todavía no hay grupos",
      noGroupsCopy: "Crea tu primer grupo privado o únete con un código de invitación.",
      open: "Abierto",
      locked: "Cerrado",
      venueTbd: "Sede por confirmar",
      finalScore: "Marcador final",
      home: "Local",
      away: "Visitante",
      savePick: "Guardar predicción",
      savingPick: "Guardando...",
      savedPick: "Guardada",
    },
    auth: {
      appName: "WC26 Predictions",
      signInTitle: "Inicio de sesión sin contraseña para tu grupo del Mundial.",
      signInCopy:
        "Ingresa tu correo y la app generará un código temporal. Si Resend esta configurado, el código llegara por email. Si no, la app mostrara el código en la siguiente pantalla para desarrollo local.",
      loginEyebrow: "Iniciar sesión",
      loginTitle: "Ingresa con tu correo",
      loginCopy:
        "Escribe tu correo y te enviaremos un código único para volver a tu cuenta.",
      registerEyebrow: "Registro",
      registerTitle: "Crea tu cuenta",
      registerCopy:
        "Escribe tu correo y elige un nombre de usuario para crear tu cuenta antes de enviar el código.",
      localAuth: "Acceso local sin contraseña",
      authEyebrow: "Acceso",
      authCardTitle: "Solicita un código de acceso",
      authCardCopy:
        "Si el correo es nuevo, la app creará la cuenta después de verificar el código usando el nombre de usuario que escribas aqui.",
      email: "Correo",
      username: "Nombre de usuario",
      usernamePlaceholder: "Solo hace falta para registrarte",
      sendCode: "Enviar código",
      verifyEyebrow: "Verificar acceso",
      verifyTitle: "Ingresa el código temporal para",
      verifyCopy: "El código vence en 15 minutos y solo se puede usar una vez.",
      requestNewCode: "Pedir un nuevo código",
      registerNow: "Registrarse ahora",
      login: "Iniciar sesión",
      noAccountTitle: "No encontramos una cuenta para este correo",
      noAccountCopy: "Revisa que el correo sea correcto, o regístrate ahora si es una cuenta nueva.",
      accountExistsTitle: "Ya existe una cuenta",
      accountExistsCopy: "Prueba iniciar sesión con este correo.",
      codeEyebrow: "Código",
      finishSignIn: "Completar acceso",
      verificationCode: "Código de verificación",
      developmentCode: "Código de desarrollo",
      verifyAndSignIn: "Verificar e ingresar",
      continue: "Continuar",
      switchToLogin: "¿Ya tienes cuenta? Inicia sesión",
      switchToRegister: "¿No tienes cuenta? Regístrate",
      productionEmailNote:
        "En producción, normalmente recibirias este código por correo.",
      emailPlaceholder: "tu@correo.com",
      verificationCodePlaceholder: "123456",
    },
    home: {
      appName: "Predicciones Mundial 2026",
      appSummary: "Una app para predicciones del Mundial.",
      appIntro:
        "Haz predicciones de partidos del Mundial, únete a grupos privados y sigue los puntos con amigos.",
      register: "Registrarse",
      login: "Iniciar sesión",
      tagline: "Grupos privados. Predicciones. Drama en la tabla.",
      learnBanner: "Aprende full stack creando algo social y competitivo",
      heroTitle: "Haz predicciones del Mundial con amigos y clasifica cada resultado.",
      heroCopy:
        "Este proyecto esta pensado para tu idea: los usuarios se unen a un grupo, envian predicciones antes del inicio, ganan puntos por acertar el marcador o el resultado y suben en una tabla compartida.",
      openDashboard: "Ir a mis grupos",
      sampleLeaderboard: "Ver tabla de ejemplo",
      enterResults: "Ingresar resultados",
      snapshot: "Resumen de jornada",
      upcomingMatches: "Próximos partidos",
      snapshotCopy: "Los partidos de hoy y mañana, en una lista breve con desplazamiento.",
      today: "Hoy",
      tomorrow: "Mañana",
      noUpcomingMatches: "No hay partidos próximos por ahora.",
      rulesEyebrow: "Reglas",
      rulesTitle: "Cómo funcionan las predicciones",
      rulesIntro:
        "Haz una predicción de marcador por partido dentro de cada grupo privado antes de que se cierre.",
      exactScoreRule: "Marcador exacto",
      exactScoreRuleCopy: "Acertar el marcador final exacto vale 3 puntos.",
      outcomeRule: "Resultado correcto",
      outcomeRuleCopy: "Acertar el ganador o empate vale 1 punto si el marcador no es exacto.",
      deadlineRule: "Cierres de predicción",
      deadlineRuleCopy:
        "Cada partido se cierra en su propio inicio, así que puedes editar una predicción hasta que empiece ese partido.",
      separateGroupsRule: "Grupos separados",
      separateGroupsRuleCopy:
        "Si estás en más de un grupo, debes ingresar tus predicciones en cada grupo por separado. Pueden ser diferentes entre grupos.",
      groups: "Grupos",
      privateLeagues: "Grupos privados",
      scoring: "Puntuación",
      exactOutcome: "Exacto + resultado",
      competition: "Competencia",
      liveRanking: "Tabla en vivo",
      yourGroups: "Tus grupos",
      jumpIntoLeague: "Entra o crea un grupo y empieza a predecir",
      create: "Crear",
      startPrivateGroup: "Crea un nuevo grupo privado",
      join: "Unirse",
      enterInviteCode: "Ingresa el código de tu grupo",
      users: "Usuarios",
      usersTitle: "Las personas crean o se unen a grupos privados",
      usersCopy:
        "Cada grupo se convierte en su propia mini competencia. La app admitirá invitaciones, roles de miembros y una tabla compartida para competir con amigos o familia.",
      predictions: "Predicciones",
      predictionsTitle: "Una predicción por partido antes del inicio",
      predictionsCopy:
        "Los usuarios predicen el marcador del local y visitante para cada partido. Cuando empieza el juego, la predicción se bloquea y espera el resultado final oficial.",
      scoringTitle: "Reglas simples pero competitivas",
      scoringCopy:
        "El sistema de puntuación empieza de forma intencionalmente simple para que puedas enfocarte en aprender full stack antes de agregar preguntas extra o desempates.",
      scoringModel: "Sistema de puntos v1",
      exactScore: "Marcador exacto",
      exactScoreCopy: "Adivina correctamente el marcador final.",
      correctWinner: "Ganador o empate correcto",
      correctWinnerCopy: "Acertar el resultado aunque el marcador no sea exacto.",
      wrongOutcome: "Resultado incorrecto",
      wrongOutcomeCopy: "No hay puntos por elegir mal al ganador o empate.",
      sampleStandings: "Tabla de ejemplo para un grupo",
      leaderboardCopy:
        "La tabla real vive en la pagina de cada grupo. Este ejemplo muestra la forma de puntuar antes de tener resultados reales.",
      nextTarget: "Siguiente objetivo",
      nextTitle: "Las paginas de grupo ahora son el centro de la app",
      nextCopy:
        "Abre un grupo para ver la lista de partidos desde la base de datos, guardar predicciones y ver como cambia la tabla cuando llegan los resultados. La autenticacion ahora usa una sesion simple con Prisma para que cada usuario tenga sus propios grupos y picks.",
    },
    groupForms: {
      groupName: "Nombre del grupo",
      groupNamePlaceholder: "Amigos del viernes",
      displayName: "Nombre en este grupo",
      displayNamePlaceholder: "Kiara",
      createGroup: "Crear grupo",
      inviteCode: "Código de invitacion",
      inviteCodePlaceholder: "WC26DE",
      joinGroup: "Unirse al grupo",
    },
    groupPage: {
      overview: "Resumen del grupo",
      makingPicks: "y haciendo predicciones en este grupo.",
      matches: "Partidos",
      navigate: "Navega el torneo a tu manera",
      leaderboard: "Clasificacion",
      leaderboardTitle: "Tabla en vivo de este grupo",
      leaderboardCopy:
        "Gana 3 puntos por acertar el marcador exacto, 1 punto por acertar el ganador o empate y 0 puntos si el resultado es incorrecto.",
      members: "Miembros",
      inviteCode: "código de invitacion",
      player: "Jugador",
      exact: "Exacto",
      outcome: "Resultado",
      total: "Total",
      ongoingPredictions: {
        eyebrow: "Predicciones en vivo",
        title: "Predicciones del partido actual",
        copy:
          "Desde el inicio del partido y hasta poco después, todos en el grupo pueden ver las predicciones de ese juego. Verde claro significa que la predicción tiene el resultado correcto en ese momento; verde más fuerte significa que acierta el marcador actual exacto.",
        currentScore: "Marcador actual",
        noScore: "Marcador no disponible todavía",
        noPick: "Sin predicción",
        exact: "Exacto",
        outcome: "Resultado",
      },
      management: {
        title: "Administrar grupo",
        ownerTools: "Configuración del grupo",
        ownerToolsCopy:
          "La persona dueña puede eliminar miembros o borrar el grupo. Cualquier miembro puede salir. Al salir o ser eliminado se borran sus predicciones en este grupo.",
        transferOwner: "Elige una nueva persona dueña antes de salir",
        transferOwnerPlaceholder: "Selecciona un miembro",
        removeMember: "Eliminar miembro",
        leaveGroup: "Salir del grupo",
        deleteGroup: "Borrar grupo",
        ownerBadge: "Dueño",
        youBadge: "Tú",
        leaveWarning:
          "¿Seguro que quieres salir de este grupo? Se perderán todas las predicciones que ingresaste en este grupo.",
        removeWarning:
          "¿Seguro que quieres eliminar este miembro? Se perderán todas las predicciones que ingresó en este grupo.",
        deleteWarning:
          "¿Seguro que quieres borrar este grupo? Se perderán todos los miembros y todas las predicciones ingresadas en este grupo.",
      },
    },
    matchBrowser: {
      toggleMenu: "Menu desplegable",
      dateMenu: "Buscar partidos por fecha",
      stageMenu: "Buscar partidos por fase",
      groupStage: "Fase de grupos",
      knockoutBracket: "Llave final",
      backToGroups: "Volver a los grupos",
      round: "Ronda",
      cup: "Copa",
      match: "partido",
      matches: "partidos",
    },
    admin: {
      dataOps: "Datos",
      title: "Sincronizar partidos y resultados del Mundial",
      copy:
        "La app puede traer partidos y marcadores finales desde football-data.org y luego actualizar automaticamente los puntos de cada grupo.",
      lastSync: "Ultima sincronizacion",
      noSync: "Todavia no se ha ejecutado una sincronizacion automatica.",
      manualOverride: "Ajuste manual",
      manualCopy:
        "No deberias necesitar esto muy seguido, pero sigue disponible por si un resultado externo se retrasa o necesita correccion.",
      syncNow: "Sincronizar partidos y resultados ahora",
      confirmed: "Confirmado",
      pending: "Pendiente",
      homeScore: "Marcador local",
      awayScore: "Marcador visitante",
      updateResult: "Actualizar resultado",
      confirmResult: "Confirmar resultado",
    },
  },
} as const;

export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const headerValue = requestHeaders.get(localeHeaderName);

  if (locales.includes(headerValue as Locale)) {
    return headerValue as Locale;
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(localeCookieName)?.value;
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export function getTranslations(locale: Locale) {
  return translations[locale];
}

export function getLocaleCookieName() {
  return localeCookieName;
}

export function getLocaleHeaderName() {
  return localeHeaderName;
}

export function stripLocalePrefix(pathname: string) {
  const parts = pathname.split("/");
  const maybeLocale = parts[1];

  if (!locales.includes(maybeLocale as Locale)) {
    return pathname || "/";
  }

  const stripped = `/${parts.slice(2).join("/")}`;
  return stripped === "/" ? "/" : stripped.replace(/\/$/, "");
}

export function localizePath(pathname: string, locale: Locale) {
  const stripped = stripLocalePrefix(pathname);

  return stripped === "/" ? `/${locale}` : `/${locale}${stripped}`;
}
