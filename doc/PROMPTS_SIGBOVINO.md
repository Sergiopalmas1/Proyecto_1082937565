# PROMPTS DE IMPLEMENTACIÓN — SIG Bovino
> Prompts secuenciales para construir el sistema fase por fase
> Plan de referencia: `doc/PLAN_SIGBOVINO.md`
> Estado de progreso: `doc/ESTADO_EJECUCION_SIGBOVINO.md`

---

## INSTRUCCIONES DE USO

1. Ejecuta primero el **Prompt 0** — crea el archivo de seguimiento del proyecto.
2. Para cada fase siguiente, copia el bloque completo y pégalo en tu sesión de IA.
3. La IA leerá el plan, ejecutará la fase y dejará el estado actualizado.
4. No avances a la siguiente fase hasta que el resumen esté generado y el estado marcado como completado.

---

## PROTOCOLO DE EJECUCIÓN — APLICA A TODOS LOS PROMPTS

```
ANTES de escribir código:
1. Leer doc/PLAN_SIGBOVINO.md
2. Leer doc/ESTADO_EJECUCION_SIGBOVINO.md
3. Verificar que las fases previas estén completadas
4. Registrar inicio de la fase: estado En progreso + fecha y hora

DESPUÉS de completar el trabajo:
5. Registrar cierre: estado Completada + fecha y hora
6. Documentar en el estado: todas las acciones ejecutadas, archivos creados o modificados, observaciones y desviaciones del plan
7. Crear doc/RESUMEN_FASE_N_NOMBRE.md con: objetivo de la fase, acciones realizadas, archivos creados, decisiones técnicas y por qué, problemas encontrados y cómo se resolvieron, qué se probó y resultado, estado final EXITOSO / CON OBSERVACIONES / FALLIDO, y prerrequisitos para la siguiente fase

NUNCA avanzar sin completar este protocolo.
```

---

---

## PROMPT 0 — Crear archivo de estado del proyecto

```
Actúa como Ingeniero de Proyectos. Tu única tarea es leer doc/PLAN_SIGBOVINO.md y crear el archivo doc/ESTADO_EJECUCION_SIGBOVINO.md.

El archivo debe contener:
- Información del proyecto: nombre del sistema, archivos de referencia, estudiante responsable, fecha de inicio, estado general
- Dashboard de fases: tabla con todas las fases del plan incluyendo número, nombre, rol asignado, estado (todas inician como Pendiente), columnas para fecha de inicio, fecha de cierre y nombre del archivo de resumen
- Leyenda de estados con sus significados: Pendiente, En progreso, Completada, Bloqueada, Pausada
- Sección de historial de ejecución: formato append-only donde cada entrada registra fecha, hora, número de fase, tipo de evento y detalle

Toma los datos directamente del plan. No inventes fases ni cambies nombres ni roles.

Cuando termines escribe en el chat el nombre de cada fase detectada y confirma que el archivo está listo para comenzar la Fase 1.

Tu trabajo termina aquí.
```

---

---

## PROMPT FASE 1 — Login y Autenticación

### Rol: `Ingeniero Fullstack Senior — Especialista en seguridad, autenticación y primera impresión`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack Senior especializado en autenticación segura con JWT y bcrypt en Next.js serverless, y en el diseño de la primera experiencia visual del usuario para sistemas empresariales agropecuarios.

Tu mentalidad: seguridad primero — cero passwords en texto plano, cero información sensible expuesta al cliente. Y al mismo tiempo: el login es la primera cara del sistema, lo primero que ve un veterinario, un administrador de finca o un operario, y debe transmitir seriedad y confianza profesional desde el primer segundo. SIG Bovino no es una app casual, es una herramienta empresarial para el campo.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — especialmente el stack tecnológico, modelo de datos de usuarios, los 3 roles del sistema, la arquitectura de rutas de autenticación, la estrategia de seguridad y la sección 14 con la identidad visual exacta del login (paleta tierra y verde campo, logo de cabeza de res, tagline)
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — registra el inicio de la Fase 1

