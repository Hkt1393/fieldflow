# FieldFlow Agent Instructions

This is an Expo / React Native mobile application targeting iOS and Android. Keep platform compatibility, performance, accessibility, and maintainability in view for all work.

## Expo SDK guidance

Expo ships breaking changes across SDK releases. Before writing code that uses Expo, EAS, or React Native APIs:

1. Read the major version of `expo` in `package.json`.
2. Consult the matching versioned docs at `https://docs.expo.dev/versions/v<major>.0.0/`.
3. For other Expo documentation, start at `https://docs.expo.dev/llms.txt` and follow links to the relevant page.

Use `npx expo install <package>` for packages that need Expo SDK-compatible versions. Use `bunx` instead of `npx` if the project uses Bun (`bun.lock` is present). Run lint and TypeScript checks before considering implementation work complete.

If `ios/` or `android/` directories do not exist, they are generated through Continuous Native Generation. Do not create or edit them by hand; configure native behavior through `app.json` and config plugins. Libraries with native code may require a development build rather than Expo Go.

For EAS commands, use `bunx eas-cli <command>` in Bun projects or `npx eas-cli@latest <command>` otherwise. See `https://docs.expo.dev/eas/index.md`.

---

# 1. PROJECT PRINCIPLES

FieldFlow is a production-oriented React Native application targeting:

- iOS
- Android

All implementation decisions must consider BOTH platforms.

Do not optimize for only iOS or only Android unless there is a documented platform-specific requirement.

Priorities:

- Maintainability
- Type safety
- Reusability
- Accessibility
- Responsive UI
- iOS/Android consistency
- Performance
- Simplicity
- Production-quality UX

Avoid premature abstraction and unnecessary dependencies.

==================================================
# 2. TECHNOLOGY STACK
==================================================

### Currently installed / configured

Confirmed by `package.json` and `package-lock.json`:

- Expo `~57.0.25` (locked `57.0.25`), React Native `0.86.3`, and React `19.2.3`.
- TypeScript `~6.0.3` (locked `6.0.3`).
- React Navigation: `@react-navigation/native` `^7.4.1` (locked `7.4.1`), `@react-navigation/native-stack` and `@react-navigation/bottom-tabs` `^7.19.2` (locked `7.19.2`).
- Redux Toolkit `^2.12.0` (locked `2.12.0`) and React Redux `^9.3.0` (locked `9.3.0`).
- Expo Font `~57.0.4` (locked `57.0.4`), Expo Status Bar `~57.0.1` (locked `57.0.1`), Inter fonts `^0.4.2` (locked `0.4.2`), safe-area context `~5.7.0` (locked `5.7.0`), React Native Screens `~4.26.0` (locked `4.26.2`), and React Native SVG `15.15.4`.

### Planned / not yet integrated

- React Hook Form: not declared in the project dependencies or lockfile, and not imported by application source.
- Zod: present in the lockfile only as an Expo tooling transitive dependency; it is not a direct project dependency and is not imported by application source.
- Supabase: no Supabase package is declared or locked, and application source does not initialize or call a Supabase client.

Do not import or use planned technologies in application code until they have been intentionally added and configured. A transitive dependency does not count as an application dependency or integration.

### Dependency discipline

- Prefer existing project capabilities and dependencies; evaluate necessity and maintenance cost before adding a package.
- For Expo-compatible packages, use `npx expo install <package>`. Use `bunx expo install <package>` if the project uses Bun (`bun.lock` is present).
- Do not upgrade or replace major dependencies without justification.

==================================================
# 3. SCREEN MVVM ARCHITECTURE
==================================================

Every screen MUST follow:

ScreenName/
├── index.ts
├── container.tsx
├── view.tsx
└── styles.tsx

Responsibilities:

index.ts
- Export only the container.
- No logic.
- No UI.
- No styles.

container.tsx
- Screen/ViewModel logic.
- State.
- Event handlers.
- Navigation orchestration.
- Hooks.
- Data preparation.
- Business interaction orchestration.

container.tsx should pass data and callbacks to the View.

view.tsx
- Presentation/UI only.
- No API calls.
- No Supabase calls.
- No Redux logic.
- No navigation logic.
- No business logic.
- No business calculations.
- No inline styles.

