# AGENTS.md — Agility CMS Category/Subcategory Picker

Purpose

- Custom field for Agility CMS to select categories/subcategories and store selections as comma-separated IDs in two fields.
- Production fetches from Agility Management API; local API routes are stubs for development only.

Stack & Dependencies

- Next.js 16 (app router), TypeScript, Tailwind CSS.
- `@agility/app-sdk` v2 for app context, auth, field updates.

Key Files

- Field UI: [app/fields/ArticleCategoryField/page.tsx](app/fields/ArticleCategoryField/page.tsx)
- Fetch logic: [lib/fetchData.ts](lib/fetchData.ts)
- Mgmt API client: [lib/mgmt-api-call.ts](lib/mgmt-api-call.ts)
- Region base URL helper: [lib/getMgmtAPIUrl.ts](lib/getMgmtAPIUrl.ts)
- Test example: [tests/lib/getMgmtAPIUrl.test.ts](tests/lib/getMgmtAPIUrl.test.ts)
- Config: [next.config.js](next.config.js), [tailwind.config.js](tailwind.config.js)

Screenshots

- **Read-only view** — selected categories/subcategories displayed in multi-column layout:

![Read Only Mode](screenshots/read-mode.png)

- **Edit mode** — interactive selection with automatic parent-child relationship handling:

![Edit Mode](screenshots/edit-mode.png)

Configuration Conventions

- Defaults (override via app install):
  - `categoriesListReferenceName`: `ArticleCategories`
  - `subcategoriesListReferenceName`: `ArticleSubCategories`
  - `categoryIdsFieldName`: `CategoriesIDs`
  - `subcategoryIdsFieldName`: `SubcategoriesIDs`
- Subcategory parent mapping: API may return `ParentCategoryID` or `parentCategoryID`; support both.

Data Flow

- Field loads SDK context via `useAgilityAppSDK()`; reads configuration, `instance.guid`, and `locale`.
- `getManagementAPIToken()` retrieves bearer token.
- `fetchData()` builds list endpoints and calls `mgmtAPICall()`; transforms list items into `Category[]` and `Subcategory[]`.
- UI supports read-only and edit views; selections are saved immediately using `contentItemMethods.setFieldValue()` to the two configured field names.
- Parent-child behavior: selecting a subcategory auto-selects its parent; deselecting a category removes its subcategories.

Management API URL Mapping

- `getMgmtAPIUrl()` chooses base URL by single-character suffix after the last `-` in the GUID:
  - `u` → https://mgmt.aglty.io/api/v1/
  - `c` → https://mgmt-ca.aglty.io/api/v1/
  - `e` → https://mgmt-eu.aglty.io/api/v1/
  - `a` → https://mgmt-aus.aglty.io/api/v1/
  - `d` → https://mgmt-dev.aglty.io/api/v1/
- If no matching single-char suffix, default to `https://mgmt.aglty.io/api/v1/`.

Commands

- Dev: `npm run dev` (runs on port 3001)
- Build: `npm run build`
- Start: `npm start`
- Lint: `npm run lint`
- Test: `npm test` (Vitest)

Patterns & Examples

- Fetching:
  - Token: `const token = await getManagementAPIToken()`
  - Call: `mgmtAPICall({ url, guid: instanceGuid, token })`
  - Transform: use `ListResponse.items[0]` in [fetchData](lib/fetchData.ts#L34-L62)
- Saving:
  - `contentItemMethods.setFieldValue({ name: categoryIdsFieldName, value: ids.join(',') })`
  - Repeat for `subcategoryIdsFieldName`.

Troubleshooting

- Categories not loading: verify list reference names, token, and URLs built in [fetchData](lib/fetchData.ts).
- Region issues: add or adjust cases/tests in [getMgmtAPIUrl](lib/getMgmtAPIUrl.ts) and [tests/lib/getMgmtAPIUrl.test.ts](tests/lib/getMgmtAPIUrl.test.ts).
- App/api routes are stubs; use Management API in production.

Extensibility

- For large lists, consider pagination or search within the field UI.
- Keep immediate-save behavior and parent-child rules consistent across changes.