El plan tiene todo lo que necesitas: el SQL de la tabla users con los 3 roles, las variables de entorno, las funciones de auth.ts, el patrón de withAuth y withRole, los endpoints necesarios y la especificación visual completa del login.

Puntos críticos que no puedes ignorar en esta fase:
- Los 3 roles del sistema son admin, veterinario y operario — el JWT debe incluir el rol en su payload porque se usará en cada operación
- En SIG Bovino no existe registro público de usuarios: los usuarios los crea el administrador desde la Fase 9. El login no debe tener link de "Crear cuenta", pero sí dejar lista la API change-password porque el primer login del usuario creado por admin requerirá cambiar la contraseña
- El SUPABASE_SERVICE_ROLE_KEY nunca debe aparecer en componentes del cliente
- El error de login debe ser genérico — nunca especificar si falló el email o la contraseña
- Cookie de sesión HttpOnly, Secure, SameSite=Strict — nunca localStorage
- La identidad visual del login no es opcional: el plan documenta paleta exacta, logo SVG de cabeza de res, tipografía, animación y tagline. Implementa exactamente lo descrito — esa es la cara del sistema
- Crea ya `lib/withRole.ts` aunque solo se use a fondo desde la Fase 3 — la Fase 2 ya lo necesitará para el dashboard según rol

Al terminar:
- Ejecuta npm run typecheck sin errores
- Prueba el flujo completo: insertar manualmente en Supabase un usuario admin → login → /api/auth/me → logout → /dashboard sin sesión redirige a /login
- Verifica que la cookie es HttpOnly
- Registra el cierre en ESTADO_EJECUCION_SIGBOVINO.md
- Crea doc/RESUMEN_FASE_1_LOGIN.md

Tu trabajo termina aquí. No avances a la Fase 2.
```

---

---

## PROMPT FASE 2 — Dashboard y Layout base

### Rol: `Diseñador Frontend Obsesivo — Especialista en layouts y experiencia post-login en sistemas empresariales`

---

```
Actúa EXCLUSIVAMENTE como Diseñador Frontend Obsesivo especializado en layouts de aplicaciones empresariales, sistemas de diseño con Tailwind y experiencia adaptada por rol del usuario.

Tu mentalidad: el layout es la estructura que organiza todo lo que viene después. SIG Bovino tiene tres roles muy diferentes — un veterinario no necesita ver lo mismo que un operario. El sidebar y el dashboard deben adaptarse según quién haya iniciado sesión, mostrando solo lo relevante para cada uno.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — sección de diseño de interfaz (paleta beige y verde campo, tipografía con Inter y JetBrains Mono para códigos), la matriz de permisos, la Fase 2 del plan y el endpoint /api/dashboard que devuelve datos según rol
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica que la Fase 1 esté completada y registra el inicio de la Fase 2