styles.tsx
- All screen-specific styles.
- Use StyleSheet.create().
- No inline styling in view.tsx.

==================================================
# 4. NO INLINE STYLES
==================================================

Inline styling is NOT allowed.

Do not write:

<View style={{ flex: 1 }} />

Do not write:

<Text style={{ color: '#000', fontSize: 16 }} />

Do not write:

style={{
  marginTop: 20,
  paddingHorizontal: 16,
}}

Use styles.tsx:

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

Then:

<View style={styles.container} />

Dynamic styles must also be handled through StyleSheet-based patterns or centralized style utilities.

Do not create ad-hoc inline style objects inside render methods.

==================================================
# 5. CENTRALIZED COLORS
==================================================

NEVER hardcode colors inside screens or components.

Do NOT write:

color: '#000000'

backgroundColor: '#FFFFFF'

borderColor: 'red'

Use the centralized theme:

src/theme/colors.ts

Example:

colors.text.primary
colors.background.primary
colors.surface
colors.border
colors.primary
colors.success
colors.warning
colors.error

All application colors must come from the centralized color system.

If a new color is genuinely required:

1. Add it to colors.ts.
2. Give it a semantic name.
3. Reuse it through the application.

Do not create random hex values throughout the codebase.

Do not use arbitrary color names such as "blue", "red", etc. for product UI.

==================================================
# 6. CENTRALIZED STRINGS
==================================================

NEVER hardcode user-facing strings directly inside components or screens.

Do NOT write:

<Text>Dashboard</Text>

<Button title="Save Lead" />

<Text>No leads found</Text>

Instead, create and use centralized string constants.

Create/use:

src/constants/strings.ts

Organize strings by domain:

strings.auth.*
strings.dashboard.*
strings.leads.*
strings.followUps.*
strings.common.*
strings.validation.*
strings.errors.*

Example:

strings.leads.title
strings.leads.empty.title
strings.leads.actions.add
strings.common.save
strings.common.cancel

All user-facing text must come from centralized strings.

This includes:

- Screen titles
- Button labels
- Empty states
- Error messages
- Validation messages
- Success messages
- Placeholder text
- Accessibility labels
- Confirmation messages
- Navigation labels where applicable

Do not duplicate the same string in multiple places.

If a string needs to change, it should be possible to update it centrally.

==================================================
# 7. CENTRALIZED DIMENSIONS / SPACING
==================================================

Do not scatter arbitrary dimensions throughout the application.

Use:

src/theme/

- spacing.ts
- radius.ts
- scaling.ts
- typography.ts

Use the theme system for common:

- spacing
- radius
- typography
- dimensions

Screen-specific values may exist in styles.tsx when they are genuinely specific to that screen, but avoid unnecessary magic numbers.

==================================================
# 8. RESPONSIVE DESIGN
==================================================

FieldFlow MUST be responsive across different mobile screen sizes.

Do not design only for one specific iPhone or Android device.

Use:

src/theme/scaling.ts

for reusable responsive utilities.

The scaling system must provide reusable functions for:

- Width
- Height
- Font size
- Radius

For example:

scaleWidth()
scaleHeight()
scaleFont()
scaleRadius()

Use these utilities where appropriate.

Example:

paddingHorizontal: scaleWidth(16)

height: scaleHeight(48)

fontSize: scaleFont(16)

borderRadius: scaleRadius(12)

Do not blindly scale every value.

Use responsive scaling where it improves consistency across different screen dimensions.

==================================================
# 9. SAFE AREA
==================================================

Safe-area handling is REQUIRED.

The application must properly handle:

- iPhone notch
- Dynamic Island
- Status bar
- Home indicator
- Android status bar
- Android navigation areas
- Different device aspect ratios

Use React Native safe-area handling appropriately.

Prefer:

SafeAreaProvider

and:

SafeAreaView / useSafeAreaInsets

from:

react-native-safe-area-context

Do not manually hardcode top padding to compensate for notches or status bars.

Do NOT write:

paddingTop: 50

just because it looks correct on one device.

Use safe-area insets.

Screens must be tested conceptually for both:

- iOS
- Android

