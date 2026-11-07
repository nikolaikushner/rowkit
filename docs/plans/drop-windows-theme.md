# Plan: убрать тему Windows 98

**Date:** 2026-11-07 · **Branch:** `main` (на 3 коммита позади `origin/main`, это только version bump релиза) · **Status:** in progress — тема снята с `:root` и с сайта; `win98Vars` и пиксельные иконки ещё в исходниках
**Source:** запрос убрать Windows-тему. Сейчас в `ROADMAP.md`, пункт Now №1, записано другое: сделать modern темой по умолчанию и оставить Windows 98 второй.

## Problem

Библиотека по-прежнему рисуется как Windows 98, если на странице нет атрибута: `:root` несёт `win98Vars` (`packages/tokens/src/themes/index.ts`). Modern включается только через `data-theme="modern"`. Сайт и Storybook уже открываются в modern, а пакет — нет, и вся вторая система значений (цвета, фаски, пиксельные иконки, style switches) живёт ради темы, которую потребитель видит первой.

## Outcome

Потребитель без атрибута получает modern, светлый и тёмный. `data-theme="win98"` больше ничего не переключает. Компоненты остаются теми же: `Window`, `GroupBox`, `StatusBar` рисуются современными значениями токенов, а не отдельным хромoм Windows 98.

## Success criteria

- [x] В собранном `rowkit/styles` на `:root` стоят нынешние `modernLightVars`, а `[data-theme="win98"]` отсутствует.
- [ ] `pnpm test`, `pnpm test:a11y` и `pnpm test:a11y:modern` зелёные. Отдельного прогона «Windows 98» больше нет: modern light и modern dark покрывают обе схемы.
- [ ] `pnpm visual:check` и `pnpm visual:check --theme modern` дают одни и те же кадры (флаг темы у скриншотов удалён вместе с темой).
- [ ] В `packages/ui/src` и `packages/tokens/src` не остаётся значения, которое существует только чтобы отличить Windows 98: ни `win98Vars`, ни пиксельного набора как дефолтных иконок.
- [x] Changeset помечен `minor` и говорит, что страница без атрибута меняет внешний вид, а `data-theme="win98"` перестаёт работать. Бета: ломающее изменение публикуется как minor (`AGENTS.md`, правило 8). Файл: `.changeset/drop-windows-theme.md`.

## Non-goals

- Не перерисовывать компоненты заново. Они уже читают токены; меняются значения по умолчанию и удаляется вторая шкала.
- Не трогать бренд (знак, wordmark, vermilion). Он и сейчас стоит над темами.
- Не делать React-порт и не публиковать Figma-кит.
- Не выкидывать `Window`, `GroupBox`, `StatusBar`, `ScrollArea`. У них есть modern-значения. Удаление этих компонентов — отдельное решение, если после смены дефолта они выглядят чужими.
- Не строить `checkTheme` / агентскую тему из Now №2 в том же изменении. После смены дефолта тот пункт просто стартует от modern, а не от Windows 98.

## Context found in the codebase

Тема — это значения custom properties, не классы с именем темы. Компоненты пишут `bg-control`, `shadow-sunken`, `focus-label`. Разница тем живёт в:

- `packages/tokens/src/themes/index.ts` — `win98Vars` на `:root` и на `[data-theme="win98"]`, `modernLightVars` / `modernDarkVars` на `[data-theme="modern"]`. Сборка CSS: `packages/tokens/src/css.ts` (`buildThemeCss`).
- Шкалы Windows 98, которые modern перекрывает целиком: `color.ts`, `shadow.ts`, `size.ts`, `radius.ts` (`radiusBase = 0`), `style.ts`, `typography.ts`. Modern: `packages/tokens/src/themes/modern.ts`.
- Style switches (`--rk-press-shift`, `focus-label` / `focus-ring` / `focus-outer`, `--rk-icon-pixels`, `--rk-dither-image`, `--rk-caption-order`). Компонент не знает, какая тема его рисует. После удаления Windows 98 часть switches схлопывается в одно значение и удаляется, если её читает только мёртвая ветка.
- Иконки: пиксельный набор в `packages/ui/src/icons/`, контурный — `packages/ui/src/icons/modern/` и маски в `packages/ui/src/styles/modern-icons.css`. Переключение — `--rk-icon-pixels` / `--rk-icon-glyphs` в `style.ts` и `modernStyle`.
- Сайт уже по умолчанию modern: `docs/.vitepress/theme/components/site/useSiteTheme.ts`. Переключатель и `win98:`-варианты лендинга: `docs/.vitepress/theme/tokens.css`, `docs/.vitepress/theme/components/landing/*`, `ThemeBuilder.vue`.
- Storybook открывается в modern, браузерные тесты — в Windows 98 (` .storybook/preview.ts`, `initialTheme` при `MODE === 'test'`).
- `Switch` (добавлен вместе с этим планом) читает новые токены `switch-h`, `switch-w`, `switch-thumb`, `switch-inset`, `switch-travel` в обеих темах. Их тоже надо свести к одной шкале.

