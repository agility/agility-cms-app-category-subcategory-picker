# Copilot Instructions: Agility CMS Category/Subcategory Picker

Use these repo-specific notes to stay productive and consistent when coding.

## Overview

- Next.js 16 app (app directory), TypeScript, Tailwind, Agility Apps SDK v2.
- Purpose: custom field to select categories and subcategories stored as comma-separated IDs in two fields.
- Local dev runs on port 3001 via `npm run dev`.

## Architecture & Data Flow

- Field UI: `app/fields/ArticleCategoryField/page.tsx` drives read-only and edit modes, responsive columns, and selection logic.
- SDK: `useAgilityAppSDK()` provides `contentItem`, `instance.guid`, `locale`, and `appInstallContext.configuration`.
- Auth: `getManagementAPIToken()` supplies the bearer token for Management API calls.
- Fetch: `lib/fetchData.ts` builds list URLs and pulls categories/subcategories via `lib/mgmt-api-call.ts`.
- Storage: selections saved immediately using `contentItemMethods.setFieldValue()` as comma-separated strings into two fields (configurable names).

## Management API Conventions

- Base URL selection is derived from the instance GUID suffix via `lib/getMgmtAPIUrl.ts`:
  - `u` → `https://mgmt.aglty.io/api/v1/`
  - `c` → `https://mgmt-ca.aglty.io/api/v1/`
  - `e` → `https://mgmt-eu.aglty.io/api/v1/`
  - `a` → `https://mgmt-aus.aglty.io/api/v1/`
  - `d` → `https://mgmt-dev.aglty.io/api/v1/`
- List endpoints constructed in `fetchData()` (examples shown there) include `fields`, `sort`, `take`, `skip`, `showDeleted`.
- Subcategories may use `ParentCategoryID` or `parentCategoryID`; map either when transforming responses.

## Project Conventions

- Configuration defaults (overridable via app install):
  - `categoriesListReferenceName`: `ArticleCategories`
  - `subcategoriesListReferenceName`: `ArticleSubCategories`
  - `categoryIdsFieldName`: `CategoriesIDs`
  - `subcategoryIdsFieldName`: `SubcategoriesIDs`
- Types: see `types/index.ts` for `Category`, `Subcategory`, and flexible field storage shape.
- API routes in `app/api/*` are development stubs; production uses direct Management API.

## Workflows

- Dev: `npm run dev` (port 3001). Build: `npm run build`. Start: `npm start`.
- Lint: `npm run lint` (Next ESLint config). Test: `npm test` (Vitest).
- Tests currently cover `getMgmtAPIUrl` (`tests/lib/getMgmtAPIUrl.test.ts`). Add new tests under `tests/` with Vitest.

## Patterns & Examples

- Fetching data:
  - Get token with `getManagementAPIToken()`; call `mgmtAPICall({ url, guid: instanceGuid, token })`.
  - Transform `ListResponse.items[0]` into `Category[]` / `Subcategory[]` as in `fetchData()`.
- Saving values:
  - Use `contentItemMethods.setFieldValue({ name: categoryIdsFieldName, value: ids.join(',') })` and same for subcategories.
- UI behavior:
  - Selecting a subcategory auto-selects its parent; deselecting a category removes its subcategories.

## Integration Notes

- No environment variables required; all instance context and auth come from the SDK.
- Uninstall webhook handler: `app/api/app-uninstall/route.ts`.
- Tailwind setup in `styles/globals.css` and `tailwind.config.js`; `next.config.js` adds a permissive `Permissions-Policy` header.

## Debug Tips

- Prefer direct Management API over the stub `app/api/*` routes in production.
- If categories don’t load: verify list reference names and token, check `fetchData()` URL construction.
- For base URL issues, add/adjust tests in `tests/lib/getMgmtAPIUrl.test.ts` to validate GUID suffix mapping.