==================================================
# 10. PLATFORM SUPPORT
==================================================

Every feature must be considered for both:

iOS
Android

Do not assume iOS behavior automatically applies to Android.

Pay attention to:

- Safe areas
- Keyboard behavior
- Navigation
- Status bars
- Shadows/elevation
- Touch feedback
- Date/time pickers
- Permissions
- Modals
- Bottom sheets
- Scroll behavior
- Text rendering
- Accessibility
- Platform-specific UI behavior

When platform-specific code is genuinely required, isolate it clearly.

Use:

Platform.OS

or platform-specific files only when necessary.

Do not create unnecessary platform-specific implementations.

==================================================
# 11. TYPOGRAPHY
==================================================

Do not hardcode arbitrary font sizes throughout the application.

Use:

src/theme/typography.ts

and the scaling system.

Typography should define semantic levels such as:

- display
- heading
- title
- body
- label
- caption

Use centralized typography consistently.

==================================================
# 12. REUSABLE UI COMPONENTS
==================================================

Reusable UI components belong in:

src/components/ui/

Examples:

- AppText
- AppButton
- AppInput
- AppCard
- AppBadge
- AppAvatar
- AppBottomSheet

Shared feedback components belong in:

src/components/feedback/

Examples:

- LoadingState
- EmptyState
- ErrorState
- OfflineBanner

Do not duplicate common UI patterns across screens.

Before creating a new shared component:

1. Search the codebase for an existing equivalent.
2. Reuse it if appropriate.
3. Only create a new component if there is a real reusable boundary.

==================================================
# 13. DOMAIN COMPONENTS
==================================================

Domain-specific components belong inside their feature.

Example:

src/features/leads/components/LeadCard.tsx

NOT:

src/components/ui/LeadCard.tsx

Shared components should remain domain-agnostic.

==================================================
# 14. DATA FLOW
==================================================

The required data flow is:

Screen View
↓
Container / ViewModel
↓
Feature Hook
↓
Service
↓
Repository / Data Access
↓
Data Source

Responsibilities:

- **View:** Render UI from props and shared components, and send user interactions through callbacks. Do not access APIs, Supabase, repositories, Redux business logic, or persistence. Do not implement business rules or business calculations.
- **Container / ViewModel:** Coordinate screen state, event handlers, navigation, and data passed to the View. Do not issue database queries directly.
- **Feature Hook:** Coordinate feature-specific data loading, mutations, and state through the established service/data-access boundary. Do not bypass that boundary.
- **Service:** Coordinate feature operations and business rules when needed. Use the data-access layer rather than allowing UI components to query the database.
- **Repository / Data Access:** Define or implement typed data contracts and isolate persistence details so mock and Supabase sources can be exchanged without rewriting screens.

Do not add layers that do not provide a useful boundary for the feature. Keep simple functionality simple and consistent with the existing codebase.

UI must NEVER directly call Supabase.

Do NOT write:

supabase.from('leads').select(...)

inside:

- view.tsx
- screen components
- reusable UI components

Supabase access belongs inside the service/data layer.

### Mock-first feature development

- Define domain types and the typed data contract before building data-dependent UI. Use the same contract for mock and Supabase implementations.
- Keep deterministic mock fixtures separate from mutable repository state and use stable IDs for tests.
- Select the data source centrally; do not scatter mock-mode conditionals across screens and hooks. Do not silently fall back to mock data when a Supabase request fails.
- Keep one source of truth for each entity within the selected data source. Ensure create, read, update, and delete operations stay consistent across list, detail, and edit screens.
- Model relationships explicitly, such as follow-ups linked to leads. Derive dashboard metrics from feature data rather than hardcoding them.
- Make mock data useful for testing loading, empty, error, filtering, sorting, validation, and ordinary user workflows.

Do not add repository layers where they are unnecessary; use the lightest boundary that keeps data access replaceable and typed.

### Future AI integration (planned, not implemented)

Potential AI capabilities include drafting lead follow-ups, summarizing notes, suggesting next actions, and answering natural-language questions about authorized CRM records. These remain optional additions, separate from core CRM operations. Use this request flow:

`Screen View → Container / ViewModel → AI Feature Hook → AI Service → Secure Backend Endpoint → AI Provider`

- Keep provider-specific code behind a replaceable service boundary. Never put a provider's private API key in the mobile app; route provider requests through a secured backend endpoint or server-side function.
- Authenticate and authorize each request before accessing customer data, preserve Supabase authorization and Row Level Security, and send only the minimum information needed.
- Validate inputs and model outputs. Handle timeouts, unavailable providers, rate limits, and quota exhaustion. The app must remain usable when AI is disabled or unavailable.
- Treat generated content as a suggestion for user review. Do not let AI send customer communications or make consequential changes without explicit user approval.
- Before selecting a provider, review current pricing, free-tier limits, privacy terms, and data-retention policies. Do not send confidential customer information until its data-handling terms have been evaluated.
- A free API tier may be investigated for development, but do not assume free usage is unlimited, permanent, production-ready, or appropriate for confidential data.

Do not select a provider, install an SDK, create AI services, add dependencies, or implement AI functionality without a separate approved task.

==================================================
# 15. SUPABASE
==================================================

Supabase must be isolated behind services.

Example:

features/leads/services/leadsService.ts

The UI should call:

leadsService.getLeads()

rather than directly accessing Supabase.

This allows the backend to be replaced later without rewriting the UI.

Never expose:

- Supabase service-role keys
- Private API keys
- Secrets

inside the mobile application.

==================================================
# 16. TYPESCRIPT
==================================================

Use strict TypeScript.

Avoid any.

Do not solve type errors by:

- adding any
- disabling strict mode
- using unsafe casts unnecessarily

Prefer:

- explicit interfaces
- discriminated unions
- typed navigation
- typed API responses
- typed component props

==================================================
# 17. ACCESSIBILITY
==================================================

Accessibility must be considered for every screen.

Use:

- Accessible touch targets
- accessibilityLabel
- accessibilityRole
- accessibilityHint where useful
- Sufficient contrast
- Meaningful labels
- Clear error messages

Do not rely on color alone to communicate information.

For example, a lead status should use:

Text + semantic color

rather than color alone.

==================================================
# 18. PERFORMANCE
==================================================

Performance should be considered from the beginning.

For lists:

- Prefer FlatList for large datasets.
- Use stable keys.
- Avoid unnecessary renders.
- Avoid unnecessary state.
- Use memoization only when justified.
- Avoid creating expensive objects/functions unnecessarily during render.

Do NOT blindly use:

useMemo
useCallback
React.memo

Explain the reason when they are introduced.

The project should eventually support approximately:

500–1,000 leads.

==================================================
# 19. FORMS
==================================================

Use:

React Hook Form
+
Zod

for complex forms.

Validation schemas belong with their respective feature.

Example:

features/leads/validation.ts

Do not duplicate validation rules between:

- UI
- Container
- Service

==================================================
# 20. STATE MANAGEMENT
==================================================

Use Redux Toolkit for genuine global state.

Do NOT put every piece of state into Redux.

Prefer:

Local state
→ screen-specific transient state

React Hook Form
→ form state

Feature hooks/services
→ feature data

Redux Toolkit
→ genuine global application state

Repository / data-access layer
→ persistence and data-source details

Supabase
→ remote persistence and authorization when integrated

Keep state ownership explicit: local component state is for transient UI state; React Hook Form and Zod own form state and validation; feature hooks/services coordinate feature data operations; Redux Toolkit owns only genuinely shared application state; and the repository/data-access layer owns persistence details. Do not put all application data in Redux by default or introduce another state-management library without a justified architectural review.

==================================================
# 21. NAVIGATION
==================================================

Use React Navigation.

Navigation types must be strongly typed.

Do not use:

navigation.navigate('SomeRandomString')

without proper typing.

Centralize route names/types where appropriate.

==================================================
# 22. ERROR HANDLING
==================================================

Every production feature should consider:

- Loading
- Success
- Empty
- Error
- Retry
- Offline

Do not build only the happy path.

Errors shown to users must use centralized strings.

==================================================
# 23. NO MAGIC VALUES
==================================================

Avoid hardcoded:

- Colors
- User-facing strings
- Route names
- Common spacing
- Common radii
- Common typography
- Device-specific dimensions