Ближайший уже сделанный образец «тема как значения»: modern в `packages/tokens/src/themes/modern.ts` и тест `themes.test.ts` («modern sets everything Windows 98 sets»). Удаление — это инверсия: одна шкала, и тест, что второй больше нет.

## Design

**Chosen: modern становится единственной шкалой на `:root`, Windows 98 удаляется целиком, компоненты остаются.** Сначала дефолт переключается и тесты, завязанные на фаски и пунктир, переписываются на modern. Потом удаляются `win98Vars`, пиксельные иконки и style switches, у которых не осталось второго значения. Сайт теряет переключатель темы последним, когда пакет уже не умеет `win98`.

**Why over the alternatives:**

| Approach   | How                                                                                                                                                          | Trade-off                                                                                                                             | Verdict                                                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| A (chosen) | `:root` = нынешний modern. `data-theme` для встроенных тем не нужен; `data-color-scheme` остаётся. `defineTheme()` по-прежнему даёт свою тему поверх modern. | Ломает внешний вид у всех, кто не ставил атрибут. В бете это и есть обещанная свобода сломать API, с changeset.                       | Делать так.                                                                                                                  |
| B          | Оставить Windows 98, только перестать делать её дефолтом (`data-theme="win98"`). Это Now №1 в роадмапе.                                                      | Меньше diff, но вторая шкала, пиксельные иконки и `win98:` на сайте остаются навсегда. Запрос был убрать тему, не спрятать.           | Отвергнут.                                                                                                                   |
| C          | Удалить заодно `Window`, `StatusBar`, пиксельные иконки как публичный API и `GroupBox`.                                                                      | Это уже смена набора компонентов, не темы. `GroupBox` — fieldset, он нужен формам. `Window` в modern уже имеет свои токены заголовка. | Отвергнут как часть этой работы. Компоненты остаются; если после смены дефолта `Window` выглядит лишним, это отдельный план. |

**What would change this decision:** дизайнер или реальное приложение хочет Windows 98 как поставляемую тему. Тогда остаётся подход B, и этот план закрывается.

**Touches:** публичный CSS (`rowkit/styles`), `defineTheme` / `ThemeName`, дефолт без атрибута, иконки, доки и лендинг, Storybook, визуальные тесты. Миграции данных нет. Новых зависимостей нет.

## Steps

Порядок по риску. Каждый шаг оставляет библиотеку собираемой.

### 1. Прогнать библиотеку с modern на `:root`, не удаляя win98 — S · `[ ]`

- **Why first:** неизвестно, сколько тестов и компонентов молча завязаны на то, что дефолт — фаска и пунктир. Это надо увидеть до удаления шкалы.
- **Files:** `packages/tokens/src/css.ts` (`buildThemeCss`), `packages/tokens/src/themes/index.ts` (`win98Vars` остаётся, но `:root` временно получает `modernLightVars`), `.storybook/preview.ts` (тестовый `initialTheme`).
- **Does:** `:root` объявляет modern light. `[data-theme="win98"]` пока ещё переключает обратно, чтобы diff тестов был виден, а не смешан с удалением API. Браузерные тесты стартуют без атрибута, то есть уже в modern.
- **Verify:** `pnpm --filter @rowkit/tokens test` и `pnpm test`. Список упавших тестов — вход шага 2. Ожидаемо падают утверждения про `outlineStyle === 'dotted'`, bevel-строки и `--rk-icon-pixels`.
- **Depends on:** —

### 2. Переписать утверждения, которые проверяли Windows 98, на modern — M · `[ ]`

- **Why first:** пока они зелёные только на старом дефолте, удалять шкалу нельзя: зелёный прогон ничего не докажет.
- **Files:** тесты, которые читают вычисленный стиль или класс фаски. Точно: `Checkbox.stories.ts` и `Switch.stories.ts` (`outlineStyle === 'dotted'`), `packages/ui/src/styles/theme.test.ts`, `packages/ui/src/components/Button/Button.test.ts`, `DataTable.test.ts`, `Skeleton.test.ts`, `Badge.test.ts`, `ProgressBar.test.ts`, `GroupBox.test.ts`, `Dialog.test.ts`, `packages/tokens/src/themes/themes.test.ts`, `packages/tokens/src/contrast.test.ts`.
- **Does:** пунктир заменяется на кольцо (`focus-outer`, ширина 3px, `outline-style: solid`). Фаски — на тени modern. Иконки в тесте — контурные. Контраст считается по `modernLightColor` / `modernDarkColor`, не по VGA-палитре.
- **Verify:** `pnpm test` и `pnpm test:a11y` зелёные на дефолте из шага 1.
- **Depends on:** 1