Puntos críticos que no puedes ignorar:
- El sidebar debe filtrarse según el rol del usuario autenticado. Un operario nunca debe ver el ítem "Administración" ni "Bitácora". Un veterinario nunca debe ver "Reportes fiscales". Esto se valida también en backend con withRole, pero la UI no debe siquiera mostrar opciones inalcanzables
- El dashboard tiene tres versiones según el rol: el admin ve todo (alertas sanitarias, alertas de caída de producción, conteos generales), el veterinario ve principalmente alertas sanitarias y de salud animal, el operario ve pendientes de producción del día
- El middleware.ts debe verificar tanto la sesión como el rol para rutas /admin/*: un operario que intente acceder a /admin/users debe ser redirigido a /dashboard
- Los componentes UI base deben usar las variables CSS de la paleta documentada en el plan, nunca colores hardcodeados. La v1 solo soporta modo claro — no implementes modo oscuro en esta fase
- JetBrains Mono se carga vía next/font junto con Inter porque se usará para mostrar códigos de animales en módulos posteriores

Al terminar:
- Verifica el responsive en 360px (celular gama media), 768px y 1280px
- Prueba el dashboard con los 3 roles distintos y verifica que cada uno ve lo correcto
- npm run typecheck
- Registra el cierre en ESTADO_EJECUCION_SIGBOVINO.md
- Crea doc/RESUMEN_FASE_2_DASHBOARD.md

Tu trabajo termina aquí. No avances a la Fase 3.
```

---

---

## PROMPT FASE 3 — Gestión de Bodegas

### Rol: `Ingeniero Fullstack Senior — Modelado de espacios y validación de capacidad`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack Senior especializado en modelado de entidades de soporte y validación de reglas de capacidad.

Tu mentalidad: las bodegas son la base donde residen los animales. Si la capacidad no se valida correctamente, el sistema permitiría asignaciones imposibles en la realidad. Cada bodega tiene un espacio físico real y el sistema lo respeta.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — modelo de la tabla sheds, regla RN-05 sobre capacidad máxima, matriz de permisos para bodegas y la Fase 3 del plan
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica Fases 1 y 2 completadas, registra inicio de Fase 3

Puntos críticos que no puedes ignorar:
- Solo el administrador puede crear, editar o eliminar bodegas (usar withRole(['admin']))
- El admin y el veterinario pueden asignar animales a bodegas; el operario no
- La eliminación de una bodega no debe ser física si tiene animales asignados — usa is_active=false (soft delete) y muestra advertencia clara al usuario
- En la lista, calcula el current_count en tiempo real con una query (COUNT de cattle activos con shed_id de cada bodega) — no almacenes ese valor en la tabla porque se desactualiza
- La validación de capacidad (RN-05) se hace cuando se asigna un animal a una bodega, no aquí. En esta fase solo creas la base — la validación se aplica en la Fase 4 al gestionar animales

Al terminar:
- Prueba CRUD completo de bodegas con el rol admin
- Prueba que veterinario y operario no pueden crear/editar/eliminar bodegas
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_3_BODEGAS.md

Tu trabajo termina aquí. No avances a la Fase 4.
```

---

---

## PROMPT FASE 4 — Registro y Gestión de Animales

### Rol: `Ingeniero Fullstack Senior — Modelo central del sistema, lógica de auditoría y genealogía`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack Senior especializado en modelado de entidades centrales con relaciones complejas (auto-referencia, auditoría, validaciones recursivas).

Tu mentalidad: este es el módulo más crítico del sistema. Los animales son el corazón de SIG Bovino — todo lo demás (producción, vacunación, reproducción, reportes) depende de que este módulo esté impecable. Tres reglas de negocio críticas se cruzan aquí: la unicidad del código, la integridad de la genealogía sin ciclos y la auditoría obligatoria de cada cambio.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — modelo completo de cattle y cattle_audit, reglas RN-01, RN-03, RN-04, RN-05, RN-08 y RN-09, casos de uso CU-01 al CU-A6 y la Fase 4 del plan que es la más extensa
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica Fases 1 a 3 completadas, registra inicio de Fase 4

Puntos críticos que no puedes ignorar:
- La validación anti-ciclos genealógicos (RN-09) es la más sutil y la más crítica: antes de asignar dam_id o sire_id, debes recorrer recursivamente los descendientes del animal actual y verificar que el padre/madre que se intenta asignar no esté entre ellos. Sin esta validación, podrías crear un animal que sea su propio ancestro. Implementa esto en lib/genealogyService.ts con una función recursiva o iterativa que pare en cuanto detecte el ciclo
- La auditoría (RN-08) es obligatoria — cada update y cada cambio de estado de un animal debe insertar un registro en cattle_audit con el diff de campos cambiados (formato JSONB con { field: { from, to } }). Implementa esto centralizado en lib/auditService.ts y úsalo en cada update del cattleService
- La validación de capacidad de bodega (RN-05) se aplica cuando asignas shed_id: contar animales activos en esa bodega y comparar con max_capacity. Si excede, retorna 409 con mensaje claro
- La fecha de nacimiento de una cría no puede ser anterior a la de su madre (RN-04): valida en el servidor cuando se asigna dam_id
- Un animal con status distinto de 'activo' no puede ser modificado en sus datos productivos (RN-03), pero sí debe poder reactivarse si fuera el caso. Documenta este flujo
- La ficha del animal en /cattle/[id] tiene tabs para Información, Producción, Vacunación, Reproducción, Genealogía y Bitácora. En esta fase solo implementa los tabs Información, Genealogía y Bitácora; los otros se llenan en sus respectivas fases con un componente placeholder por ahora
- El árbol genealógico debe mostrar 2 niveles arriba (padres y abuelos) y 1 nivel abajo (crías directas). Si un padre no está registrado en el sistema, simplemente no aparece — no hay nodos vacíos
- La subida de foto del animal a Supabase Storage es opcional en esta fase pero, si lo implementas, usa el bucket sig-bovino-media y el path cattle/{id}/photo.jpg, comprime la imagen del lado cliente antes de subirla y guarda solo la ruta en cattle.photo_path
- La bitácora /admin/audit es solo para admin (usar withRole(['admin']))

Al terminar:
- Prueba todas las validaciones críticas con casos borde:
  · Crear animal con código duplicado → debe fallar con 409
  · Asignar a un animal su propio descendiente como padre → debe fallar con 400
  · Asignar a una cría una madre nacida después que ella → debe fallar con 400
  · Asignar animal a bodega llena → debe fallar con 409
  · Modificar un animal dado de baja → debe fallar con 400
  · Verificar que cada update queda registrado en cattle_audit con el diff correcto
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_4_ANIMALES.md

Tu trabajo termina aquí. No avances a la Fase 5.
```

---

---

## PROMPT FASE 5 — Producción de Leche

### Rol: `Ingeniero Fullstack — Lógica operacional diaria y captura rápida en campo`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack especializado en lógica de negocio operacional diaria, validación de datos numéricos y diseño de flujos de captura optimizados para uso en campo desde celular.

Tu mentalidad: el operario registra producción dos veces al día, en el potrero, posiblemente con guantes y el celular en una mano. La interfaz de captura debe ser brutalmente eficiente — un operario debería poder registrar la producción de 50 vacas en menos de 10 minutos sin frustración. Cada toque cuenta.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — modelo de milk_production y production_alerts, reglas RN-02, RN-06, RN-11, RN-12 y la Fase 5 del plan
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica Fases 1 a 4 completadas, registra inicio de Fase 5

Puntos críticos que no puedes ignorar:
- Solo hembras activas (sex='hembra' AND status='activo') pueden tener registros de producción (RN-02 + RN-03). Valida en el servidor antes de insertar — el frontend solo lista hembras activas, pero la API debe validar igual por defensa en profundidad
- El UNIQUE compuesto (cattle_id, production_date, shift) en la tabla previene duplicados a nivel DB. En la API debes capturar el error de constraint y devolver un mensaje claro: "Ya existe registro de producción para este animal, fecha y turno"
- La detección de caída de producción >20% (RN-12): después de insertar el registro, calcula el promedio de los últimos 7 días de ese animal (excluyendo el registro recién insertado). Si el nuevo registro es <80% del promedio, inserta una alerta en production_alerts. Hacer esto de manera asíncrona si es posible para no bloquear la respuesta al operario
- La interfaz de captura optimizada es lo más importante de esta fase: lista de hembras activas filtrable por bodega, cada animal con su código (en JetBrains Mono) y un input numérico inline. El operario debería poder ingresar valor → tab → siguiente animal sin clicks adicionales. Considera autoguardado al hacer blur del input, o un botón "Guardar todo" al final
- El registro debe funcionar bien en celular: inputs grandes con teclado numérico (inputMode="decimal"), área táctil generosa, sin teclados que tapen el input activo
- El ProductionDropAlert se muestra en el dashboard del admin (no del operario, para no inquietarlo) con la lista de alertas no resueltas. Permitir marcarlas como resueltas con un clic

Al terminar:
- Prueba con casos borde:
  · Intentar registrar producción para un macho → debe fallar
  · Intentar registrar producción duplicada (mismo animal, fecha, turno) → debe fallar
  · Registrar valor 65 litros → debe fallar
  · Registrar valor -5 → debe fallar
  · Registrar producción que cae >20% → debe generar alerta visible al admin
- Probar el flujo de captura masiva con al menos 10 animales en celular
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_5_PRODUCCION.md

Tu trabajo termina aquí. No avances a la Fase 6.
```

---

---

## PROMPT FASE 6 — Vacunación y Alertas

### Rol: `Ingeniero Fullstack — Sanidad animal, normativa y operaciones masivas`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack especializado en sistemas de gestión sanitaria, manejo de catálogos, operaciones masivas atómicas y subida de archivos a Storage.

Tu mentalidad: la vacunación es el módulo donde el sistema cumple con la normativa colombiana. Una alerta perdida puede significar incumplimiento ante el ICA. Una vacunación masiva mal ejecutada puede dejar registros inconsistentes. Cero tolerancia a operaciones a medias.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — modelo de vaccine_types y vaccinations, casos CU-03, CU-A10, CU-A11, requerimiento RF-06 y la Fase 6 del plan
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica Fases 1 a 5 completadas, registra inicio de Fase 6

Puntos críticos que no puedes ignorar:
- El catálogo inicial de vaccine_types ya está definido en el plan: Fiebre Aftosa (180 días), Brucelosis (365), Carbunco Sintomático (365), IBR/DVB (365), Rabia Bovina (365). Insértalo en la migración inicial. Aftosa y Brucelosis tienen is_mandatory=true por ser obligatorias por ley en Colombia
- El cálculo de next_dose_date se hace en el servidor al insertar: applied_date + vaccine_types.periodicity_days. Nunca confíes en que el cliente lo calcule correctamente
- La vacunación masiva debe ser atómica: o se aplica la vacuna a todos los animales seleccionados, o no se aplica a ninguno. Si una inserción falla, hacer rollback de las anteriores. Considera usar una transacción de Supabase o validar todo previamente y luego hacer el batch insert
- La alerta de próxima vacuna se calcula en el endpoint GET /api/vaccinations/alerts: next_dose_date <= NOW + INTERVAL '7 days' AND animal activo. No se persiste como tabla separada — se calcula al consultar
- Solo veterinario y admin pueden registrar vacunas (withRole(['admin', 'veterinario']))
- La subida de certificado a Storage es opcional pero, si se sube, va al bucket sig-bovino-media en path vaccinations/{id}/{filename}.pdf. Validar que sea PDF y máximo 5MB
- Solo hembras pueden recibir vacuna de Brucelosis (regla del ICA). Si se intenta aplicar Brucelosis a un macho, retornar 400 con mensaje claro. Esto requiere agregar un campo allowed_sex (nullable) en vaccine_types — agrégalo en la migración
- En vacunación masiva, si algún animal seleccionado está en status distinto de 'activo', excluirlo de la operación (no fallar todo) y notificar en la respuesta cuáles se omitieron y por qué

Al terminar:
- Prueba vacunación individual y masiva con grupos de varias bodegas
- Prueba aplicar Brucelosis a un macho → debe fallar
- Prueba que las alertas aparecen correctamente cuando next_dose_date está dentro de 7 días
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_6_VACUNACION.md

Tu trabajo termina aquí. No avances a la Fase 7.
```

---

---

## PROMPT FASE 7 — Estado Reproductivo

### Rol: `Ingeniero Fullstack — Eventos y deducción de estado actual`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack especializado en sistemas basados en eventos y deducción de estado actual a partir de un historial.

Tu mentalidad: el estado reproductivo de una hembra no es un campo plano que se sobreescribe — es el resultado del último evento en su historial. Un sistema bien diseñado mantiene la trazabilidad completa y deduce el estado actual al consultar, no lo persiste como copia.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — modelo de reproductive_events, reglas RN-02 y RN-03, requerimiento RF-07 y la Fase 7 del plan
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica Fases 1 a 6 completadas, registra inicio de Fase 7

Puntos críticos que no puedes ignorar:
- El estado reproductivo "actual" de una hembra se deduce consultando su último evento (ORDER BY event_date DESC, created_at DESC LIMIT 1). No agregues un campo current_status en la tabla cattle — siempre deduce
- Solo hembras activas pueden registrar eventos reproductivos (RN-02 + RN-03)
- En eventos de tipo 'preñez', calcula automáticamente expected_birth = event_date + INTERVAL '283 days' (gestación bovina promedio). Permite que el usuario lo ajuste manualmente si lo conoce
- Solo veterinario y admin pueden registrar eventos (withRole(['admin', 'veterinario']))
- El timeline en la ficha del animal debe mostrar los eventos en orden cronológico inverso (más recientes arriba) con iconos distintos por tipo de evento
- Validaciones lógicas a considerar: no se puede registrar un parto si el evento anterior no es preñez, no se puede registrar lactancia si no hubo parto reciente. Estas son sugerencias de UX (advertencia al usuario), no bloqueos duros — el usuario puede tener razones para registrar fuera de secuencia (animal recién comprado preñado, etc.)
- En la lista /reproduction, mostrar todas las hembras activas con su estado actual deducido en una tabla. Permitir filtrar por estado actual

Al terminar:
- Probar que se puede registrar un ciclo completo: vacía → celo → preñez (con expected_birth calculado) → parto → lactancia → vacía
- Verificar que el estado actual mostrado siempre es el del último evento
- Probar que un macho no puede tener eventos reproductivos
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_7_REPRODUCCION.md

Tu trabajo termina aquí. No avances a la Fase 8.
```

---

---

## PROMPT FASE 8 — Reportes y Exportación

### Rol: `Ingeniero Backend Senior — Generación de reportes oficiales y compatibilidad normativa`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Backend Senior especializado en generación de reportes oficiales, compatibilidad con formatos normativos y entrega de documentos en el servidor.

Tu mentalidad: los reportes de SIG Bovino no son archivos casuales — son documentos que un propietario presenta ante el ICA o ante la DIAN. Deben verse profesionales, ser internamente consistentes, y los datos deben coincidir exactamente con el sistema. Un reporte mal generado afecta la credibilidad del software.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — sección 17 con el detalle de cada reporte (producción comparativo, sanitario ICA, fiscal valorado), regla RN-10, matriz de permisos para reportes y la Fase 8 del plan
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica Fases 1 a 7 completadas, registra inicio de Fase 8

Puntos críticos que no puedes ignorar:
- Permisos diferenciados por reporte: producción lo ve cualquier rol, sanitario solo veterinario y admin, inventario fiscal solo admin. Implementa con withRole en cada endpoint
- Validación de RN-10: el reporte comparativo de producción exige mínimo 7 días en cada período. Validar con Zod en el endpoint, retornar 400 con mensaje claro si no se cumple
- Generación 100% en el servidor: jsPDF y xlsx corren en la API Route, el frontend solo recibe el blob como respuesta y lo descarga. Headers correctos: Content-Type apropiado y Content-Disposition: attachment con nombre de archivo descriptivo (ej: sig-bovino-sanitario-202505.pdf)
- El reporte sanitario para ICA debe incluir: encabezado con datos de la finca, propietario, listado de animales con vacunas aplicadas en el período, fecha de aplicación, vacuna, dosis, veterinario responsable, total de cabezas vacunadas vs total del hato. Diseño formal — este documento se presenta ante una entidad regulatoria
- El reporte de inventario valorado (fiscal) debe incluir: código en monoespaciada, sexo, edad calculada, raza, peso, valor estimado por cabeza (cattle.estimated_value), subtotales por categoría según edad y sexo (terneros <1 año, novillas/novillos 1-2 años, vacas/toros >2 años), total general
- El comparativo de producción debe generar tanto el PDF como el Excel mostrando: totales por período, promedios diarios, diferencia absoluta y porcentual, y una tabla día por día con los litros producidos en cada período
- Si el período seleccionado no tiene datos, retornar 404 con mensaje claro — no generar un PDF vacío
- El frontend debe mostrar un spinner mientras se genera el reporte (puede tardar varios segundos para hatos grandes) y deshabilitar el botón para evitar dobles clics

Al terminar:
- Probar cada reporte con datos reales del sistema
- Verificar que los totales del reporte coinciden con lo que muestra la UI
- Probar permisos: un operario no puede acceder al reporte sanitario, un veterinario no puede acceder al fiscal
- Probar el comparativo con períodos de menos de 7 días → debe fallar
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_8_REPORTES.md

Tu trabajo termina aquí. No avances a la Fase 9.
```

---

---

## PROMPT FASE 9 — Administración de Usuarios

### Rol: `Ingeniero Fullstack Senior — Gestión de usuarios y manejo de credenciales temporales`

---

```
Actúa EXCLUSIVAMENTE como Ingeniero Fullstack Senior especializado en gestión de usuarios con roles, generación segura de credenciales temporales y flujos de cambio obligatorio de contraseña.

Tu mentalidad: el administrador es el dueño del sistema. Cuando crea un usuario, debe poder entregarle una contraseña temporal que solo le sirva para iniciar sesión por primera vez y cambiarla. Esta es la única vez en la vida del sistema que se ve una contraseña en claro — y solo el administrador, en una pantalla, una sola vez.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — matriz de permisos del administrador, los 3 roles, la Fase 9 del plan
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica Fases 1 a 8 completadas, registra inicio de Fase 9

Puntos críticos que no puedes ignorar:
- Todas las rutas /api/users usan withRole(['admin']) sin excepción
- Agrega el campo must_change_password BOOLEAN DEFAULT false a la tabla users con una migración (ALTER TABLE)
- Cuando el admin crea un usuario: generar contraseña temporal aleatoria de 12 caracteres alfanuméricos, hashearla con bcrypt antes de guardarla, marcar must_change_password=true, y devolverla al admin EN CLARO una sola vez en la respuesta del POST. La UI debe mostrarla en un modal con botón de "Copiar" y advertencia de que es la única vez que se verá
- En el flujo de login: si el usuario tiene must_change_password=true al iniciar sesión, redirigirlo automáticamente a /change-password antes de llegar al dashboard
- El cambio de contraseña obligatorio: después de cambiarla, marcar must_change_password=false y permitir el acceso normal
- El admin no puede eliminar su propia cuenta — verificar explícitamente antes del DELETE
- Si se elimina un usuario, los registros que él creó (animales, producciones, vacunaciones) mantienen su FK con SET NULL gracias al esquema definido en la fase 4 — los registros conservan trazabilidad pero apuntan a usuario eliminado. Verifica que esto está bien
- Suspender un usuario (is_active=false) debe impedirle iniciar sesión inmediatamente — la verificación ya existe en withAuth desde la Fase 1
- La página /admin/users muestra: nombre, email, rol, estado, último acceso, acciones. Filtros por rol y estado

Al terminar:
- Probar el flujo completo: admin crea operario → ve la contraseña temporal una vez → operario inicia sesión → es redirigido a cambio de contraseña → cambia → accede al dashboard normalmente
- Probar suspensión: usuario suspendido no puede iniciar sesión
- Probar que el admin no puede eliminar su propia cuenta
- npm run typecheck
- Registra el cierre y crea doc/RESUMEN_FASE_9_USUARIOS.md

Tu trabajo termina aquí. No avances a la Fase 10.
```

---

---

## PROMPT FASE 10 — Pulido final y Deploy

### Rol: `Diseñador Frontend Obsesivo + Ingeniero Fullstack — Cierre del proyecto`

---

```
Actúa EXCLUSIVAMENTE como Diseñador Frontend Obsesivo e Ingeniero Fullstack en conjunto. Esta es la fase de cierre del proyecto. No hay nuevas funcionalidades — hay calidad, coherencia, robustez en producción.

Tu mentalidad: SIG Bovino no se entrega "casi listo". Una finca real va a usar este sistema. Cada detalle ahora cuenta — los empty states, los toasts de error, los estados de carga, la respuesta en celular bajo conexión lenta, la velocidad del listado de animales con cientos de cabezas. Y especialmente: la robustez de los permisos, porque tres roles distintos van a entrar al sistema desde mañana.

Antes de escribir una sola línea de código lee:
1. doc/PLAN_SIGBOVINO.md — Fase 10, requerimientos no funcionales completos
2. doc/ESTADO_EJECUCION_SIGBOVINO.md — verifica Fases 1 a 9 completadas, registra inicio de Fase 10

Lo que debes completar en esta fase:
- Auditoría completa de empty states en cada módulo: animales, bodegas, producción, vacunación, reproducción, reportes, usuarios. Cada estado vacío con mensaje contextual y CTA apropiado al rol del usuario
- Manejo de errores global: error de red, sesión expirada (401 → redirigir a login con mensaje), sin permisos (403 → toast claro), error del servidor (500 → toast genérico)
- Optimización del listado de animales para hatos grandes: paginación servidor con límite de 50 por página, búsqueda con debounce de 300ms, filtros como query params para que se mantengan al recargar
- Verificar que cada acción del veterinario y operario está limitada correctamente con withRole en backend, no solo ocultando botones en el frontend
- Revisión responsive: la prioridad es 360px (celulares de gama media usados en campo) y 768px (tablets). El módulo de producción de leche debe ser perfecto en celular porque ahí es donde se usa
- Verificar que ningún componente del cliente importa SUPABASE_SERVICE_ROLE_KEY ni JWT_SECRET ni ninguna variable privada
- Revisión de accesibilidad básica: contraste de texto cumple WCAG AA, labels de formularios correctos, focus visible en navegación con teclado

Para el cierre técnico:
- npm run typecheck — cero errores
- npm run lint — cero warnings
- npm run build — build exitoso
- Deploy en Vercel: verificar todas las variables de entorno (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET) configuradas en producción
- Probar en producción el flujo completo con los 3 roles:
  · Admin: crear bodega, crear animal, crear usuario, generar reporte fiscal
  · Veterinario: registrar vacunación masiva, registrar evento reproductivo, generar reporte sanitario
  · Operario: registrar producción de un turno completo, observar novedades

Al cerrar este proyecto:
- Registra en ESTADO_EJECUCION_SIGBOVINO.md la Fase 10 como Completada e incluye la URL de producción en el historial
- Crea doc/RESUMEN_FASE_10_PULIDO_FINAL.md con el resumen completo del proyecto: URL de producción, URL del repositorio, listado de funcionalidades implementadas, stack utilizado, tablas de Supabase creadas y estado final

El proyecto SIG Bovino está terminado. Tu trabajo en este repositorio concluye aquí.
```

---

> Sergio Palma — Doc: 1082937565
> Curso: Lógica y Programación — SIST0200