Use centralized constants/theme systems.

Screen-specific values are acceptable when genuinely necessary and documented by the design.

==================================================
# 24. DEPENDENCY DISCIPLINE
==================================================

Do not install a package simply because it makes a small task easier.

Before adding a dependency:

1. Check whether React Native/Expo already provides the functionality.
2. Check whether an existing project dependency can solve it.
3. Consider maintenance cost.
4. Consider Expo compatibility.
5. Consider iOS and Android compatibility.
6. Explain why the dependency is justified.

==================================================
# 25. FILE MODIFICATION DISCIPLINE
==================================================

Do not modify unrelated files.

Before making changes:

1. Inspect the existing architecture.
2. Find existing reusable components/utilities.
3. Follow established patterns.
4. Make the smallest appropriate change.

Do not redesign existing architecture unless there is a concrete technical reason.

==================================================
# 26. VERIFICATION
==================================================

After meaningful implementation:

Run appropriate checks.

At minimum when applicable:

npx tsc --noEmit

npm run lint

Relevant tests

For UI/navigation changes, verify the affected flow.

For build-impacting changes, verify the appropriate Expo build/export.

Never claim verification passed unless the command actually ran and passed.

If verification fails:

- Report the command.
- Report the failure.
- Explain the likely cause.
- Fix it if it is within scope.
- Otherwise clearly report the remaining issue.

Never hide failures.

==================================================
# 27. CODE STYLE
==================================================

Prefer:

- Small focused components
- Small focused functions
- Clear naming
- Explicit types
- Reusable components
- Predictable data flow
- Simple architecture

Avoid:

- Giant components
- Giant hooks
- Giant service files
- Deep abstraction chains
- Premature design patterns
- Duplicate logic

==================================================
# 28. CHANGE DISCIPLINE
==================================================

When implementing a feature or scoped task:

1. Inspect the relevant code, current architecture, and existing uncommitted changes.
2. Identify reusable components, utilities, services, and types.
3. Propose a bounded implementation plan before substantial changes.
4. Implement one feature or clearly scoped task at a time.
5. Preserve behavior outside the task's scope.
6. Run `npx tsc --noEmit`, `npm run lint`, and relevant tests when applicable.
7. Review the complete diff for unrelated changes.
8. Report verified results and remaining manual checks accurately.
9. Never claim a test, build, or visual inspection passed unless it was actually performed.

Before implementing a feature or changing architecture, consult this `AGENTS.md` and follow the established project structure.

Do not implement unrelated improvements.

If you discover a separate issue:

Report it separately rather than silently expanding the task.

==================================================
# 29. ARCHITECTURAL CHALLENGE
==================================================

Do not blindly follow a requested implementation if it conflicts with the project's architecture or creates significant technical debt.

When a meaningful architectural concern exists:

1. Explain the concern.
2. Explain the impact.
3. Propose an alternative.
4. Explain the tradeoff.
5. Ask for approval before making a major architectural change.

==================================================
# 30. FIELD FLOW DESIGN SYSTEM
==================================================

FieldFlow follows a centralized design system.

All UI should derive from:

src/theme/

- colors.ts
- typography.ts
- spacing.ts
- radius.ts
- scaling.ts

and centralized strings:

src/constants/strings.ts

Do not create independent styling systems inside individual screens.

Do not introduce arbitrary colors, fonts, spacing, radii, or strings.

==================================================
# 31. FINAL QUALITY STANDARD
==================================================

Before considering a feature complete, verify:

- TypeScript passes.
- ESLint passes.
- No unnecessary any.
- No inline styles.
- No hardcoded colors.
- No hardcoded user-facing strings.
- No unnecessary magic values.
- Safe areas are handled.
- Responsive behavior is considered.
- iOS behavior is considered.
- Android behavior is considered.
- Accessibility is considered.
- Existing components are reused where appropriate.
- Navigation remains typed.
- UI does not directly access Supabase.
- No secrets are committed.
- Loading/empty/error states are considered where applicable.
- No unrelated files were changed.

The goal is not maximum abstraction.

The goal is production-quality React Native engineering that remains understandable and maintainable.