### 3. Удалить шкалу Windows 98 и атрибут `win98` — M · `[ ]`

- **Why first:** это и есть ломающее изменение. Делается, когда шаг 2 уже зелёный, иначе не отличить «сломали тему» от «сломали тест».
- **Files:** `packages/tokens/src/color.ts`, `shadow.ts`, `size.ts`, `radius.ts`, `style.ts`, `typography.ts` (значения становятся нынешними modern; файл `themes/modern.ts` либо вливается в них, либо остаётся единственным источником и `win98Vars` удаляется), `packages/tokens/src/themes/index.ts` (`themeNames`, `win98Vars`), `packages/tokens/src/css.ts`, `packages/tokens/src/reference.ts` (колонка `win98` у `TokenReference` уходит), `packages/ui/src/styles/index.css` (комментарии и правила, которые существуют только для второй темы).
- **Does:** одна шкала. `data-color-scheme="dark"` по-прежнему переключает тёмную схему на любом элементе, без `data-theme="modern"`. `defineTheme()` стартует от modern. `ThemeName` больше не содержит `'win98'`. Токены `switch-*` остаются одной парой значений (бывшие modern: 20×36).
- **Verify:** `pnpm --filter @rowkit/tokens test`; в CSS нет `data-theme="win98"` и нет `#c0c0c0` / `#000080` как дефолта. `pnpm typecheck`.
- **Depends on:** 2

### 4. Оставить один набор иконок — контурный — M · `[ ]`

- **Files:** `packages/ui/src/icons/modern/`, `packages/ui/src/styles/modern-icons.css`, `packages/ui/src/icons/*.vue` (пиксельные), `packages/ui/src/icons/index.ts`, `style.ts` ключи `icon-pixels`, `icon-glyphs`, `glyph-scale`, где они только прячут пиксели. Команда `pnpm icons:modern`.
- **Does:** компонент импортирует одну иконку. Маска, которая рисовалась поверх пикселей, становится самой иконкой. Пиксельные `.vue` удаляются, публичные имена (`CheckGlyphIcon`, `PlusIcon`, …) сохраняются, чтобы не ломать импорт.
- **Verify:** `pnpm --filter rowkit test -- src/icons` и сторис `Icons`. В DOM нет двух наложенных глифов.
- **Depends on:** 3. Можно параллельно с 5, после 3.

### 5. Схлопнуть style switches, у которых не осталось второго значения — M · `[ ]`

- **Files:** `packages/tokens/src/style.ts`, чтения в `*.variants.ts` (`--rk-press-shift`, `--rk-dither-image`, `--rk-caption-order`, `--rk-footer-direction`, `--rk-radio-fill`, `focus-label-width`). Список снимается поиском по `--rk-` после шага 3: switch, который modern ставит в `0px` / `none` и который больше нечем перекрыть, удаляется вместе с классом, который его читает.
- **Does:** компонент пишет итоговое поведение прямо (кольцо фокуса, без сдвига нажатия, без дизера), если переменная больше не тема. Переменную, которую `defineTheme()` всё ещё должен уметь менять (длительность, радиус, цвета), не трогать.
- **Verify:** `packages/ui/src/styles/variants.test.ts` и `motion.test.ts`. `pnpm size` — бюджет не вырос.
- **Depends on:** 3

### 6. Сайт, Storybook, доки — M · `[ ]`

- **Files:** `docs/.vitepress/theme/tokens.css` (варианты `win98:` / `modern:`), `docs/.vitepress/theme/components/landing/*`, `LookSwitch.vue`, `ComponentsLook.vue`, `ThemeBuilder.vue`, `useSiteTheme.ts`, `docs/foundations/themes.md`, `docs/installation.md`, `docs/introduction.md`, `README.md`, `AGENTS.md` (правило «две темы»), `.storybook/preview.ts`, `design/briefs/site.md` только если бриф ещё описывает переключатель как текущее поведение.
- **Does:** переключатель Windows 98 / Modern уходит. Тёмный режим остаётся. Страницы компонентов больше не обещают пунктир и серебро. `pnpm docs:reference` пересобирает таблицу токенов без колонки Windows 98.
- **Verify:** `pnpm --filter docs build` (или скрипт сборки сайта из корня). Лендинг и страница Themes открываются без `?theme=win98`.
- **Depends on:** 3. Параллельно с 4 и 5.

### 7. Changeset, роадмап, визуальная проверка — S · `[ ]`

- **Files:** `.changeset/*.md`, `ROADMAP.md` (Now №1 закрыт сильнее, чем был записан: тема не стала второй, она удалена), `docs/roadmap.md`.
- **Does:** changeset от лица потребителя: без атрибута страница выглядит как modern; `data-theme="win98"` ничего не делает; свои темы через `defineTheme()` остаются. Прогнать `pnpm visual:check`, прочитать PNG.
- **Verify:** PNG в обеих схемах, `pnpm test:a11y`, `pnpm size`.
- **Depends on:** 4, 5, 6

## Risks

| Risk                                                                                                                                                  | Early signal                                                                                                               | Cheapest way to resolve it now                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Компонент кодирует Windows 98 не токеном, а разметкой (два глифа, порядок кнопок заголовка, дизер как фон).                                           | Шаг 1: скриншот или тест, который падает не из-за цвета, а из-за структуры.                                                | Не удалять шкалу, пока такой компонент не назван. Чинить его отдельным коммитом внутри шага 2.                                           |
| Контраст modern dark не дотягивает AA там, где VGA-палитра проходила за счёт чёрного на сером.                                                        | `contrast.test.ts` после смены базы.                                                                                       | Чинить значение в `modern.ts`, не возвращать VGA.                                                                                        |
| Потребитель уже поставил `data-theme="win98"` и после релиза получит modern внутри этого региона, потому что атрибут перестанет объявлять переменные. | Нет рантайм-сигнала.                                                                                                       | Changeset и абзац в installation: неизвестный `data-theme` больше не включает встроенную тему. `defineTheme` для своей темы не ломается. |
| `Switch` и новые `switch-*` токены разъедутся, если шаг 3 возьмёт win98-пиксели (14×26) вместо modern (20×36).                                        | Тест `a switch thumb travels exactly the room left inside its track` останется зелёным на обеих шкалах и ничего не скажет. | В шаге 3 явно оставить modern-числа: 20 / 36 / 16 / 2 / 16.                                                                              |

## Rollback

Каждый шаг — отдельный коммит до публикации. Откат до релиза: revert. После публикации beta-тега откат — следующий beta, который возвращает `win98Vars` на `:root`. Данных нет, миграции нет.

Пока шаг 3 не смержен, шаг 1 обратим одной правкой `css.ts`.

## Test plan

- Unit: `@rowkit/tokens` (темы, контраст, CSS не содержит `win98`), компонентные тесты после переписывания утверждений.
- Browser: `pnpm test:a11y` на дефолте (это уже modern) и тёмная схема. Отдельный `test:a11y:modern` удалить, когда он совпадёт с дефолтным прогоном.
- CI: lint, typecheck, test, a11y, size, drift сгенерированных доков (`docs:props`, `docs:agents`, `docs:reference`).
- Намеренно не тестируем пиксель-в-пиксель совпадение со старыми PNG Windows 98. Их заменяют новые кадры modern.

## Rollout

Без флага. Библиотека в бете, тег `beta`. Один minor changeset на шаг 3 (публичный слом); шаги 1–2 могут жить в той же ветке и не публиковаться отдельно, если `:root` ещё не в релизе. Публиковать, когда шаги 1–7 зелёные, а не после шага 1: промежуточный `:root = modern` при живом `data-theme="win98"` — это как раз Now №1, и если остановиться там, план B оказался сделан вместо A.

Подтверждение: чистая страница без атрибута рисует кнопку с радиусом и кольцом фокуса, не с фаской. `document.documentElement.dataset.theme = 'win98'` ничего не меняет.

## Open questions

- [ ] Удаляем тему целиком (этот план) или только меняем дефолт и оставляем `data-theme="win98"` (Now №1)? Решает мейнтейнер до шага 3. До этого шага 1 и 2 полезны в обоих вариантах.
- [ ] `Window` после смены дефолта остаётся в наборе или уходит следом? Не блокирует шаги 1–3. Решает мейнтейнер по скриншоту шага 7.

## Deferred / out of scope

- Меню, Tabs, Combobox, DropdownMenu, Popover, Sheet — следующая волна компонентов, не часть удаления темы.
- `checkTheme` и превью темы для агента (Now №2). После этого плана база для них — modern.
- Тёмная схема Windows 98. Её нет и не будет: уходит сама тема.
